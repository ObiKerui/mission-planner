
from dataclasses import dataclass
from pathlib import Path

import numpy as np
from astropy.io import fits

@dataclass
class GeneratedObservation:
    reference: np.ndarray
    observation: np.ndarray

IMAGE_SIZE = 512
BACKGROUND = 1000.0
NOISE_STD = 10.0

# Fixed seed so that the same observation is generated every time.
RNG_SEED = 42

# Stars in (x, y, peak_flux, sigma).
STARS = [
    (80, 120, 5000, 2.0),
    (180, 90, 3000, 1.8),
    (320, 140, 8000, 2.5),
    (420, 80, 4500, 2.0),
    (120, 300, 6000, 2.2),
    (250, 250, 3500, 1.7),
    (400, 320, 7000, 2.4),
    (90, 430, 2500, 1.6),
    (300, 430, 5500, 2.1),
    (450, 450, 4000, 1.9),
]

# Deliberately injected transient.
TRANSIENT_X = 360
TRANSIENT_Y = 280
TRANSIENT_FLUX = 15000
TRANSIENT_SIGMA = 2.0


def _add_star(
    image: np.ndarray,
    x: float,
    y: float,
    peak_flux: float,
    sigma: float,
) -> None:
    """Add a Gaussian point source to an image."""

    radius = int(4 * sigma)

    x_min = max(0, int(x) - radius)
    x_max = min(image.shape[1], int(x) + radius + 1)
    y_min = max(0, int(y) - radius)
    y_max = min(image.shape[0], int(y) + radius + 1)

    yy, xx = np.mgrid[y_min:y_max, x_min:x_max]

    gaussian = peak_flux * np.exp(
        -((xx - x) ** 2 + (yy - y) ** 2) / (2 * sigma**2)
    )

    image[y_min:y_max, x_min:x_max] += gaussian


def _create_image(
    rng: np.random.Generator,
    include_transient: bool,
) -> np.ndarray:
    """Create a synthetic astronomical image."""

    image = np.full(
        (IMAGE_SIZE, IMAGE_SIZE),
        BACKGROUND,
        dtype=np.float32,
    )

    # Add background noise.
    image += rng.normal(
        0,
        NOISE_STD,
        image.shape,
    ).astype(np.float32)

    # Add ordinary stars.
    for x, y, flux, sigma in STARS:
        _add_star(
            image,
            x,
            y,
            flux,
            sigma,
        )

    # Add transient only to the new observation.
    if include_transient:
        _add_star(
            image,
            TRANSIENT_X,
            TRANSIENT_Y,
            TRANSIENT_FLUX,
            TRANSIENT_SIGMA,
        )

    return image


def _write_fits(
    path: Path,
    image: np.ndarray,
    *,
    observation_type: str,
) -> None:
    """Write an image and its metadata to a FITS file."""

    header = fits.Header()

    header["OBJECT"] = "TEST-OBS-001"
    header["RA"] = 187.7059
    header["DEC"] = 12.3911
    header["FILTER"] = "r"
    header["EXPTIME"] = 30.0
    header["IMAGETYP"] = observation_type

    fits.PrimaryHDU(
        data=image,
        header=header,
    ).writeto(
        path,
        overwrite=True,
    )


def generate_observation() -> GeneratedObservation:
    rng = np.random.default_rng(42)

    reference = _create_image(
        rng,
        include_transient=False,
    )

    observation = _create_image(
        rng,
        include_transient=True,
    )

    return GeneratedObservation(
        reference=reference,
        observation=observation,
    )
