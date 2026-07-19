#!/usr/bin/env python3
"""Valide le contrat structurel écrit par l’agrégateur activé."""

from __future__ import annotations

import argparse
import hashlib
import json


EXPECTED_KEYS = ("us", "eu", "yen", "energie", "debt")


def sha256(path: str) -> str:
    with open(path, "rb") as handle:
        return hashlib.sha256(handle.read()).hexdigest()


def last_ndjson(path: str) -> dict:
    last = None
    with open(path, encoding="utf-8") as handle:
        for line in handle:
            if line.strip():
                last = json.loads(line)
    return last or {}


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--risk", required=True)
    parser.add_argument("--history", required=True)
    parser.add_argument("--source", required=True)
    parser.add_argument("--manifest", required=True)
    parser.add_argument("--revision", required=True)
    args = parser.parse_args()

    with open(args.risk, encoding="utf-8") as handle:
        risk = json.load(handle)
    with open(args.manifest, encoding="utf-8") as handle:
        manifest = json.load(handle)
    history = last_ndjson(args.history)
    errors = []
    by_key = {item.get("key"): item for item in risk.get("indices") or []}
    if str(risk.get("version")) != "2":
        errors.append("contrat v2 absent")
    if tuple(by_key) != EXPECTED_KEYS:
        errors.append("les cinq signaux ne sont pas présents dans l’ordre canonique")
    software = risk.get("software") or {}
    if software.get("revision") != args.revision:
        errors.append("révision de l’agrégateur absente ou différente")
    if software.get("sourceSha256") != sha256(args.source):
        errors.append("SHA-256 de l’agrégateur absent ou différent")
    for key in EXPECTED_KEYS:
        item = by_key.get(key) or {}
        expected_revision = (manifest.get("producers") or {}).get(key, {}).get("revision")
        if item.get("producerRevision") != expected_revision or item.get("producerRevisionStatus") != "reported":
            errors.append(f"{key}: révision producteur non publiée")
        for field in ("sourceUpdatedAt", "lastAttemptAt", "lastSuccessAt"):
            if not item.get(field):
                errors.append(f"{key}: {field} absent")
    if "debt" not in history:
        errors.append("la dernière ligne du journal brut ne contient pas debt")

    report = {
        "ok": not errors,
        "errors": errors,
        "generated": risk.get("generated"),
        "status": risk.get("status"),
        "summary": risk.get("summary"),
        "historyLast": history.get("snapshot"),
    }
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0 if report["ok"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
