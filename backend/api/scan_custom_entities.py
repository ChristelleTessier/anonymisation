import json
from pathlib import Path
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List

router = APIRouter(prefix="/api", tags=["custom_entities"])

# Chemin vers utils/custom_entities.json (remonte d'un cran vers backend puis utils)
CONFIG_PATH = Path(__file__).resolve().parent.parent / "utils" / "custom_entities.json"

class CustomEntitiesModel(BaseModel):
    entities: List[str]

@router.get("/scan-custom-entities")
def get_custom_entities():
    if not CONFIG_PATH.exists():
        raise HTTPException(
            status_code=404,
            detail="Fichier custom_entities.json introuvable"
        )

    try:
        with open(CONFIG_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
        return data #data.get("entities", [])
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erreur de lecture du fichier : {str(e)}"
        )

@router.post("/scan-custom-entities")
def update_custom_entities(payload: CustomEntitiesModel):
    try:
        existing_data = {}
        if CONFIG_PATH.exists():
            with open(CONFIG_PATH, "r", encoding="utf-8") as f:
                existing_data = json.load(f)

        # On conserve la description existante et on remplace la liste
        existing_data["entities"] = payload.entities

        with open(CONFIG_PATH, "w", encoding="utf-8") as f:
            json.dump(existing_data, f, indent=2, ensure_ascii=False)

        return {"status": "success", "message": "Fichier custom_entities.json mis à jour"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
