"""S3-compatible object storage adapter (MinIO locally, AWS S3 in production)."""

from functools import lru_cache

import boto3
from botocore.config import Config

from .config import get_settings


class S3ObjectStorage:
    def __init__(self):
        settings = get_settings()
        self.bucket = settings.object_storage_bucket
        self.endpoint_url = settings.object_storage_endpoint_url or None
        self.client = boto3.client(
            "s3",
            endpoint_url=self.endpoint_url,
            region_name=settings.object_storage_region,
            aws_access_key_id=settings.object_storage_access_key_id or None,
            aws_secret_access_key=settings.object_storage_secret_access_key or None,
            config=Config(s3={"addressing_style": "path" if settings.object_storage_force_path_style else "auto"}),
        )

    def ensure_bucket(self) -> None:
        try:
            self.client.head_bucket(Bucket=self.bucket)
        except Exception:
            # S3 and MinIO both return an error for a missing bucket. CreateBucket
            # is idempotent for the local single-region MinIO deployment.
            if self.endpoint_url is None:
                raise
            self.client.create_bucket(Bucket=self.bucket)

    def put_text(self, key: str, text: str, checksum: str) -> None:
        self.ensure_bucket()
        self.client.put_object(
            Bucket=self.bucket,
            Key=key,
            Body=text.encode("utf-8"),
            ContentType="text/plain; charset=utf-8",
            Metadata={"sha256": checksum},
        )

    def get_text(self, key: str) -> str:
        response = self.client.get_object(Bucket=self.bucket, Key=key)
        return response["Body"].read().decode("utf-8")

    def delete(self, key: str) -> None:
        self.client.delete_object(Bucket=self.bucket, Key=key)


@lru_cache
def get_object_storage() -> S3ObjectStorage:
    return S3ObjectStorage()
