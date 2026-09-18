from dataclasses import dataclass
import os

from sqlalchemy import select
from sqlalchemy.orm import Session

from database.models.generated import Images, Observations

from transient_lab_tools.detection import Candidate, detect_candidates
from transient_lab_tools.difference import create_difference
from transient_lab_tools.storage import create_s3_filesystem, read_file
from transient_lab_tools.wcs import pixel_to_sky
from transient_lab_tools.fits import read_fits, read_wcs

@dataclass(frozen=True)
class DetectedCandidate:
    candidate: Candidate
    ra_deg: float
    dec_deg: float


def detect_observation(
    session: Session,
    external_id: str,
) -> list[DetectedCandidate]:
    """Detect transient candidates in a stored observation."""

    observation = session.scalar(
        select(Observations).where(
            Observations.external_id == external_id
        )
    )

    if observation is None:
        raise ValueError(
            f"Observation {external_id} not found"
        )

    image = session.scalar(
        select(Images)
        .where(
            Images.observation_id == observation.id
        )
        .limit(1)
    )

    if image is None:
        raise ValueError(
            f"No image found for observation {external_id}"
        )

    fs = create_s3_filesystem(
        endpoint_url=os.environ["MINIO_ENDPOINT"],
        access_key=os.environ["MINIO_ACCESS_KEY"],
        secret_key=os.environ["MINIO_SECRET_KEY"],
    )

    reference_bytes = read_file(
        fs,
        f"s3://observations/{external_id}/reference.fits",
    )

    observation_bytes = read_file(
        fs,
        f"s3://observations/{external_id}/observation.fits",
    )

    reference = read_fits(reference_bytes)
    observation_data = read_fits(observation_bytes)
    wcs = read_wcs(observation_bytes)

    difference = create_difference(
        reference,
        observation_data,
    )

    candidates = detect_candidates(
        difference,
    )

    detected_candidates = []

    for candidate in candidates:
        ra_deg, dec_deg = pixel_to_sky(
            wcs,
            candidate.x,
            candidate.y,
        )

        detected_candidates.append(
            DetectedCandidate(
                candidate=candidate,
                ra_deg=ra_deg,
                dec_deg=dec_deg,
            )
        )

    return detected_candidates