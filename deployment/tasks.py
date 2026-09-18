from pathlib import Path
import shutil

from invoke import task


ROOT = Path(__file__).resolve().parent.parent

DATABASE_DIR = ROOT / "database"
DATABASE_PYTHON = DATABASE_DIR / ".venv" / "bin" / "python"
DATABASE_DIST = DATABASE_DIR / "dist"

TOOLS_DIR = ROOT / "tools"
TOOLS_PYTHON = TOOLS_DIR / ".venv" / "bin" / "python"
TOOLS_DIST = TOOLS_DIR / "dist"
TOOLS_VENDOR = TOOLS_DIR / "vendor"

API_DIR = ROOT / "rest-api"
API_PYTHON = API_DIR / ".venv" / "bin" / "python"
API_VENDOR = API_DIR / "vendor"


def find_wheel(
    dist: Path,
    pattern: str,
    package_name: str,
) -> Path:
    """Find the wheel for a package."""

    wheels = list(dist.glob(pattern))

    if not wheels:
        raise RuntimeError(
            f"No {package_name} wheel found in {dist}."
        )

    return wheels[0]


def copy_wheel(
    wheel: Path,
    vendor: Path,
    pattern: str,
) -> Path:
    """Copy a wheel into a vendor directory, removing older versions."""

    vendor.mkdir(parents=True, exist_ok=True)

    for path in vendor.glob(pattern):
        path.unlink()

    destination = vendor / wheel.name
    shutil.copy2(wheel, destination)

    return destination


def install_wheel(
    c,
    python: Path,
    wheel: Path,
    find_links: Path | None = None,
) -> None:
    """Install a wheel, optionally using a local directory for dependencies."""

    command = (
        f"{python} -m pip install "
        f"--force-reinstall "
    )

    if find_links is not None:
        command += f"--find-links {find_links} "

    command += str(wheel)

    c.run(command)


@task
def database_build(c):
    """Build the database wheel."""

    with c.cd(str(DATABASE_DIR)):
        c.run(f"{DATABASE_PYTHON} -m build")


# @task
# def tools_build(c):
#     """Build the tools wheel."""

#     with c.cd(str(TOOLS_DIR)):
#         c.run(f"{TOOLS_PYTHON} -m build")


@task(database_build)
def database_vendor(c):
    """Copy the database wheel into the API and tools vendor directories."""

    wheel = find_wheel(
        DATABASE_DIST,
        "database-*.whl",
        "database",
    )

    api_destination = copy_wheel(
        wheel,
        API_VENDOR,
        "database-*.whl",
    )

    # tools_destination = copy_wheel(
    #     wheel,
    #     TOOLS_VENDOR,
    #     "database-*.whl",
    # )

    print(f"Copied {wheel.name} -> {api_destination}")
    # print(f"Copied {wheel.name} -> {tools_destination}")


# @task(tools_build)
# def tools_vendor(c):
#     """Copy the tools wheel into the REST API vendor directory."""

#     wheel = find_wheel(
#         TOOLS_DIST,
#         "transient_lab_tools-*.whl",
#         "tools",
#     )

#     destination = copy_wheel(
#         wheel,
#         API_VENDOR,
#         "transient_lab_tools-*.whl",
#     )

#     print(f"Copied {wheel.name} -> {destination}")


@task(database_vendor)
def api_install(c):
    """Install database and tools into the REST API environment."""

    database_wheel = find_wheel(
        API_VENDOR,
        "database-*.whl",
        "database",
    )

    # tools_wheel = find_wheel(
    #     API_VENDOR,
    #     "transient_lab_tools-*.whl",
    #     "tools",
    # )

    # Install database first so the dependency is already available.
    install_wheel(
        c,
        API_PYTHON,
        database_wheel,
    )

    # Tools declares database==0.1.0 as a dependency.
    # Tell pip where to find our locally built database wheel.
    # install_wheel(
    #     c,
    #     API_PYTHON,
    #     tools_wheel,
    #     find_links=API_VENDOR,
    # )

    with c.cd(str(API_DIR)):
        c.run(f"{API_PYTHON} -m pip install -e .")


# @task(database_vendor)
# def tools_install(c):
#     """Install the database package into the tools environment."""

#     database_wheel = find_wheel(
#         TOOLS_VENDOR,
#         "database-*.whl",
#         "database",
#     )

#     install_wheel(
#         c,
#         TOOLS_PYTHON,
#         database_wheel,
#     )

#     with c.cd(str(TOOLS_DIR)):
#         c.run(f"{TOOLS_PYTHON} -m pip install -e .")


@task(
    database_build,
    # tools_build,
    database_vendor,
    # tools_vendor,
    api_install,
    # tools_install,
)
def build(c):
    """Build and install the backend packages."""

    print("Backend build complete.")