#!/usr/bin/python3
"""Inventory Python distributions without executing virtualenv code."""

from __future__ import annotations

import re
import sys
from importlib.metadata import distributions
from pathlib import Path
from typing import NoReturn


def fail(message: str) -> NoReturn:
    print(message, file=sys.stderr)
    raise SystemExit(1)


def main() -> int:
    if len(sys.argv) != 2:
        fail("usage: zen-venv-inventory VENV")

    venv = Path(sys.argv[1])
    if not venv.is_absolute():
        fail("le chemin du virtualenv doit être absolu")
    if not (venv / "pyvenv.cfg").is_file():
        fail(f"virtualenv invalide: {venv}")

    package_paths = sorted(
        path
        for path in venv.glob("lib/python*/site-packages")
        if path.is_dir()
    )
    packages: dict[str, tuple[str, str]] = {}
    for distribution in distributions(path=[str(path) for path in package_paths]):
        name = distribution.metadata.get("Name")
        version = distribution.version
        if not name or not version:
            continue
        normalized = re.sub(r"[-_.]+", "-", name).lower()
        packages[normalized] = (name, version)

    for normalized in sorted(packages):
        name, version = packages[normalized]
        print(f"{name}=={version}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
