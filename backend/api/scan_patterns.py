import json
from pathlib import Path
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict

router = APIRouter(prefix="/api", tags=["settings"])

# Chemin vers utils/patterns.json (remonte d'un cran vers backend puis utils)
CONFIG_PATH = Path(__file__).resolve().parent.parent / "utils" / "patterns.json"

# class ScanSettingsModel(BaseModel):
#     categories : List[str]
#     def_rules : List[Dict[str, str]]

@router.get("/scan-patterns")
def get_scan_settings():
    if not CONFIG_PATH.exists():
        raise HTTPException(
            status_code=404,
            detail="Fichier patterns.json introuvable"
        )

    try:
        with open(CONFIG_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
        return data
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erreur de lecture du fichier : {str(e)}"
        )