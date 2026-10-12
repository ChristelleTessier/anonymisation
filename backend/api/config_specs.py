import json
from pathlib import Path
from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/api", tags=["config_specs"])

# Chemin vers utils/config_specs.json (remonte d'un cran vers backend puis utils)
CONFIG_SPECS_PATH = Path(__file__).resolve().parent.parent / "utils" / "config_specs.json"

@router.get("/config-specs")
def get_config_specs():
    if not CONFIG_SPECS_PATH.exists():
        raise HTTPException(
            status_code=404,
            detail="Fichier config_specs.json introuvable"
        )

    try:
        with open(CONFIG_SPECS_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
        return data
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erreur de lecture du fichier config_specs.json : {str(e)}"
        )
