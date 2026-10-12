import json
from pathlib import Path
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List

router = APIRouter(prefix="/api", tags=["settings"])

# Chemin vers utils/settings.json (remonte d'un cran vers backend puis utils)
CONFIG_PATH = Path(__file__).resolve().parent.parent / "utils" / "settings.json"

class ScanSettingsModel(BaseModel):
    target_extensions: List[str]
    ignored_extensions: List[str]
    ignored_directories: List[str]

@router.get("/scan-settings")
def get_scan_settings():
    if not CONFIG_PATH.exists():
        raise HTTPException(
            status_code=404,
            detail="Fichier scan_settings.json introuvable"
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

@router.post("/scan-settings")
def update_scan_settings(settings: ScanSettingsModel):
    try:
        # Lire les données existantes pour ne pas écraser d'autres champs non gérés
        existing_data = {}
        if CONFIG_PATH.exists():
            with open(CONFIG_PATH, "r", encoding="utf-8") as f:
                existing_data = json.load(f)

        # Mettre à jour avec les nouvelles valeurs
        updated_data = {
            **existing_data,
            "target_extensions": settings.target_extensions,
            "ignored_extensions": settings.ignored_extensions,
            "ignored_directories": settings.ignored_directories,
        }

        # Écriture dans le fichier JSON
        with open(CONFIG_PATH, "w", encoding="utf-8") as f:
            json.dump(updated_data, f, indent=2, ensure_ascii=False)

        return {"status": "success", "message": "Fichier mis à jour avec succès"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
