#!/usr/bin/env python3
"""Archive opérationnelle append-only de l'agrégat dynamique.

Ce journal conserve chaque snapshot produit, sans révision a posteriori. Il est
distinct de la Black Box attestée du build statique : la surface canonique
``/api/v1/signals/history.*`` fusionne les deux en indiquant le niveau de preuve.
"""

from __future__ import annotations

import csv
import datetime
import fcntl
import io
import json
import os
import tempfile


SCHEMA_VERSION = "2"
INDEX_KEYS = ("us", "eu", "yen", "energie", "debt")
COLUMNS = (
    ["date", "snapshot", "generated", "status"]
    + list(INDEX_KEYS)
    + [f"{key}_tone" for key in INDEX_KEYS]
    + [f"{key}_source_status" for key in INDEX_KEYS]
    + [f"{key}_quality_status" for key in INDEX_KEYS]
    + [f"{key}_source_updated_at" for key in INDEX_KEYS]
    + [f"{key}_fallback" for key in INDEX_KEYS]
    + [
        "conf_count",
        "conf_conviction",
        "conf_top_ticker",
        "conf_top_score",
        "conf_top_quadrant",
    ]
)


def _flatten(risk):
    indices = risk.get("indices", {}) or {}
    if isinstance(indices, list):
        indices = {item.get("key"): item for item in indices if item.get("key")}
    confluence = risk.get("confluence", {}) or {}
    top = confluence.get("top", {}) or {}
    snapshot = risk.get("snapshot") or risk.get("generated") or risk.get("updated")
    record = {
        "date": (snapshot or "")[:10],
        "snapshot": snapshot,
        "generated": risk.get("generated"),
        "status": risk.get("status"),
    }
    for key in INDEX_KEYS:
        item = indices.get(key, {}) or {}
        record[key] = item.get("value")
        record[f"{key}_tone"] = item.get("tone")
        record[f"{key}_source_status"] = item.get("sourceStatus")
        record[f"{key}_quality_status"] = item.get("qualityStatus")
        record[f"{key}_source_updated_at"] = item.get("sourceUpdatedAt")
        record[f"{key}_fallback"] = item.get("fallbackUsed")
    record["conf_count"] = confluence.get("count")
    record["conf_conviction"] = confluence.get("conviction")
    record["conf_top_ticker"] = top.get("ticker")
    record["conf_top_score"] = top.get("score")
    record["conf_top_quadrant"] = top.get("quadrant")
    return record


def _last_snapshot(path):
    if not os.path.exists(path):
        return None
    last = None
    with open(path, encoding="utf-8") as handle:
        for line in handle:
            if line.strip():
                last = line
    if not last:
        return None
    try:
        return json.loads(last).get("snapshot")
    except json.JSONDecodeError:
        return None


def _atomic_write(path, data):
    directory = os.path.dirname(path) or "."
    descriptor, temporary = tempfile.mkstemp(dir=directory)
    try:
        with os.fdopen(descriptor, "w", encoding="utf-8") as handle:
            handle.write(data)
            handle.flush()
            os.fsync(handle.fileno())
        os.replace(temporary, path)
        os.chmod(path, 0o644)
    except BaseException:
        if os.path.exists(temporary):
            os.unlink(temporary)
        raise


def _rebuild_csv(ndjson_path, csv_path):
    with open(ndjson_path, encoding="utf-8") as handle:
        rows = [json.loads(line) for line in handle if line.strip()]
    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=COLUMNS, extrasaction="ignore")
    writer.writeheader()
    writer.writerows(rows)
    _atomic_write(csv_path, output.getvalue())
    return len(rows)


def _write_manifest(path, ndjson_path, rows):
    first = last = None
    if os.path.exists(ndjson_path) and rows:
        with open(ndjson_path, encoding="utf-8") as handle:
            records = [json.loads(line) for line in handle if line.strip()]
        first, last = records[0].get("snapshot"), records[-1].get("snapshot")
    manifest = {
        "schema": SCHEMA_VERSION,
        "description": "Archive opérationnelle best-effort des cinq indices. Append-only sur le serveur, distincte de la Black Box attestée.",
        "rows": rows,
        "coverage": {"first": first, "last": last},
        "columns": COLUMNS,
        "formats": {"ndjson": "/api/v1/history.ndjson", "csv": "/api/v1/history.csv"},
        "canonicalHistory": "/api/v1/signals/history.json",
        "license": "CC BY 4.0",
        "attribution": "l0g.fr",
        "generated": datetime.datetime.now(datetime.timezone.utc).isoformat(timespec="seconds").replace("+00:00", "Z"),
    }
    _atomic_write(path, json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")


def append_snapshot(history_dir, risk):
    snapshot = risk.get("snapshot") or risk.get("generated") or risk.get("updated")
    if not snapshot:
        raise ValueError("date de snapshot manquante")
    normalized = {**risk, "snapshot": snapshot}
    os.makedirs(history_dir, exist_ok=True)
    ndjson_path = os.path.join(history_dir, "history.ndjson")
    csv_path = os.path.join(history_dir, "history.csv")
    manifest_path = os.path.join(history_dir, "index.json")
    lock_path = os.path.join(history_dir, ".history.lock")
    with open(lock_path, "w", encoding="utf-8") as lock:
        fcntl.flock(lock, fcntl.LOCK_EX)
        if _last_snapshot(ndjson_path) == snapshot:
            return False
        with open(ndjson_path, "a", encoding="utf-8") as handle:
            handle.write(json.dumps(_flatten(normalized), ensure_ascii=False, separators=(",", ":")) + "\n")
            handle.flush()
            os.fsync(handle.fileno())
        os.chmod(ndjson_path, 0o644)
        rows = _rebuild_csv(ndjson_path, csv_path)
        _write_manifest(manifest_path, ndjson_path, rows)
        return True


def main():
    import argparse

    parser = argparse.ArgumentParser(description="Archive le snapshot de risque courant.")
    parser.add_argument("data_dir", nargs="?", default="/var/www/l0g-data")
    parser.add_argument("--input", default=None)
    args = parser.parse_args()
    source = args.input or os.path.join(args.data_dir, "api-risk.json")
    with open(source, encoding="utf-8") as handle:
        risk = json.load(handle)
    added = append_snapshot(args.data_dir, risk)
    print(f"{'ajoute' if added else 'no-op (dedup)'} -- source={source}")


if __name__ == "__main__":
    main()
