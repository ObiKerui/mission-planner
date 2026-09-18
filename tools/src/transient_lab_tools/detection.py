from dataclasses import dataclass

import numpy as np
from scipy import ndimage


@dataclass(frozen=True)
class Candidate:
    """A detected transient candidate."""

    x: float
    y: float
    significance: float
    pixel_count: int


def detect_candidates(
    difference: np.ndarray,
    *,
    sigma_threshold: float = 5.0,
    min_pixels: int = 3,
) -> list[Candidate]:
    """
    Detect significant positive sources in a difference image.

    Parameters
    ----------
    difference:
        Difference image (observation - reference).

    sigma_threshold:
        Number of standard deviations above the background required
        for a pixel to be considered significant.

    min_pixels:
        Minimum number of connected significant pixels required for
        a region to be considered a candidate.
    """

    if difference.ndim != 2:
        raise ValueError("Difference image must be two-dimensional")

    # Convert to float so calculations aren't affected by the original
    # FITS data type.
    image = difference.astype(np.float64)

    # Estimate the background using the median.
    background = np.median(image)

    # Estimate the noise using the median absolute deviation (MAD).
    #
    # For Gaussian noise:
    #
    # sigma ≈ 1.4826 × MAD
    #
    mad = np.median(np.abs(image - background))
    noise = 1.4826 * mad

    if noise <= 0:
        return []

    threshold = background + sigma_threshold * noise

    # Pixels significantly brighter than the background.
    significant = image > threshold

    # Label connected regions of significant pixels.
    labels, region_count = ndimage.label(
        significant,
        structure=np.ones((3, 3), dtype=int),
    )

    candidates: list[Candidate] = []

    for label in range(1, region_count + 1):
        pixels = np.argwhere(labels == label)

        pixel_count = len(pixels)

        if pixel_count < min_pixels:
            continue

        # np.argwhere returns [row, column] = [y, x].
        y_pixels = pixels[:, 0]
        x_pixels = pixels[:, 1]

        # Use the pixel intensity as a weight when calculating the
        # centroid. This puts the centroid closer to the brightest
        # part of the source.
        values = image[y_pixels, x_pixels] - background

        total_weight = values.sum()

        if total_weight <= 0:
            continue

        x = float(np.average(x_pixels, weights=values))
        y = float(np.average(y_pixels, weights=values))

        # Estimate the significance of the brightest pixel in the region.
        peak = image[y_pixels, x_pixels].max()
        significance = float(
            (peak - background) / noise
        )

        candidates.append(
            Candidate(
                x=x,
                y=y,
                significance=significance,
                pixel_count=pixel_count,
            )
        )

    # Highest significance first.
    candidates.sort(
        key=lambda candidate: candidate.significance,
        reverse=True,
    )

    return candidates