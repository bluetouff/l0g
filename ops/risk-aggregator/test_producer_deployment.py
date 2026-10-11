#!/usr/bin/env python3
"""Revision output must be safe, exact, and gated by installed file hashes."""
import hashlib
import importlib.util
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest


SCRIPT = Path(__file__).with_name("verify-producer-deployment.py")
SPEC = importlib.util.spec_from_file_location("producer_deployment", SCRIPT)
DEPLOYMENT = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(DEPLOYMENT)


class ProducerRevisionTest(unittest.TestCase):
    def manifest(self, directory):
        path = Path(directory, "producer.py")
        path.write_text("# verified fixture\n")
        digest = hashlib.sha256(path.read_bytes()).hexdigest()
        return {
            "schemaVersion": 1,
            "producers": {key: {"revision": str(i + 1) * 40,
                                 "files": [{"path": str(path), "sha256": digest}]}
                          for i, key in enumerate(DEPLOYMENT.EXPECTED_KEYS)},
        }

    def test_environment_file_contains_only_the_six_public_revisions(self):
        with tempfile.TemporaryDirectory() as directory:
            manifest = self.manifest(directory)
            env = DEPLOYMENT.revision_environment(manifest, "a" * 40)
            lines = env.splitlines()
            self.assertEqual(len(lines), 6)
            self.assertEqual(lines[0], "L0G_RISK_REVISION=" + "a" * 40)
            for key, line in zip(DEPLOYMENT.EXPECTED_KEYS, lines[1:]):
                self.assertEqual(line, f"L0G_{key.upper()}_REVISION=" + manifest["producers"][key]["revision"])
            self.assertEqual(
                DEPLOYMENT.systemd_environment(manifest, "a" * 40),
                "[Service]\n" + "".join("Environment=" + line + "\n" for line in lines),
            )

    def test_invalid_or_injected_revisions_are_rejected(self):
        with tempfile.TemporaryDirectory() as directory:
            for value in ("", "unknown", "a" * 40 + "\nOTHER=1", "A" * 40):
                manifest = self.manifest(directory)
                with self.subTest(value=value), self.assertRaises(ValueError):
                    DEPLOYMENT.revision_environment(manifest, value)
                manifest["producers"]["eu"]["revision"] = value
                with self.assertRaises(ValueError):
                    DEPLOYMENT.revision_environment(manifest, "a" * 40)

    def test_cli_cannot_announce_revisions_for_modified_files(self):
        with tempfile.TemporaryDirectory() as directory:
            manifest = self.manifest(directory)
            target = Path(directory, "manifest.json")
            target.write_text(json.dumps(manifest))
            args = [sys.executable, str(SCRIPT), str(target), "--env-file", "--aggregate-revision", "a" * 40]
            good = subprocess.run(args, capture_output=True, text=True, timeout=10)
            self.assertEqual(good.returncode, 0, good.stderr)
            self.assertIn("L0G_RISK_REVISION=" + "a" * 40, good.stdout)
            Path(directory, "producer.py").write_text("# modified fixture\n")
            bad = subprocess.run(args, capture_output=True, text=True, timeout=10)
            self.assertEqual(bad.returncode, 1)
            self.assertEqual(bad.stdout, "")
            self.assertFalse(json.loads(bad.stderr)["ok"])

    def test_euro_rollback_stops_timer_and_reaggregates_after_restoring_web(self):
        source = SCRIPT.with_name("activate-euromacro-zen.sh").read_text()
        rollback = "rollback() {" + source.split("rollback() {", 1)[1].split("\ntrap rollback ERR", 1)[0]
        harness = r'''
systemctl() { printf 'systemctl %s\n' "$*"; }
cp() { printf 'cp %s\n' "$*"; }
rm() { printf 'rm %s\n' "$*"; }
BACKUP=$1
ROLLED_BACK=0
HAD_DEPLOYED_SHA=1
HAD_ATTESTED_SHA=1
TIMER_WAS_ACTIVE=1
RUNTIME_FILES=(index.html)
''' + rollback + "\nfalse\nrollback\n"
        with tempfile.TemporaryDirectory() as directory:
            result = subprocess.run(["bash", "-c", harness, "rollback-test", directory],
                                    capture_output=True, text=True, timeout=10)
        self.assertEqual(result.returncode, 1, "rollback must retain the triggering failure")
        commands = result.stdout.splitlines()
        self.assertLess(commands.index("systemctl stop euromacro-snapshot.timer"),
                        commands.index("systemctl stop euromacro-snapshot.service"))
        restored_web = next(i for i, cmd in enumerate(commands) if "/web/index.html" in cmd)
        aggregate = commands.index("systemctl restart l0g-risk.service")
        self.assertLess(restored_web, aggregate)
        with tempfile.TemporaryDirectory() as directory:
            inactive = subprocess.run(
                ["bash", "-c", harness.replace("TIMER_WAS_ACTIVE=1", "TIMER_WAS_ACTIVE=0"),
                 "rollback-test", directory], capture_output=True, text=True, timeout=10,
            )
        self.assertEqual(inactive.returncode, 1)
        self.assertNotIn("systemctl stop euromacro-snapshot.timer", inactive.stdout)
        self.assertNotIn("systemctl start euromacro-snapshot.timer", inactive.stdout)


if __name__ == "__main__":
    unittest.main()
