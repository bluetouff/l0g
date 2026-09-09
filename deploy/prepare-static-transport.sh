#!/usr/bin/env bash
# Split transport only: the signature and checksum still cover the whole archive.
set -euo pipefail
umask 0077

[ "$#" -eq 2 ] || { echo 'Usage: prepare-static-transport.sh RELEASE_DIR NEW_OUTPUT_DIR' >&2; exit 1; }
RELEASE_DIR="$1"
OUTPUT_DIR="$2"
ARCHIVE_NAME=l0g-site.tar.gz
PART_BYTES=94371840 # 90 MiB, below GitHub's per-file limit.
MAX_PARTS=16

for name in "$ARCHIVE_NAME" "${ARCHIVE_NAME}.sha256" "${ARCHIVE_NAME}.sigstore.jsonl" source.env; do
  [ -f "${RELEASE_DIR}/${name}" ] && [ ! -L "${RELEASE_DIR}/${name}" ] || {
    echo "Release file missing or not regular: $name" >&2; exit 1;
  }
done
archive_bytes="$(wc -c <"${RELEASE_DIR}/${ARCHIVE_NAME}")"
if [ "$archive_bytes" -le 0 ] || [ "$archive_bytes" -gt "$((PART_BYTES * MAX_PARTS))" ]; then
  echo 'Static archive outside the bounded transport size' >&2; exit 1
fi
# Never overwrite an existing output directory, including a symlink.
mkdir -- "$OUTPUT_DIR"
split -b "$PART_BYTES" -d -a 3 "${RELEASE_DIR}/${ARCHIVE_NAME}" "${OUTPUT_DIR}/${ARCHIVE_NAME}.part-"
for name in "${ARCHIVE_NAME}.sha256" "${ARCHIVE_NAME}.sigstore.jsonl" source.env; do
  cp "${RELEASE_DIR}/${name}" "${OUTPUT_DIR}/${name}"
done
(
  cd "$OUTPUT_DIR"
  export LC_ALL=C
  sha256sum "${ARCHIVE_NAME}".part-* >"${ARCHIVE_NAME}.parts.sha256"
)
printf 'Static transport prepared: %s bytes, %s part(s)\n' "$archive_bytes" "$(((archive_bytes + PART_BYTES - 1) / PART_BYTES))"
