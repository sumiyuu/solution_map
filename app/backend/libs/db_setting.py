from pathlib import Path

def get_db_path():
    BASE_DIR = Path(__file__).resolve().parents[2]
    DB_PATH = BASE_DIR / "db" / "app.db"
    return DB_PATH