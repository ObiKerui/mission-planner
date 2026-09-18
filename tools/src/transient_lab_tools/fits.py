from io import BytesIO

import numpy as np
from astropy.io import fits
from astropy.wcs import WCS

def fits_bytes(
    data: np.ndarray,
    *,
    object_name: str,
    observation_type: str,
) -> bytes:
    """Create FITS bytes containing an image and WCS."""

    wcs = WCS(naxis=2)

    wcs.wcs.crpix = [256.0, 256.0]
    wcs.wcs.crval = [187.7059, 12.3911]
    wcs.wcs.cdelt = [-0.0002777778, 0.0002777778]
    wcs.wcs.ctype = ["RA---TAN", "DEC--TAN"]

    header = wcs.to_header()

    header["OBJECT"] = object_name
    header["FILTER"] = "r"
    header["EXPTIME"] = 30.0
    header["IMAGETYPE"] = observation_type

    hdu = fits.PrimaryHDU(
        data=data,
        header=header,
    )

    buffer = BytesIO()

    hdu.writeto(
        buffer,
        overwrite=True,
    )

    return buffer.getvalue()

def read_fits(
    data: bytes,
) -> np.ndarray:
    """Read FITS bytes into a NumPy array."""

    with fits.open(BytesIO(data)) as hdul:
        return hdul[0].data.copy()


def read_fits_with_wcs(
    data: bytes,
) -> tuple[np.ndarray, WCS]:
    """Read a FITS image and its WCS."""

    with fits.open(BytesIO(data)) as hdul:
        image = hdul[0].data.copy()
        wcs = WCS(hdul[0].header)

    return image, wcs
