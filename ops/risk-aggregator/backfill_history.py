#!/usr/bin/env python3
"""Import ponctuel d'anciens snapshots sans écraser les lignes déjà publiées."""

from __future__ import annotations

import argparse
import fcntl
import glob
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import risk_history as history  # noqa: E402


def normalize(payload):
    snapshot = payload.get("snapshot") or payload.get("generated") or payload.get("updated")
    if not snapshot:
        return None
    return {**payload, "snapshot": snapshot}


def load_existing(path):
    if not os.path.exists(path):
        return {}
    with open(path, encoding="utf-8") as handle:
        rows = [json.loads(line) for line in handle if line.strip()]
    return {row["snapshot"]: row for row in rows if row.get("snapshot")}


def main():
    parser = argparse.ArgumentParser(description="Backfill non destructif de l'archive opérationnelle.")
    parser.add_argument("data_dir")
    parser.add_argument("sources", nargs="+")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()
    ndjson_path = os.path.join(args.data_dir, "history.ndjson")
    lock_path = os.path.join(args.data_dir, ".history.lock")
    files = []
    for pattern in args.sources:
        files.extend(sorted(glob.glob(pattern)) or [pattern])
    os.makedirs(args.data_dir, exist_ok=True)
    with open(lock_path, "w", encoding="utf-8") as lock:
        fcntl.flock(lock, fcntl.LOCK_EX)
        merged = load_existing(ndjson_path)
        existing = len(merged)
        added = bad = 0
        for path in files:
            try:
                with open(path, encoding="utf-8") as handle:
                    payload = normalize(json.load(handle))
            except (OSError, json.JSONDecodeError) as error:
                print(f"illisible: {path} ({error})", file=sys.stderr)
                bad += 1
                continue
            if not payload:
                bad += 1
                continue
            snapshot = payload["snapshot"]
            if snapshot not in merged:
                merged[snapshot] = history._flatten(payload)
                added += 1
        records = [merged[key] for key in sorted(merged)]
        print(f"existant={existing} ajoute={added} illisible={bad} total={len(records)}")
        if args.dry_run:
            return 0
        body = "".join(json.dumps(row, ensure_ascii=False, separators=(",", ":")) + "\n" for row in records)
        history._atomic_write(ndjson_path, body)
        rows = history._rebuild_csv(ndjson_path, os.path.join(args.data_dir, "history.csv"))
        history._write_manifest(os.path.join(args.data_dir, "index.json"), ndjson_path, rows)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
