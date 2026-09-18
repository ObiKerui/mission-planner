from astropy.wcs import WCS

def wcs_to_dict(
    wcs: WCS,
) -> dict[str, object]:
    """Convert WCS to a JSON-serialisable dictionary."""

    header = wcs.to_header()

    return {
        key: value
        for key, value in header.items()
    }

def pixel_to_sky(
    wcs: WCS,
    x: float,
    y: float,
) -> tuple[float, float]:
    """Convert image pixel coordinates to RA/Dec in degrees."""

    ra, dec = wcs.pixel_to_world_values(x, y)

    return float(ra), float(dec)