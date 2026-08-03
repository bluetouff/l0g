#!/usr/bin/env python3

from __future__ import annotations

import importlib.util
import json
import pathlib
import tempfile
import unittest
from types import SimpleNamespace
from unittest.mock import patch


ROOT = pathlib.Path(__file__).parent
SPEC = importlib.util.spec_from_file_location("l0g_risk", ROOT / "l0g-risk.py")
RISK = importlib.util.module_from_spec(SPEC)
assert SPEC.loader
SPEC.loader.exec_module(RISK)


def item(key, value, source_updated="2026-07-18T08:00:00Z"):
    return RISK.quality_fields(
        {"key": key, "value": value, "scale": 100, "level": "Modéré", "tone": "moderate"},
        key,
        "2026-07-18T09:00:00Z",
        source_updated,
        f"https://{key}.example/snapshot.json",
    )


class AggregatorContractTest(unittest.TestCase):
    def test_us_normalization_keeps_methodology_anchors(self):
        self.assertEqual(RISK._us_zscore_to_100(0.0), 30)
        self.assertEqual(RISK._us_zscore_to_100(0.04), 31)
        self.assertEqual(RISK._us_zscore_to_100(1.5), 55)
        self.assertEqual(RISK._us_zscore_to_100(2.5), 75)

    def test_us_index_exposes_native_zscore_before_normalization(self):
        result = SimpleNamespace(returncode=0, stdout="0.04\n", stderr="")
        with (
            patch.object(RISK.subprocess, "run", return_value=result),
            patch.object(RISK.os.path, "getmtime", return_value=1_785_728_197),
        ):
            current = RISK.idx_us(
                {"key": "us", "url": "file:///snapshot.parquet"},
                "2026-08-03T08:00:00Z",
            )
        self.assertEqual(current["rawValue"], 0.04)
        self.assertEqual(current["value"], 31)
        self.assertEqual(current["sourceStatus"], "ok")

    def test_yen_freshness_uses_verified_check_without_republishing_unchanged_data(self):
        data = {
            "generated": "2026-08-02T16:15:24Z",
            "cot": [{"d": "2026-07-28", "net": -100, "oi": 200}],
            "rates": {"fed": 3.625, "boj": 1.0},
            "fx": [
                {"d": "2026-06-30", "v": 162.4},
                {"d": "2026-07-31", "v": 160.2},
            ],
        }
        status = {
            "checked_at": "2026-08-03T08:03:22Z",
            "status": "ok",
            "sources": {
                "cot": {"status": "fresh"},
                "tff": {"status": "fresh"},
                "fed": {"status": "fresh"},
                "fx": {"status": "fresh"},
                "boj": {"status": "verified-config"},
            },
        }
        source = {
            "url": "https://yct.example/data.json",
            "status_url": "https://yct.example/status.json",
        }
        with patch.object(RISK, "fetch_json", side_effect=[data, status]):
            current = RISK.idx_yct(source, "2026-08-03T08:30:00Z")

        self.assertEqual(current["sourceUpdatedAt"], "2026-08-02T16:15:24Z")
        self.assertEqual(current["sourceCheckedAt"], "2026-08-03T08:03:22Z")
        self.assertEqual(current["ageSeconds"], 1598)
        self.assertEqual(current["timelinessStatus"], "fresh")

    def test_naive_timestamp_is_rejected(self):
        self.assertIsNone(RISK.iso_z("2026-07-21 07:53"))

    def test_explicit_offset_is_normalized_to_utc(self):
        self.assertEqual(RISK.iso_z("2026-07-21T07:53:00+02:00"), "2026-07-21T05:53:00Z")

    def test_failure_keeps_value_but_exposes_fallback(self):
        previous = {"us": item("us", 42)}

        def broken(_source, _attempt):
            raise RuntimeError("HTTP 503 token=secret")

        payload = RISK.collect_indices(
            previous,
            sources=[{"key": "us", "type": "broken", "url": "https://us.example"}],
            builders={"broken": broken},
            attempt_at="2026-07-18T10:00:00Z",
        )
        current = payload["indices"][0]
        self.assertEqual(current["value"], 42)
        self.assertEqual(current["sourceStatus"], "fallback")
        self.assertTrue(current["fallbackUsed"])
        self.assertEqual(current["lastSuccessAt"], "2026-07-18T09:00:00Z")
        self.assertEqual(current["lastAttemptAt"], "2026-07-18T10:00:00Z")
        self.assertNotIn("secret", current["fallbackReason"])
        self.assertEqual(payload["status"], "degraded")

    def test_missing_source_is_counted_without_fabricated_value(self):
        def broken(_source, _attempt):
            raise RuntimeError("timeout")

        payload = RISK.collect_indices(
            {},
            sources=[{"key": "debt", "type": "broken", "url": "https://debt.example"}],
            builders={"broken": broken},
            attempt_at="2026-07-18T10:00:00Z",
        )
        self.assertEqual(payload["indices"], [])
        self.assertEqual(payload["status"], "failed")
        self.assertEqual(payload["summary"]["missing"][0]["key"], "debt")

    def test_history_archives_five_signals_and_provenance(self):
        history_spec = importlib.util.spec_from_file_location("risk_history", ROOT / "risk_history.py")
        history = importlib.util.module_from_spec(history_spec)
        assert history_spec.loader
        history_spec.loader.exec_module(history)
        payload = {
            "generated": "2026-07-18T10:00:00Z",
            "status": "degraded",
            "indices": [item("us", 42), item("eu", 41), item("yen", 39), item("energie", 43), item("debt", 54)],
        }
        for current in payload["indices"]:
            current["producerRevision"] = f"{current['key']}-revision"
            current["producerRevisionStatus"] = "reported"
        with tempfile.TemporaryDirectory() as directory:
            self.assertTrue(history.append_snapshot(directory, payload))
            self.assertFalse(history.append_snapshot(directory, payload))
            row = json.loads((pathlib.Path(directory) / "history.ndjson").read_text().strip())
            self.assertEqual(row["debt"], 54)
            self.assertEqual(row["energie_source_status"], "ok")
            self.assertIn("debt_source_updated_at", row)
            self.assertEqual(row["us_producer_repository"], "https://github.com/bluetouff/macro_dashboard")
            self.assertEqual(row["us_producer_revision"], "us-revision")
            self.assertEqual(row["us_producer_revision_status"], "reported")
            manifest = json.loads((pathlib.Path(directory) / "index.json").read_text())
            self.assertEqual(manifest["schema"], "3")
            self.assertIn("us_producer_revision", manifest["columns"])

    def test_energy_eia_daily_fallback_is_visible(self):
        original_fetch = RISK.fetch_json
        RISK.fetch_json = lambda _url: {
            "generated": "2026-07-18T10:00:00Z",
            "composite": {"score": 42.1, "regime": "normal"},
            "series": {
                "brent": {"date": "2026-07-13", "tip_source": "eia"},
                "wti": {"date": "2026-07-13", "tip_source": "eia"},
            },
            "notes": ["OilPriceAPI HTTP 402", "Yahoo HTTP 429"],
        }
        try:
            current = RISK.idx_energie(
                {"key": "energie", "url": "https://energie.example/snapshot.json"},
                "2026-07-18T10:05:00Z",
            )
        finally:
            RISK.fetch_json = original_fetch
        self.assertEqual(current["qualityStatus"], "official-delayed")
        self.assertTrue(current["fallbackUsed"])
        self.assertEqual(current["fallbackLayer"], "producer")
        self.assertEqual(current["componentDates"]["brent"], "2026-07-13")
        self.assertIn("OilPriceAPI HTTP 402", current["warnings"])


if __name__ == "__main__":
    unittest.main()
