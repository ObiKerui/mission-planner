from io import BytesIO
import os
from pathlib import Path

import click
from dotenv import load_dotenv
from transient_lab_tools.difference import create_difference
from transient_lab_tools.generation import generate_test_observation
from transient_lab_tools.detection_service import detect_observation
from transient_lab_tools.storage import create_s3_filesystem, read_file
from transient_lab_tools.fits import read_fits
from transient_lab_tools.preview import create_preview

load_dotenv()

@click.group()
def cli():
    """TransientLab scientific data and processing tools."""


@cli.command()
def generate_observation_command():
    """Generate a synthetic astronomical observation."""

    """Generate a synthetic astronomical observation."""

    result = generate_test_observation()

    click.echo(
        f"Generated {result.external_id}"
    )
        
@cli.command("preview-observation")
def preview_observation_command():
    """Create previews of an observation stored in MinIO."""

    fs = create_s3_filesystem(
        endpoint_url=os.environ["MINIO_ENDPOINT"],
        access_key=os.environ["MINIO_ACCESS_KEY"],
        secret_key=os.environ["MINIO_SECRET_KEY"],
    )

    reference_bytes = read_file(
        fs,
        "s3://observations/TEST-OBS-001/reference.fits",
    )

    observation_bytes = read_file(
        fs,
        "s3://observations/TEST-OBS-001/observation.fits",
    )

    reference = read_fits(reference_bytes)
    observation = read_fits(observation_bytes)

    difference = create_difference(
        reference,
        observation,
    )

    output_dir = Path("data")
    output_dir.mkdir(exist_ok=True)

    create_preview(
        reference,
        output_dir / "reference.png",
    )

    create_preview(
        observation,
        output_dir / "observation.png",
    )

    create_preview(
        difference,
        output_dir / "difference.png",
    )
    
@cli.command("detect-observation")
@click.argument("external_id")
def detect_observation_command(external_id: str):
    """Detect transient candidates in a stored observation."""

    result = detect_observation(external_id)

    click.echo(
        f"Detection run: {result.detection_run_id}"
    )
    click.echo(
        f"Detections: {result.detection_count}"
    )
    click.echo(
        f"Candidates: {result.candidate_count}"
    )