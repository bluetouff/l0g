#!/usr/bin/env python3
"""Vérifie que chaque producteur activé correspond au manifeste Git publié."""

from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import sys


EXPECTED_KEYS = ("us", "eu", "yen", "energie", "debt")
REVISION_RE = re.compile(r"^[a-f0-9]{40}$")
SHA256_RE = re.compile(r"^[a-f0-9]{64}$")


def file_sha256(path: str) -> str:
    digest = hashlib.sha256()
    with open(path, "rb") as handle:
        for block in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def verify(manifest: dict) -> dict:
    errors = []
    results = []
    producers = manifest.get("producers") or {}
    if manifest.get("schemaVersion") != 1:
        errors.append("schemaVersion doit valoir 1")
    if tuple(producers) != EXPECTED_KEYS:
        errors.append("le manifeste doit contenir us, eu, yen, energie et debt dans cet ordre")

    for key in EXPECTED_KEYS:
        producer = producers.get(key) or {}
        revision = producer.get("revision") or ""
        if not REVISION_RE.fullmatch(revision):
            errors.append(f"{key}: révision Git invalide")
        files = producer.get("files") or []
        if not files:
            errors.append(f"{key}: aucun fichier exécutable déclaré")
        for entry in files:
            path = entry.get("path") or ""
            expected = entry.get("sha256") or ""
            if not os.path.isabs(path):
                errors.append(f"{key}: chemin non absolu ({path or 'absent'})")
                continue
            if not SHA256_RE.fullmatch(expected):
                errors.append(f"{key}: SHA-256 attendu invalide pour {path}")
                continue
            try:
                actual = file_sha256(path)
            except OSError as error:
                errors.append(f"{key}: lecture impossible de {path}: {error.strerror or error}")
                continue
            matches = actual == expected
            results.append({"producer": key, "path": path, "expected": expected, "actual": actual, "matches": matches})
            if not matches:
                errors.append(f"{key}: {path} ne correspond pas à la révision déclarée")

    return {"ok": not errors, "errors": errors, "files": results}


def revision_environment(manifest: dict, aggregate_revision: str) -> str:
    if not REVISION_RE.fullmatch(aggregate_revision):
        raise ValueError("la révision de l’agrégateur doit être un SHA Git complet")
    lines = [f"L0G_RISK_REVISION={aggregate_revision}"]
    for key in EXPECTED_KEYS:
        revision = (manifest.get("producers") or {}).get(key, {}).get("revision") or ""
        if not REVISION_RE.fullmatch(revision):
            raise ValueError(f"révision invalide pour {key}")
        lines.append(f"L0G_{key.upper()}_REVISION={revision}")
    return "\n".join(lines) + "\n"


def verify_published_revisions(manifest: dict, risk: dict) -> list[str]:
    """Compare the active publication with the manifest before changing it."""
    if not isinstance(risk, dict) or not isinstance(risk.get("indices"), list):
        return ["publication: liste indices absente ou invalide"]
    errors = []
    for key in EXPECTED_KEYS:
        expected = (manifest.get("producers") or {}).get(key, {}).get("revision")
        rows = [row for row in risk["indices"] if isinstance(row, dict) and row.get("key") == key]
        if len(rows) != 1:
            errors.append(f"{key}: publication absente ou dupliquée ; révision attendue={expected}")
            continue
        row = rows[0]
        observed = row.get("producerRevision")
        if observed != expected:
            errors.append(f"{key}: révision publiée différente ; observée={observed}, attendue={expected}")
        if row.get("producerRevisionStatus") != "reported":
            errors.append(f"{key}: révision non déclarée comme reported ; observée={observed}, attendue={expected}")
        if key == "eu" and row.get("sourceRevision") != expected:
            errors.append(f"eu: révision du snapshot différente ; observée={row.get('sourceRevision')}, attendue={expected}")
    return errors


def systemd_environment(manifest: dict, aggregate_revision: str) -> str:
    return "[Service]\n" + "".join(
        f"Environment={line}\n" for line in revision_environment(manifest, aggregate_revision).splitlines()
    )


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("manifest")
    parser.add_argument("--published-risk", help="JSON de risque actif à vérifier avant toute mutation")
    output = parser.add_mutually_exclusive_group()
    output.add_argument("--systemd", action="store_true")
    output.add_argument("--env-file", action="store_true")
    parser.add_argument("--aggregate-revision")
    args = parser.parse_args()
    with open(args.manifest, encoding="utf-8") as handle:
        manifest = json.load(handle)

    report = verify(manifest)
    if args.published_risk:
        try:
            with open(args.published_risk, encoding="utf-8") as handle:
                risk = json.load(handle)
        except (OSError, ValueError) as error:
            report["errors"].append(f"publication: lecture du JSON impossible ({error})")
        else:
            report["errors"].extend(verify_published_revisions(manifest, risk))
        report["ok"] = not report["errors"]
    if not report["ok"]:
        print(json.dumps(report, ensure_ascii=False, indent=2), file=sys.stderr)
        return 1
    if args.systemd or args.env_file:
        if not args.aggregate_revision:
            parser.error("--aggregate-revision est requis avec --systemd ou --env-file")
        render = systemd_environment if args.systemd else revision_environment
        print(render(manifest, args.aggregate_revision), end="")
    else:
        print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
