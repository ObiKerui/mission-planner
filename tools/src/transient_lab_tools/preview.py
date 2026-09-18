from io import BytesIO
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np


def create_preview(
    image: np.ndarray,
    output_path: Path,
) -> None:
    """Create a visual preview of an astronomical image."""

    plt.figure(figsize=(8, 8))

    plt.imshow(
        image,
        origin="lower",
        cmap="gray",
    )

    plt.axis("off")
    plt.tight_layout(pad=0)

    plt.savefig(
        output_path,
        dpi=150,
        bbox_inches="tight",
        pad_inches=0,
    )

    plt.close()


def create_preview_bytes(
    image: np.ndarray,
) -> bytes:
    """Create a visual preview of an astronomical image as PNG bytes."""

    buffer = BytesIO()

    plt.figure(figsize=(8, 8))

    plt.imshow(
        image,
        origin="lower",
        cmap="gray",
    )

    plt.axis("off")
    plt.tight_layout(pad=0)

    plt.savefig(
        buffer,
        format="png",
        dpi=150,
        bbox_inches="tight",
        pad_inches=0,
    )

    plt.close()

    return buffer.getvalue()