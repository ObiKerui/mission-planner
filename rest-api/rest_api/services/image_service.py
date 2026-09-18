from sqlalchemy import select

from database.models.generated import Images, Observations
from transient_lab_tools.fits import read_fits
from transient_lab_tools.preview import create_preview_bytes
from transient_lab_tools.storage import create_s3_filesystem, read_file

from rest_api.dependencies import DbSession
import os


def get_observation_image(
    db: DbSession,
    external_id: str,
) -> bytes:
    """Load an observation FITS image and return PNG bytes."""

    statement = (
        select(Images)
        .join(
            Observations,
            Observations.id == Images.observation_id,
        )
        .where(
            Observations.external_id == external_id,
        )
    )

    image = db.scalar(statement)

    if image is None:
        raise ValueError(
            f"No image found for observation '{external_id}'."
        )

    fs = create_s3_filesystem(
        endpoint_url=os.environ["MINIO_ENDPOINT"],
        access_key=os.environ["MINIO_ACCESS_KEY"],
        secret_key=os.environ["MINIO_SECRET_KEY"],        
    )

    fits_data = read_file(
        fs,
        image.storage_uri,
    )

    image_data = read_fits(fits_data)

    return create_preview_bytes(image_data)