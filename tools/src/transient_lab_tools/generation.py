from dataclasses import dataclass
import os

from sqlalchemy import select

from database.database import init_engine, session_scope
from database.models.generated import Images, Observations
from transient_lab_tools.wcs import wcs_to_dict

from .fits import fits_bytes, read_fits_with_wcs
from .storage import create_s3_filesystem, write_file
from .generate_test_observation import generate_observation


@dataclass(frozen=True)
class GeneratedObservationResult:
    external_id: str
    image_id: str


def generate_test_observation() -> GeneratedObservationResult:
    external_id = "TEST-OBS-001"

    generated = generate_observation()

    fs = create_s3_filesystem(
        endpoint_url=os.environ["MINIO_ENDPOINT"],
        access_key=os.environ["MINIO_ACCESS_KEY"],
        secret_key=os.environ["MINIO_SECRET_KEY"],
    )

    reference_data = fits_bytes(
        generated.reference,
        object_name=external_id,
        observation_type="REFERENCE",
    )

    observation_data = fits_bytes(
        generated.observation,
        object_name=external_id,
        observation_type="SCIENCE",
    )

    _, observation_wcs = read_fits_with_wcs(observation_data)

    reference_uri = (
        f"s3://observations/{external_id}/reference.fits"
    )

    observation_uri = (
        f"s3://observations/{external_id}/observation.fits"
    )

    write_file(
        fs,
        reference_uri,
        reference_data,
    )

    write_file(
        fs,
        observation_uri,
        observation_data,
    )

    init_engine(
        os.environ["DATABASE_URL"],
    )

    with session_scope() as session:
        db_observation = session.scalar(
            select(Observations).where(
                Observations.external_id == external_id
            )
        )

        if db_observation is None:
            raise RuntimeError(
                f"Observation {external_id!r} does not exist"
            )

        session.query(Images).filter(
            Images.observation_id == db_observation.id
        ).delete()

        image = Images(
            observation_id=db_observation.id,
            storage_uri=observation_uri,
            width=generated.observation.shape[1],
            height=generated.observation.shape[0],
            data_type=str(generated.observation.dtype),
            bit_depth=32,
            wcs=wcs_to_dict(observation_wcs),
        )

        print('adding image: ', image)
        session.add(image)
        session.flush()
        
        image_id = str(image.id)
        print('image: ', image_id)
        
    return GeneratedObservationResult(
        external_id=external_id,
        image_id=image_id,
    )