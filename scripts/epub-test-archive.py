"""Read validated EPUB members for the Node test suite, without extracting files."""

import re
import sys
from copy import copy
from json import dumps
from stat import S_IFDIR, S_IFMT, S_IFREG
from struct import pack
from zipfile import ZipFile

MEMBER_NAME = re.compile(r"(?:[A-Za-z0-9_.-]+/)*[A-Za-z0-9_.-]+/?")
METADATA_LIMIT = 1024 * 1024


def write_members(path, max_bytes):
    with ZipFile(path) as archive:
        members = archive.infolist()
        names = set()
        total = 0
        for member in members:
            name = member.filename
            if (
                name != member.orig_filename
                or not MEMBER_NAME.fullmatch(name)
                or any(part in {".", ".."} for part in name.split("/"))
                or name in names
            ):
                raise ValueError(f"Unsafe or duplicate EPUB member: {name!r}")
            mode = S_IFMT(member.external_attr >> 16) if member.create_system == 3 else 0
            if mode not in {0, S_IFDIR if member.is_dir() else S_IFREG}:
                raise ValueError(f"Unexpected EPUB member type: {name!r}")
            if member.is_dir() and member.file_size:
                raise ValueError(f"EPUB directory contains data: {name!r}")
            names.add(name)
            total += member.file_size
            if total > max_bytes:
                raise ValueError("Inflated EPUB exceeds the byte budget")

        metadata = dumps([(member.filename, member.file_size) for member in members]).encode()
        if len(metadata) > METADATA_LIMIT:
            raise ValueError("EPUB member metadata exceeds the byte budget")
        stream = sys.stdout.buffer
        stream.write(pack(">I", len(metadata)))
        stream.write(metadata)
        for member in members:
            # ZipFile normally stops at the declared size. Read one extra byte
            # so an incorrect size cannot hide trailing decoded member data.
            probe = copy(member)
            probe.file_size += 1
            with archive.open(probe) as entry:
                payload = entry.read(probe.file_size)
            if len(payload) != member.file_size:
                raise ValueError(f"Unexpected decoded size for {member.filename!r}")
            stream.write(payload)


if __name__ == "__main__":
    write_members(sys.argv[1], int(sys.argv[2]))
