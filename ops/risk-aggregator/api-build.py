#!/usr/bin/env python3
"""Construit les surfaces publiques dynamiques depuis ``risk.json``.

Le code conserve sans transformation les champs de fraîcheur, de qualité et de
repli produits par l'agrégateur. Il n'invente aucun indice global.
"""

from __future__ import annotations

import datetime
import json
import os
import tempfile
import xml.sax.saxutils as sx


DATA = os.environ.get("L0G_RISK_DATA_DIR", "/var/www/l0g-data")
SITE = "https://l0g.fr"
META = {
    "us": {"label": "US Macro Dashboard", "source": "https://us.l0g.fr"},
    "eu": {"label": "EU Macro Dashboard", "source": "https://euro.l0g.fr"},
    "yen": {"label": "Yen Carry Monitor", "source": "https://yct.l0g.fr"},
    "energie": {"label": "Energie Monitor", "source": "https://energie.l0g.fr"},
    "debt": {"label": "Debt Risk Radar", "source": "https://debt.l0g.fr"},
}


def now_z():
    return datetime.datetime.now(datetime.timezone.utc).isoformat(timespec="seconds").replace("+00:00", "Z")


def load(path, default=None):
    try:
        with open(path, encoding="utf-8") as handle:
            return json.load(handle)
    except Exception:
        return default


def write_atomic(path, text):
    descriptor, temporary = tempfile.mkstemp(dir=os.path.dirname(path))
    try:
        with os.fdopen(descriptor, "w", encoding="utf-8") as handle:
            handle.write(text)
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


def build_api_json(risk, confluence):
    indices = {}
    for item in risk.get("indices", []):
        key = item.get("key")
        if key not in META:
            continue
        indices[key] = {**item, "label": META[key]["label"], "source": META[key]["source"]}

    confluence_public = None
    items = (confluence or {}).get("items") if confluence else None
    if isinstance(items, list):
        top = max(items, key=lambda row: row.get("score", -1)) if items else None
        confluence_public = {
            "updated": confluence.get("updated"),
            "count": len(items),
            "conviction": sum(1 for row in items if str(row.get("quadrant", "")).lower() == "conviction"),
            "top": {"ticker": top.get("ticker"), "score": top.get("score"), "quadrant": top.get("quadrant")} if top else None,
            "source": "https://l0g.fr/confluence/",
        }

    return {
        "schema": "https://l0g.fr/api/",
        "version": "2",
        "generated": now_z(),
        "snapshot": risk.get("generated") or risk.get("updated"),
        "status": risk.get("status", "unknown"),
        "summary": risk.get("summary"),
        "indices": indices,
        "confluence": confluence_public,
        "feed": "https://l0g.fr/api/v1/risk.xml",
        "license": "CC BY 4.0",
        "attribution": "l0g.fr",
        "note": "Best-effort explicite : lire sourceStatus, qualityStatus, fallbackUsed, sourceUpdatedAt, lastAttemptAt et lastSuccessAt pour chaque signal.",
    }


def update_events(risk):
    store = load(os.path.join(DATA, "risk-events.json"), {"last_levels": {}, "events": []})
    last = store.get("last_levels", {})
    events = store.get("events", [])
    timestamp = now_z()
    changed = False
    for item in risk.get("indices", []):
        key, level = item.get("key"), item.get("level")
        previous = last.get(key)
        if previous is not None and previous != level:
            meta = META.get(key, {})
            events.append({
                "ts": timestamp,
                "key": key,
                "label": meta.get("label", key),
                "from": previous,
                "to": level,
                "value": item.get("value"),
                "tone": item.get("tone"),
                "source": meta.get("source", SITE + "/"),
            })
            changed = True
        last[key] = level
    store["last_levels"] = last
    store["events"] = events[-200:]
    if changed or "updated" not in store:
        store["updated"] = timestamp
    return store


def render_atom(store):
    updated = store.get("updated", now_z())
    events = sorted(store.get("events", []), key=lambda row: str(row.get("ts", "")), reverse=True)[:50]
    entries = []
    for event in events:
        event_id = "tag:l0g.fr,2026:risk/%s/%s" % (event.get("key"), event.get("ts"))
        title = "%s : %s → %s (%s)" % (event.get("label", event.get("key")), event.get("from"), event.get("to"), event.get("value"))
        link = event.get("source") or (SITE + "/")
        summary = "Indice %s passe de %s à %s (valeur %s/100)." % (event.get("label", event.get("key")), event.get("from"), event.get("to"), event.get("value"))
        entries.append(
            "  <entry>\n    <title>%s</title>\n    <id>%s</id>\n    <updated>%s</updated>\n    <link href=\"%s\"/>\n    <category term=\"%s\"/>\n    <summary>%s</summary>\n  </entry>" % (
                sx.escape(title), sx.escape(event_id), sx.escape(str(event.get("ts"))), sx.escape(link), sx.escape(str(event.get("tone"))), sx.escape(summary)
            )
        )
    return (
        '<?xml version="1.0" encoding="utf-8"?>\n'
        '<feed xmlns="http://www.w3.org/2005/Atom">\n'
        "  <title>l0g — changements de niveau de risque</title>\n"
        "  <subtitle>Franchissements de seuil des cinq signaux l0g.</subtitle>\n"
        '  <link href="%s/api/v1/risk.xml" rel="self"/>\n'
        '  <link href="%s/api/"/>\n'
        "  <id>%s/api/v1/risk.xml</id>\n"
        "  <updated>%s</updated>\n"
        "  <author><name>l0g.fr</name></author>\n"
        "  <rights>CC BY 4.0 — l0g.fr</rights>\n%s\n</feed>\n" % (SITE, SITE, SITE, sx.escape(updated), "\n".join(entries))
    )


def main():
    risk = load(os.path.join(DATA, "risk.json"))
    if not risk:
        raise SystemExit("risk.json introuvable ou illisible")
    confluence = load(os.path.join(DATA, "confluence.json"))
    write_atomic(os.path.join(DATA, "api-risk.json"), json.dumps(build_api_json(risk, confluence), ensure_ascii=False, indent=2) + "\n")
    store = update_events(risk)
    write_atomic(os.path.join(DATA, "risk-events.json"), json.dumps(store, ensure_ascii=False, indent=2) + "\n")
    write_atomic(os.path.join(DATA, "risk-events.xml"), render_atom(store))


if __name__ == "__main__":
    main()
