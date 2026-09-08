import importlib.util
from datetime import datetime
from pathlib import Path
import unittest

spec = importlib.util.spec_from_file_location('apache_errors', Path(__file__).with_name('apache-error-report.py'))
audit = importlib.util.module_from_spec(spec)
spec.loader.exec_module(audit)


class ApacheErrorReportTests(unittest.TestCase):
    start = datetime.fromisoformat('2026-08-25T00:00:00+02:00')
    end = datetime.fromisoformat('2026-09-08T12:47:52+02:00')

    def parse(self, request='GET /api/mcp?token=private HTTP/1.1', status=502, date='08/Sep/2026:12:47:52 +0200', ua='Mozilla/5.0'):
        line = f'192.0.2.1 private account [{date}] "{request}" {status} 12 "https://private/" "{ua}"'
        return audit.observation(line, self.start, self.end)

    def test_redaction_and_no_invented_cause(self):
        row, state = self.parse(ua='Mozilla/5.0 private@example.test Bearer confidential')
        self.assertEqual(state, 'selected')
        self.assertEqual(row['path_without_query'], '/api/mcp')
        self.assertEqual(row['cause'], 'requires_error_log_correlation')
        for secret in ['192.0.2.1', 'private', 'account', 'confidential']:
            self.assertNotIn(secret, str(row))
        self.assertNotIn('shortsecret', audit.redact('/token/shortsecret'))
        self.assertNotIn('shortsecret', audit.redact('Client api_key=shortsecret'))

    def test_window_status_and_missing_request(self):
        self.assertEqual(self.parse(date='08/Sep/2026:12:47:53 +0200')[1], 'outside_window')
        self.assertEqual(self.parse(status=404)[1], 'other_status')
        row, state = self.parse(request='-', status=400)
        self.assertEqual(state, 'selected')
        self.assertEqual(row['request_shape'], 'missing_request')
        self.assertIsNone(row['method'])
        row, _ = self.parse(request=r'\x16\x03\x01', status=400)
        self.assertEqual(row['request_shape'], 'tls_bytes_on_http')
        self.assertNotIn(r'\x16', str(row))


if __name__ == '__main__':
    unittest.main()
