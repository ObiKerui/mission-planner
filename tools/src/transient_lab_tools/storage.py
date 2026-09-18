from __future__ import annotations

import fsspec


def create_s3_filesystem(
    *,
    endpoint_url: str,
    access_key: str,
    secret_key: str,
):
    return fsspec.filesystem(
        "s3",
        endpoint_url=endpoint_url,
        key=access_key,
        secret=secret_key,
    )


def write_file(
    fs,
    uri: str,
    data: bytes,
) -> None:
    """Write bytes to an object-storage URI."""

    path = uri.removeprefix("s3://")

    with fs.open(path, "wb") as file:
        file.write(data)
        
def read_file(
    fs,
    uri: str,
) -> bytes:
    """Read an object from object storage."""

    path = uri.removeprefix("s3://")

    with fs.open(path, "rb") as file:
        return file.read()