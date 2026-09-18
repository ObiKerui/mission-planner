import numpy as np


def create_difference(
    reference: np.ndarray,
    observation: np.ndarray,
) -> np.ndarray:
    """Create a difference image between two observations."""

    if reference.shape != observation.shape:
        raise ValueError(
            "Reference and observation images must have the same shape"
        )

    return observation.astype(np.float32) - reference.astype(np.float32)