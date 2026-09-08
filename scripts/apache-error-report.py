#!/usr/bin/env python3
"""Read Apache combined logs; emit only redacted 400/5xx observations."""
import argparse
from collections import Counter
from datetime import datetime
import gzip
import hashlib
import json
from pathlib import Path
import re
from urllib.parse import urlsplit

COMBINED = re.compile(r'^\S+ \S+ \S+ \[([^\]]+)\] "((?:\\.|[^"\\])*)" (\d{3}) \S+ "(?:\\.|[^"\\])*" "((?:\\.|[^"\\])*)"$')
REQUEST = re.compile(r'^([A-Z]+) (\S+) (HTTP/\d+(?:\.\d+)?)$')
LOG_NAME = re.compile(r'l0g\.fr-access\.log(?:\.\d+)?(?:\.gz)?$')


def redact(value):
    value = re.sub(r'https?://\S+', '[url-redacted]', value)
    value = re.sub(r'(?i)(?:bearer|basic)\s+\S+', '[credential-redacted]', value)
    value = re.sub(r'(?i)(?:token|api[_-]?key|secret|password|authorization)[\s:=/]+[^\s;/]+', '[credential-redacted]', value)
    value = re.sub(r'[\w.+-]+@[\w.-]+', '[email-redacted]', value)
    value = re.sub(r'\b(?:\d{1,3}\.){3}\d{1,3}\b', '[ip-redacted]', value)
    value = re.sub(r'\b[0-9a-fA-F:]*:[0-9a-fA-F:]*:[0-9a-fA-F:]+\b', '[ip-redacted]', value)
    value = re.sub(r'[A-Za-z0-9_+.%=-]{32,}', '[long-value-redacted]', value)
    return ''.join(c for c in value if ord(c) >= 32 and ord(c) != 127)[:300]


def observation(line, start, end):
    match = COMBINED.fullmatch(line.rstrip('\r\n'))
    if not match:
        return None, 'unparsed'
    raw_date, request, status, ua = match.groups()
    stamp = datetime.strptime(raw_date, '%d/%b/%Y:%H:%M:%S %z')
    if not start <= stamp <= end:
        return None, 'outside_window'
    status = int(status)
    if status != 400 and not 500 <= status <= 599:
        return None, 'other_status'
    parsed = REQUEST.fullmatch(request)
    method, target, protocol = parsed.groups() if parsed else (None, None, None)
    path = None
    if target:
        try:
            path = redact(urlsplit(target).path)
        except ValueError:
            pass
    # These labels describe evidence in the access log, never an inferred cause.
    shape = 'http_request' if parsed else 'missing_request' if request == '-' else 'malformed_request'
    if request.startswith('\\x16\\x03'):
        shape = 'tls_bytes_on_http'
    return {
        'time': stamp.isoformat(), 'status': status, 'method': method,
        'protocol': protocol, 'path_without_query': path,
        'user_agent_redacted': redact(ua), 'request_shape': shape,
        'request_sha256': hashlib.sha256(request.encode()).hexdigest() if not parsed else None,
        'cause': 'requires_error_log_correlation' if status >= 500 else 'not_proven_by_access_log',
    }, 'selected'


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--log-dir', required=True)
    parser.add_argument('--from', dest='start', required=True)
    parser.add_argument('--through', required=True)
    args = parser.parse_args()
    start, end = datetime.fromisoformat(args.start), datetime.fromisoformat(args.through)
    if start.tzinfo is None or end.tzinfo is None or start > end:
        parser.error('Dates ordonnées avec fuseau explicite requis')
    files = sorted(p for p in Path(args.log_dir).iterdir() if LOG_NAME.fullmatch(p.name))
    if not files:
        parser.error('Aucun journal l0g trouvé')
    rows, counts = [], Counter()
    for path in files:
        opener = gzip.open if path.suffix == '.gz' else open
        with opener(path, 'rt', encoding='utf-8', errors='replace') as handle:
            for line in handle:
                row, state = observation(line, start, end)
                counts[state] += 1
                if row:
                    rows.append(row)
    rows.sort(key=lambda row: row['time'])
    print(json.dumps({
        'from': start.isoformat(), 'through': end.isoformat(),
        'files_read': len(files), 'line_counts': counts,
        'status_counts': Counter(str(row['status']) for row in rows),
        'shape_counts': Counter(row['request_shape'] for row in rows),
        'privacy': 'IP, identités Apache, référents, queries et corps bruts exclus. UA expurgé.',
        'coverage': 'Journaux encore présents uniquement ; aucun historique reconstitué.',
        'observations': rows,
    }, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
