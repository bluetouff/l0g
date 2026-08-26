#!/usr/bin/env python3
"""Agrégateur best-effort des cinq signaux du bloc « signaux de risque ».

Le contrat distingue toujours la date de construction du fichier, la dernière
tentative de collecte, le dernier succès et la date publiée par le producteur.
Une valeur conservée après panne reste disponible, mais ne peut plus paraître
fraîche : ``sourceStatus=fallback`` et ``fallbackUsed=true`` sont publiés avec
la cause nettoyée de toute information sensible.

Le fichier reste compatible avec les anciens clients grâce à ``updated`` et
``indices``. ``updated`` date l'assemblage, jamais la fraîcheur individuelle.
"""

from __future__ import annotations

import datetime
import hashlib
import json
import os
import re
import subprocess
import tempfile
import urllib.request


DATA_DIR = os.environ.get("L0G_RISK_DATA_DIR", "/var/www/l0g-data")
OUT = os.environ.get("L0G_RISK_OUT", os.path.join(DATA_DIR, "risk.json"))
CONFLUENCE_OUT = os.environ.get(
    "L0G_CONFLUENCE_OUT", os.path.join(DATA_DIR, "confluence.json")
)
CONFLUENCE_URL = os.environ.get(
    "L0G_CONFLUENCE_URL",
    "https://13flow.eu/api/signals/confluence?window=90&min_score=0",
)
CONFLUENCE_STALE_SECONDS = int(
    os.environ.get("L0G_CONFLUENCE_STALE_SECONDS", str(26 * 3600))
)
US_VENV = os.environ.get("L0G_US_PYTHON", "/opt/macro_dashboard/venv/bin/python")
US_PARQUET = os.environ.get(
    "L0G_US_PARQUET",
    "/var/lib/macro_dashboard/snapshots/current_snapshot.parquet",
)

SOURCES = [
    {"key": "us", "type": "us", "url": "file://" + US_PARQUET},
    {
        "key": "eu",
        "type": "euro",
        "url": os.environ.get("L0G_EU_URL", "https://euro.l0g.fr/snapshot.json"),
    },
    {
        "key": "yen",
        "type": "yct",
        "url": os.environ.get("L0G_YEN_URL", "https://yct.l0g.fr/data.json"),
        "status_url": os.environ.get(
            "L0G_YEN_STATUS_URL", "https://yct.l0g.fr/status.json"
        ),
    },
    {
        "key": "energie",
        "type": "energie",
        "url": os.environ.get(
            "L0G_ENERGIE_URL", "https://energie.l0g.fr/snapshot.json"
        ),
    },
    {
        "key": "debt",
        "type": "debt",
        "url": os.environ.get("L0G_DEBT_URL", "https://debt.l0g.fr/latest.json"),
    },
]

# Il s'agit de SLA de publication des producteurs, pas de la fréquence des
# phénomènes économiques sous-jacents. Les durées ISO sont publiques.
STALE_AFTER = {
    "us": (36 * 3600, "PT36H"),
    "eu": (36 * 3600, "PT36H"),
    "yen": (12 * 3600, "PT12H"),
    "energie": (6 * 3600, "PT6H"),
    "debt": (6 * 3600, "PT6H"),
}

PRODUCER_REPOSITORIES = {
    "us": "https://github.com/bluetouff/macro_dashboard",
    "eu": "https://github.com/bluetouff/euro-macro-dashboard",
    "yen": "https://github.com/bluetouff/carry-yen-monitor",
    "energie": "https://github.com/bluetouff/energie-stress-monitor",
    "debt": "https://github.com/bluetouff/debt-risk-radar",
}

ENERGIE_REGIME = {
    "détendu": ("Détendu", "calm"),
    "normal": ("Normal", "moderate"),
    "tendu": ("Tendu", "elevated"),
    "crise": ("Crise", "crisis"),
}


def now_z() -> str:
    return (
        datetime.datetime.now(datetime.timezone.utc)
        .isoformat(timespec="seconds")
        .replace("+00:00", "Z")
    )


def iso_z(value) -> str | None:
    if not value:
        return None
    raw = str(value).strip()
    if raw.endswith("Z"):
        raw = raw[:-1] + "+00:00"
    try:
        parsed = datetime.datetime.fromisoformat(raw)
    except ValueError:
        return None
    if parsed.tzinfo is None:
        return None
    return parsed.astimezone(datetime.timezone.utc).isoformat(timespec="seconds").replace(
        "+00:00", "Z"
    )


def parse_iso(value) -> datetime.datetime | None:
    normalized = iso_z(value)
    if not normalized:
        return None
    return datetime.datetime.fromisoformat(normalized.replace("Z", "+00:00"))


def safe_error(error: Exception) -> str:
    text = str(error).replace("\n", " ").replace("\r", " ")
    text = re.sub(r"(?i)(api[_-]?key|token|authorization)=?[^&\s]*", r"\1=[redacted]", text)
    text = re.sub(r"https?://[^\s?]+\?[^\s]+", "URL?[redacted]", text)
    return re.sub(r"\s+", " ", text).strip()[:240] or error.__class__.__name__


def tone_from_value(value):
    try:
        value = float(value)
    except (TypeError, ValueError):
        return "moderate"
    if value < 30:
        return "calm"
    if value < 55:
        return "moderate"
    if value < 75:
        return "elevated"
    return "crisis"


def level_uniform(value):
    if value < 30:
        return "Faible", "calm"
    if value < 55:
        return "Modéré", "moderate"
    if value < 75:
        return "Élevé", "elevated"
    return "Critique", "crisis"


def clamp(value, low=0.0, high=100.0):
    return max(low, min(high, value))


def fetch_json(url, timeout=10, max_bytes=5_000_000):
    request = urllib.request.Request(url, headers={"User-Agent": "l0g-risk/2.0"})
    with urllib.request.urlopen(request, timeout=timeout) as response:
        raw = response.read(max_bytes + 1)
    if len(raw) > max_bytes:
        raise ValueError("réponse trop volumineuse")
    return json.loads(raw)


def load_previous(path=OUT):
    try:
        with open(path, encoding="utf-8") as handle:
            payload = json.load(handle)
        return {item["key"]: item for item in payload.get("indices", [])}
    except Exception:
        return {}


def load_json(path):
    try:
        with open(path, encoding="utf-8") as handle:
            payload = json.load(handle)
        return payload if isinstance(payload, dict) else {}
    except Exception:
        return {}


def source_date(payload):
    for key in ("generated", "generated_at", "generatedAt", "updated", "timestamp"):
        value = iso_z(payload.get(key))
        if value:
            return value
    return None


def _observation_value(value):
    """Normalise une date économique sans la confondre avec une publication."""
    raw = str(value or "").strip()
    if re.fullmatch(r"\d{4}-\d{2}-\d{2}", raw):
        try:
            parsed = datetime.datetime.fromisoformat(raw).replace(
                tzinfo=datetime.timezone.utc
            )
        except ValueError:
            return None
        return raw + "T00:00:00Z", parsed, "date"
    normalized = iso_z(raw)
    parsed = parse_iso(normalized)
    return (normalized, parsed, "date-time") if normalized and parsed else None


def observation_fields(item, component_dates, attempt_at):
    """Publie la dernière observation d'un composite et sa fenêtre complète.

    ``observedAt`` est la date la plus récente parmi les composants réellement
    utilisés. La méthode et la fenêtre empêchent de l'interpréter comme si tous
    les composants partageaient cette date.
    """
    attempt = parse_iso(attempt_at)
    normalized = []
    published_components = {}
    for name, value in (component_dates or {}).items():
        observation = _observation_value(value)
        if not observation:
            continue
        canonical, parsed, precision = observation
        if attempt and parsed > attempt + datetime.timedelta(days=1):
            continue
        normalized.append((parsed, canonical, precision))
        published_components[str(name)] = value
    if not normalized:
        raise ValueError("date économique amont absente")
    normalized.sort(key=lambda row: row[0])
    item["observedAt"] = normalized[-1][1]
    item["observedAtMethod"] = "latest-component-observation"
    item["observationWindow"] = {
        "oldest": normalized[0][1],
        "latest": normalized[-1][1],
    }
    item["observationTimePrecision"] = normalized[-1][2]
    item["componentDates"] = published_components
    return item


def quality_fields(
    item, key, attempt_at, source_updated_at, source_url, source_checked_at=None
):
    seconds, duration = STALE_AFTER[key]
    checked_at = iso_z(source_checked_at)
    freshness_time = parse_iso(checked_at or source_updated_at)
    attempt_time = parse_iso(attempt_at)
    age_seconds = None
    if freshness_time and attempt_time:
        age_seconds = max(0, round((attempt_time - freshness_time).total_seconds()))
    item.update(
        {
            "sourceStatus": "ok",
            "qualityStatus": "nominal",
            "fallbackUsed": False,
            "fallbackLayer": None,
            "fallbackReason": None,
            "sourceUpdatedAt": source_updated_at,
            "sourcePublishedAt": source_updated_at,
            "retrievedAt": attempt_at,
            "lastAttemptAt": attempt_at,
            "lastSuccessAt": attempt_at,
            "staleAfter": duration,
            "ageSeconds": age_seconds,
            "timelinessStatus": (
                "stale" if age_seconds is not None and age_seconds > seconds else
                "fresh" if age_seconds is not None else "unknown"
            ),
            "sourceSnapshotUrl": source_url,
            "warnings": [],
            "producerRepository": PRODUCER_REPOSITORIES[key],
            "producerRevision": os.environ.get(f"L0G_{key.upper()}_REVISION") or None,
            "producerRevisionStatus": "reported" if os.environ.get(f"L0G_{key.upper()}_REVISION") else "unreported",
        }
    )
    if checked_at:
        item["sourceCheckedAt"] = checked_at
    return item


def idx_energie(src, attempt_at):
    data = fetch_json(src["url"])
    composite = data.get("composite") or {}
    score = composite.get("score")
    if score is None:
        raise ValueError("composite.score manquant")
    regime = (composite.get("regime") or "").strip().lower()
    level, tone = ENERGIE_REGIME.get(regime, ("n/d", tone_from_value(score)))
    item = quality_fields(
        {"key": "energie", "value": round(score), "scale": 100, "level": level, "tone": tone},
        "energie",
        attempt_at,
        source_date(data),
        src["url"],
    )

    series = data.get("series") or {}
    oil = [series.get("brent") or {}, series.get("wti") or {}]
    oil_sources = sorted({str(row.get("tip_source")) for row in oil if row.get("tip_source")})
    component_dates = {
        name: row.get("date")
        for name, row in series.items()
        if isinstance(row, dict) and row.get("date")
    }
    notes = [str(note)[:240] for note in (data.get("notes") or []) if note]
    if oil_sources == ["eia"]:
        item.update(
            {
                "qualityStatus": "official-delayed",
                "fallbackUsed": True,
                "fallbackLayer": "producer",
                "fallbackReason": "Brent et WTI utilisent le spot quotidien EIA officiel différé.",
            }
        )
        notes.insert(0, "Brent/WTI : source EIA quotidienne officielle, publication différée.")
    if notes and item["qualityStatus"] == "nominal":
        item["qualityStatus"] = "degraded"
    item["warnings"] = list(dict.fromkeys(notes))[:10]
    item["componentSources"] = {"oil": oil_sources}
    return observation_fields(item, component_dates, attempt_at)


def _tone_from_hex(value, fallback):
    try:
        color = value.lstrip("#")
        red, green = int(color[0:2], 16), int(color[2:4], 16)
    except Exception:
        return tone_from_value(fallback)
    if green >= 120 and red < 150:
        return "calm"
    if red >= 180 and green >= 150:
        return "moderate"
    if red >= 180 and green >= 60:
        return "elevated"
    if red >= 130 and green < 60:
        return "crisis"
    return tone_from_value(fallback)


def idx_euro(src, attempt_at):
    data = fetch_json(src["url"])
    source_revision = str(data.get("source_sha") or "").strip().lower()
    if not re.fullmatch(r"[a-f0-9]{40}", source_revision):
        raise ValueError("source_sha euro absent ou invalide")
    declared_revision = os.environ.get("L0G_EU_REVISION") or ""
    if declared_revision and source_revision != declared_revision:
        raise ValueError("révision publiée par euro différente du manifeste")
    score = data.get("global_score")
    if score is None:
        raise ValueError("global_score manquant")
    value = round(score)
    regime = data.get("regime") or {}
    raw = (regime.get("label") or "").split("/")[0].strip()
    label = re.sub(r"[^\w +().\-]", "", raw)[:24] or level_uniform(value)[0]
    item = quality_fields(
        {
            "key": "eu",
            "value": value,
            "scale": 100,
            "level": label,
            "tone": _tone_from_hex(regime.get("color", ""), value),
        },
        "eu",
        attempt_at,
        source_date(data),
        src["url"],
    )
    item["sourceRevision"] = source_revision
    component_dates = {}
    for family in data.get("families") or []:
        family_key = family.get("key") or "family"
        for indicator in family.get("indicators") or []:
            if indicator.get("as_of"):
                component_dates[f"{family_key}.{indicator.get('code') or 'indicator'}"] = indicator["as_of"]
    return observation_fields(item, component_dates, attempt_at)


US_WARNING, US_DANGER = 1.5, 2.5


def _us_zscore_to_100(zscore):
    if zscore < 0:
        value = 30 + zscore * 20.0
    elif zscore < US_WARNING:
        value = 30 + (zscore / US_WARNING) * 25.0
    elif zscore < US_DANGER:
        value = 55 + (zscore - US_WARNING) / (US_DANGER - US_WARNING) * 20.0
    else:
        value = 75 + (zscore - US_DANGER) * 5.0
    return max(0, min(100, round(value)))


def idx_us(src, attempt_at):
    code = (
        "import json,pandas as pd;"
        "df=pd.read_parquet(r'%s');"
        "w=df['weight'];s=df['stress_final'];"
        "score=(s*w).sum()/w.sum() if w.sum()>0 else float('nan');"
        "dates=pd.to_datetime(df['date'],errors='coerce').dropna();"
        "print(json.dumps({'score':float(score),'oldest':dates.min().date().isoformat(),'newest':dates.max().date().isoformat()}))"
        % US_PARQUET
    )
    result = subprocess.run(
        [US_VENV, "-c", code], capture_output=True, text=True, timeout=40
    )
    if result.returncode != 0 or not result.stdout.strip():
        raise RuntimeError("lecture parquet us: " + (result.stderr.strip()[:200] or "vide"))
    snapshot = json.loads(result.stdout.strip())
    zscore = float(snapshot["score"])
    if zscore != zscore:
        raise ValueError("global_score us = NaN")
    value = _us_zscore_to_100(zscore)
    level, tone = level_uniform(value)
    modified = datetime.datetime.fromtimestamp(
        os.path.getmtime(US_PARQUET), tz=datetime.timezone.utc
    ).isoformat(timespec="seconds").replace("+00:00", "Z")
    item = quality_fields(
        {
            "key": "us",
            "value": value,
            "rawValue": round(zscore, 8),
            "scale": 100,
            "level": level,
            "tone": tone,
        },
        "us",
        attempt_at,
        modified,
        src["url"],
    )
    return observation_fields(
        item,
        {"source-oldest": snapshot.get("oldest"), "source-newest": snapshot.get("newest")},
        attempt_at,
    )


def _parse_date(value):
    year, month, day = value.split("-")
    return datetime.date(int(year), int(month), int(day))


def idx_yct(src, attempt_at):
    data = fetch_json(src["url"])
    status = fetch_json(src["status_url"])
    checked_at = iso_z(status.get("checked_at"))
    if status.get("status") != "ok" or not checked_at:
        raise ValueError("statut yct absent ou non nominal")
    attempt_time = parse_iso(attempt_at)
    checked_time = parse_iso(checked_at)
    if attempt_time and checked_time and checked_time - attempt_time > datetime.timedelta(minutes=5):
        raise ValueError("horloge yct située dans le futur")
    source_statuses = status.get("sources") or {}
    for required in ("cot", "tff", "fed", "fx", "boj"):
        if (source_statuses.get(required) or {}).get("status") not in {
            "fresh",
            "verified-config",
        }:
            raise ValueError(f"source yct non nominale: {required}")
    by_date = {}
    for row in data.get("cot") or []:
        date = row.get("d")
        if date is None:
            continue
        open_interest = row.get("oi") or 0
        if date not in by_date or open_interest > (by_date[date].get("oi") or 0):
            by_date[date] = row
    cot = [by_date[key] for key in sorted(by_date)]
    nets = [row.get("net") for row in cot if row.get("net") is not None]
    if not nets:
        raise ValueError("cot vide")
    latest_net = cot[-1].get("net")
    crowd = 0.0
    if latest_net is not None and latest_net < 0:
        min_short = min(nets)
        if min_short < 0:
            crowd = clamp((latest_net / min_short) * 100.0)

    rates = data.get("rates") or {}
    fed, boj = rates.get("fed"), rates.get("boj")
    compress = clamp((5.25 - (fed - boj)) / 5.25 * 100.0) if fed is not None and boj is not None else 0.0

    fx = data.get("fx") or data.get("fxSeries") or []
    appreciation = 0.0
    if len(fx) >= 2 and fx[-1].get("v") and fx[-1].get("d"):
        last_value, last_date = fx[-1]["v"], _parse_date(fx[-1]["d"])
        target = last_date - datetime.timedelta(days=28)
        previous_value = fx[0]["v"]
        for point in fx:
            if point.get("d") and _parse_date(point["d"]) <= target and point.get("v"):
                previous_value = point["v"]
        if previous_value:
            appreciation = clamp(-(last_value / previous_value - 1.0) * 100.0 * 22.0)

    risk = round(crowd * 0.45 + appreciation * 0.35 + compress * 0.20)
    level = "Faible" if risk < 30 else "Modéré" if risk < 55 else "Élevé" if risk < 78 else "Critique"
    tone = "calm" if risk < 30 else "moderate" if risk < 55 else "elevated" if risk < 78 else "crisis"
    item = quality_fields(
        {"key": "yen", "value": risk, "scale": 100, "level": level, "tone": tone},
        "yen",
        attempt_at,
        source_date(data),
        src["url"],
        checked_at,
    )
    component_dates = {}
    if cot and cot[-1].get("d"):
        component_dates["cot"] = cot[-1]["d"]
    if fx and fx[-1].get("d"):
        component_dates["fx"] = fx[-1]["d"]
    return observation_fields(item, component_dates, attempt_at)


def idx_debt(src, attempt_at):
    data = fetch_json(src["url"])
    score = (data.get("score") or {}).get("current_stress")
    if score is None:
        score = (data.get("score") or {}).get("overall")
    if not isinstance(score, (int, float)):
        raise ValueError("score.current_stress manquant")
    value = round(score)
    status = str((data.get("score") or {}).get("status") or "")
    level = {"stress": "Stress", "watch": "Watch", "elevated": "Élevé", "calm": "Normal"}.get(status.lower(), level_uniform(value)[0])
    tone = {"stress": "stress", "watch": "elevated", "elevated": "elevated", "calm": "calm"}.get(status.lower(), tone_from_value(value))
    item = quality_fields(
        {"key": "debt", "value": value, "scale": 100, "level": level, "tone": tone},
        "debt",
        attempt_at,
        source_date(data),
        src["url"],
    )
    item["rawValue"] = score
    component_dates = {
        str(row.get("source") or f"source-{index}"): row.get("latest_date") or row.get("latestDate")
        for index, row in enumerate(data.get("sources") or [])
        if isinstance(row, dict) and (row.get("latest_date") or row.get("latestDate"))
    }
    return observation_fields(item, component_dates, attempt_at)


BUILDERS = {
    "energie": idx_energie,
    "euro": idx_euro,
    "us": idx_us,
    "yct": idx_yct,
    "debt": idx_debt,
}


def fallback_item(previous, key, attempt_at, reason):
    if not previous:
        return None
    item = dict(previous)
    item.update(
        {
            "sourceStatus": "fallback",
            "qualityStatus": "degraded",
            "fallbackUsed": True,
            "fallbackLayer": "aggregator",
            "fallbackReason": reason,
            "lastAttemptAt": attempt_at,
        }
    )
    # Le dernier succès date la collecte, pas nécessairement la donnée. Sans
    # date publiée par le producteur, la fraîcheur doit rester inconnue.
    source_time = parse_iso(item.get("sourceUpdatedAt"))
    attempt_time = parse_iso(attempt_at)
    age = max(0, round((attempt_time - source_time).total_seconds())) if source_time and attempt_time else None
    item["ageSeconds"] = age
    item["timelinessStatus"] = (
        "stale" if age is not None and age > STALE_AFTER[key][0] else
        "fresh" if age is not None else "unknown"
    )
    warnings = list(item.get("warnings") or [])
    item["warnings"] = list(dict.fromkeys([reason] + warnings))[:10]
    return item


def collect_indices(previous, sources=SOURCES, builders=BUILDERS, attempt_at=None):
    attempt_at = attempt_at or now_z()
    indices = []
    missing = []
    for src in sources:
        try:
            indices.append(builders[src["type"]](src, attempt_at))
        except Exception as error:
            reason = safe_error(error)
            fallback = fallback_item(previous.get(src["key"]), src["key"], attempt_at, reason)
            if fallback:
                indices.append(fallback)
            else:
                missing.append({"key": src["key"], "reason": reason})

    ok = sum(1 for item in indices if item.get("sourceStatus") == "ok")
    fallback = sum(1 for item in indices if item.get("fallbackUsed"))
    stale = sum(1 for item in indices if item.get("timelinessStatus") == "stale")
    degraded = sum(1 for item in indices if item.get("qualityStatus") != "nominal")
    status = "failed" if not indices else "degraded" if missing or fallback or stale or degraded else "ok"
    try:
        with open(__file__, "rb") as handle:
            source_hash = hashlib.sha256(handle.read()).hexdigest()
    except OSError:
        source_hash = None
    revision = os.environ.get("L0G_RISK_REVISION") or None
    return {
        "schema": "https://l0g.fr/schemas/risk-aggregate.json",
        "version": "2",
        "generated": attempt_at,
        "updated": attempt_at,
        "status": status,
        "software": {
            "repository": "https://github.com/bluetouff/l0g/tree/main/ops/risk-aggregator",
            "revision": revision,
            "revisionStatus": "reported" if revision else "unreported",
            "sourceSha256": source_hash,
        },
        "summary": {
            "expected": len(sources),
            "present": len(indices),
            "ok": ok,
            "fallback": fallback,
            "stale": stale,
            "degraded": degraded,
            "missing": missing,
        },
        "indices": indices,
        "note": "Best-effort explicite : updated/generated datent l'assemblage ; la fraîcheur se lit signal par signal.",
    }


def write_atomic(path, payload):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    descriptor, temporary = tempfile.mkstemp(dir=os.path.dirname(path))
    try:
        with os.fdopen(descriptor, "w", encoding="utf-8") as handle:
            json.dump(payload, handle, ensure_ascii=False, separators=(",", ":"))
            handle.write("\n")
            handle.flush()
            os.fsync(handle.fileno())
        os.chmod(temporary, 0o644)
        os.replace(temporary, path)
    except Exception:
        try:
            os.unlink(temporary)
        except OSError:
            pass
        raise


def _first(payload, *keys):
    for key in keys:
        value = payload.get(key)
        if value is not None:
            return value
    return None


def _average_age(buyers):
    days = [
        buyer.get("days_since_last_buy")
        for buyer in buyers
        if isinstance(buyer, dict) and isinstance(buyer.get("days_since_last_buy"), (int, float))
    ]
    return round(sum(days) / len(days)) if days else None


def _confluence_items(data):
    signals = data.get("signals")
    if not isinstance(signals, list):
        raise ValueError("signals 13FLOW absents")
    signals = sorted(signals, key=lambda row: row.get("score") or 0, reverse=True)
    items = []
    for signal in signals[:15]:
        institutional = signal.get("institutional") or {}
        insider = signal.get("insider") or {}
        buyers = insider.get("buyers") if isinstance(insider.get("buyers"), list) else []
        score = signal.get("score")
        items.append(
            {
                "ticker": signal.get("ticker"),
                "score": round(score) if isinstance(score, (int, float)) else score,
                "quadrant": signal.get("quadrant", ""),
                "funds": _first(institutional, "funds_accumulating", "n_funds", "funds", "holders", "count"),
                "trimming": institutional.get("funds_trimming"),
                "net": institutional.get("net_funds"),
                "insiders": len(buyers) if buyers else _first(insider, "n_buyers", "buyers_count", "count"),
                "csuite": sum(1 for buyer in buyers if isinstance(buyer, dict) and buyer.get("is_c_suite")),
                "age": _average_age(buyers),
                "buy_usd": insider.get("buy_value_usd"),
            }
        )
    if not items:
        raise ValueError("aucune confluence 13FLOW")
    return items


def _confluence_freshness(data, retrieved_at):
    metadata = data.get("metadata") if isinstance(data.get("metadata"), dict) else {}
    enrichment = metadata.get("cache_institutional_enrichment")
    enrichment = enrichment if isinstance(enrichment, dict) else {}
    upstream_generated_at = source_date(data)
    edgar_refresh_verified = metadata.get("edgar_refresh_verified") is True
    return {
        "l0gRetrievedAt": retrieved_at,
        "upstreamGeneratedAt": upstream_generated_at,
        "institutionalReportDate": enrichment.get("report_date"),
        "upstreamServedFromCache": metadata.get("served_from_cache"),
        "edgarRefreshVerified": edgar_refresh_verified,
        "validationStatus": metadata.get("validation_status"),
        "scoreInterpretation": metadata.get("score_interpretation"),
    }


def _confluence_age(last_success_at, attempt_at):
    last_success = parse_iso(last_success_at)
    attempt = parse_iso(attempt_at)
    if not last_success or not attempt:
        return None
    return max(0, round((attempt - last_success).total_seconds()))


def build_confluence(previous=None, attempt_at=None, output=None):
    previous = previous if isinstance(previous, dict) else {}
    attempt_at = iso_z(attempt_at) or now_z()
    output = output or CONFLUENCE_OUT
    try:
        data = fetch_json(CONFLUENCE_URL)
        items = _confluence_items(data)
        freshness = _confluence_freshness(data, attempt_at)
        verified = freshness["edgarRefreshVerified"]
        payload = {
            "schema": "https://l0g.fr/schemas/confluence-snapshot.json",
            "version": "2",
            "generated": attempt_at,
            "updated": attempt_at,
            "retrievedAt": attempt_at,
            "lastAttemptAt": attempt_at,
            "lastSuccessAt": attempt_at,
            "sourceStatus": "ok",
            "qualityStatus": "nominal" if verified else "limited",
            "fallbackUsed": False,
            "fallbackReason": None,
            "staleAfter": "PT26H",
            "ageSeconds": 0,
            "timelinessStatus": "fresh",
            "provenanceStatus": "verified" if verified else "partial",
            "source": {
                "name": "13FLOW",
                "url": CONFLUENCE_URL,
            },
            "freshness": freshness,
            "items": items,
            "note": (
                "updated/retrievedAt datent la récupération 13FLOW par l0g, "
                "pas une nouvelle publication SEC EDGAR."
            ),
        }
    except Exception as error:
        last_success_at = iso_z(
            previous.get("lastSuccessAt")
            or previous.get("retrievedAt")
            or previous.get("updated")
        )
        age_seconds = _confluence_age(last_success_at, attempt_at)
        payload = {
            **previous,
            "schema": "https://l0g.fr/schemas/confluence-snapshot.json",
            "version": "2",
            "generated": attempt_at,
            "updated": last_success_at,
            "retrievedAt": last_success_at,
            "lastAttemptAt": attempt_at,
            "lastSuccessAt": last_success_at,
            "sourceStatus": "fallback",
            "qualityStatus": "degraded",
            "fallbackUsed": True,
            "fallbackReason": safe_error(error),
            "staleAfter": "PT26H",
            "ageSeconds": age_seconds,
            "timelinessStatus": (
                "stale"
                if age_seconds is not None and age_seconds > CONFLUENCE_STALE_SECONDS
                else "fresh"
                if age_seconds is not None
                else "unknown"
            ),
            "provenanceStatus": previous.get("provenanceStatus", "partial"),
            "source": previous.get("source")
            or {"name": "13FLOW", "url": CONFLUENCE_URL},
            "freshness": previous.get("freshness") or {
                "l0gRetrievedAt": last_success_at,
                "upstreamGeneratedAt": None,
                "institutionalReportDate": None,
                "upstreamServedFromCache": None,
                "edgarRefreshVerified": False,
            },
            "items": [],
            "lastKnownCount": (
                len(previous.get("items"))
                if isinstance(previous.get("items"), list)
                else 0
            ),
            "note": (
                "Les anciennes lignes sont retirées après échec. updated/retrievedAt "
                "datent le dernier succès l0g, pas une publication SEC EDGAR."
            ),
        }
    write_atomic(output, payload)
    return payload


def main():
    attempt_at = now_z()
    payload = collect_indices(load_previous(), attempt_at=attempt_at)
    write_atomic(OUT, payload)
    # Confluence conserve son propre contrat de repli. Son échec ne modifie pas
    # les cinq indices, mais il est toujours écrit et devient donc observable.
    build_confluence(load_json(CONFLUENCE_OUT), attempt_at=attempt_at)


if __name__ == "__main__":
    main()
