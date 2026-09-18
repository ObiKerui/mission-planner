import os
from pathlib import Path
import subprocess
from typing import LiteralString, cast

import click
import psycopg
from dotenv import load_dotenv
from psycopg import sql as psycopg_sql

load_dotenv()

PACKAGE_DIR = Path(__file__).resolve().parent
SCHEMA_DIR = PACKAGE_DIR / "schema"
SEEDS_DIR = PACKAGE_DIR / "seeds"

def _get_url(database_url: str | None) -> str:
    url = database_url or os.getenv("DATABASE_URL")
    return url
    
def _run_sql_dir(cur: psycopg.Cursor, directory: Path, label: str) -> None:
    sql_files = sorted(directory.glob("*.sql"))
    
    if not sql_files:
        click.echo(f"No {label} files found in {directory}")
    
    for path in sql_files:
        click.echo(f"Applying {label}: {path.name}")
        raw_sql = path.read_text(encoding="utf-8")
        cur.execute(cast(LiteralString, raw_sql))
    
    click.echo(f"Done - applied {len(sql_files)} {label} file(s).")
    
def _run_sql_file(cur: psycopg.Cursor, sql_file: Path, label: str) -> None:
    
    if not sql_file.exists():
        click.echo(f"No {label} files found in {sql_file}")
    

    click.echo(f"Applying {label}: {sql_file.name}")
    raw_sql = sql_file.read_text(encoding="utf-8")
    cur.execute(cast(LiteralString, raw_sql))
    
    click.echo(f"Done - applied {(sql_file)} {label} file(s).")
    
@click.group()
def cli():
    "manage database"

@cli.command("apply-schema") 
@click.option( "--database-url", envvar="DATABASE_PG_URL", help="PostgreSQL connection string", ) 
def apply_schema(database_url): 
    """Run all schema/*.sql files in order.""" 
    url = _get_url(database_url) 
    with psycopg.connect(url) as conn: 
        with conn.cursor() as cur: 
            _run_sql_dir(cur, SCHEMA_DIR, "schema") 
            
@cli.command("seed") 
@click.option( "--database-url", envvar="DATABASE_PG_URL", help="PostgreSQL connection string", ) 
def seed(database_url): 
    """Run all seed files in order.""" 
    url = _get_url(database_url) 
    with psycopg.connect(url) as conn: 
        with conn.cursor() as cur: 
            path_to_seed_file = SEEDS_DIR / "reset_scenario_1.sql" 
            _run_sql_file(cur, path_to_seed_file, "schema")
            
@cli.command("gen-models")
@click.option(
    "--database-url",
    envvar="DATABASE_URL",
    help="Postgres connection string"
)
@click.option(
    "--output",
    default="database/models/generated.py",
    help="output file"
)
def gen_models(database_url: str, output: str):
    """generate the models

    Args:
        database_url (str): _description_
        output (str): _description_
    """
    url = _get_url(database_url)
    
    result = subprocess.run(
        [
            "sqlacodegen_v2",
            url,
            "--schemas",
            "public",
            "--generator",
            "declarative"
        ],
        capture_output=True,
        text=True,
        encoding="utf-8",
        check=True,
        env={**os.environ, "PYTHONUTF8": "1"}
    )
    models = result.stdout
    
    os.makedirs(os.path.dirname(output), exist_ok=True)
    
    with open(output, "w", encoding="utf-8") as f:
        f.write(models)
        
    click.echo(f"Generated models to {output}")
    
if __name__ == "__main__":
    cli()