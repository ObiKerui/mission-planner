from dataclasses import dataclass
import os

from sqlalchemy import select

from database.database import init_engine, session_scope
from database.models.generated import (
    CandidateDetections,
    Candidates,
    DetectionRuns,
    Detections,
    Images,
    Observations,
)

from .detection import detect_candidates
from .difference import create_difference
from .fits import read_fits_with_wcs
from .storage import create_s3_filesystem, read_file
from .wcs import pixel_to_sky


@dataclass(frozen=True)
class DetectionResult:
    detection_run_id: str
    detection_count: int
    candidate_count: int


def detect_observation(
    external_id: str,
) -> DetectionResult:
    """Run transient detection on a stored observation."""

    init_engine(
        os.environ["DATABASE_URL"],
    )

    with session_scope() as session:

        # Find the observation.
        observation = session.scalar(
            select(Observations).where(
                Observations.external_id == external_id
            )
        )

        if observation is None:
            raise RuntimeError(
                f"Observation {external_id!r} not found"
            )

        # Find the image associated with the observation.
        image = session.scalar(
            select(Images).where(
                Images.observation_id == observation.id
            )
        )

        if image is None:
            raise RuntimeError(
                f"No image found for observation {external_id!r}"
            )

        # Load the FITS data and WCS.
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

        reference, _ = read_fits_with_wcs(
            reference_bytes,
        )

        science, wcs = read_fits_with_wcs(
            observation_bytes,
        )
        
        # Create difference image.
        difference = create_difference(
            reference,
            science,
        )

        # Detect transient candidates.
        detected_candidates = detect_candidates(
            difference,
        )

        # Create detection run.
        detection_run = DetectionRuns(
            algorithm_name="transient_detection",
            algorithm_version="0.1.0",
            parameters={
                "sigma_threshold": 5.0,
                "min_pixels": 3,
            },
            confidence_threshold=5.0,
            status="running",
        )

        session.add(detection_run)
        session.flush()

        detection_count = 0
        candidate_count = 0

        for candidate in detected_candidates:

            # Convert detector pixel coordinates to sky coordinates.
            ra_deg, dec_deg = pixel_to_sky(
                wcs,
                candidate.x,
                candidate.y,
            )

            detection = Detections(
                image_id=image.id,
                detection_run_id=detection_run.id,
                ra_deg=ra_deg,
                dec_deg=dec_deg,
                x=candidate.x,
                y=candidate.y,
                confidence=candidate.significance,
                metadata_={
                    "pixel_count": candidate.pixel_count,
                },
            )

            session.add(detection)
            session.flush()

            detection_count += 1

            # Create candidate.
            db_candidate = Candidates(
                name=(
                    f"{external_id}-"
                    f"{candidate_count + 1}"
                ),
                status="new",
                ra_deg=ra_deg,
                dec_deg=dec_deg,
                metadata_={
                    "significance": candidate.significance,
                    "pixel_count": candidate.pixel_count,
                },
            )

            session.add(db_candidate)
            session.flush()

            candidate_count += 1

            # Link candidate to detection.
            candidate_detection = CandidateDetections(
                candidate_id=db_candidate.id,
                detection_id=detection.id,
                association_score=1.0,
            )

            session.add(candidate_detection)

        # Complete detection run.
        detection_run.status = "completed"

        return DetectionResult(
            detection_run_id=str(detection_run.id),
            detection_count=detection_count,
            candidate_count=candidate_count,
        )
