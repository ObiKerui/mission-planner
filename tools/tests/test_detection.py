import numpy as np

from transient_lab_tools.detection import detect_candidates


def test_detects_bright_source():
    rng = np.random.default_rng(42)

    image = rng.normal(
        0,
        1,
        (100, 100),
    ).astype(np.float32)

    image[48:53, 68:73] += 100

    candidates = detect_candidates(
        image,
        sigma_threshold=5.0,
        min_pixels=3,
    )

    assert len(candidates) == 1

    candidate = candidates[0]

    assert abs(candidate.x - 70) < 1
    assert abs(candidate.y - 50) < 1
    assert candidate.significance > 5