import json
from pathlib import Path
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List

router = APIRouter(prefix="/api/validation", tags=["validation"])

# ─── Modèles Pydantic ───────────────────────────────────────────

class ModifInterne(BaseModel):
    category: str
    original: str
    proposition: str
    decision: Optional[str] = "v"  # "v" | "e" | "i"
    custom_value: Optional[str] = None  # si decision == "e"

class FichierPlan(BaseModel):
    chemin_fichier: str
    chemin_enregistrement: Optional[str] = None  # ← MODIF 1 : optionnel
    modif_nom: Optional[str] = None
    modif_interne: List[ModifInterne] = []
    decision_fichier: Optional[str] = "o"  # "o" | "n"

class ValidatedPlanRequest(BaseModel):
    plan: List[FichierPlan]

# ─── Endpoints ───────────────────────────────────────────

@router.get("/plan")
def get_plan():
    plan_path = "utils/proposition_changes_plan.json"

    if not Path(plan_path).exists():
        raise HTTPException(
            status_code=404,
            detail="Plan d'anonymisation introuvable."
        )

    try:
        with open(plan_path, "r", encoding="utf-8") as f:
            plan = json.load(f)
        return {"plan": plan}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/submit")
def submit_validated_plan(request: ValidatedPlanRequest, folder_path: str):
    validated_plan = []

    for fichier in request.plan:
        if fichier.decision_fichier == "n":
            validated_plan.append({
                "chemin_fichier": fichier.chemin_fichier,
                "modif_interne": None
            })
            continue

        modifs_valides = []
        for modif in fichier.modif_interne:
            if modif.decision == "i":
                continue
            if modif.decision == "e" and modif.custom_value:
                modifs_valides.append({
                    "category": modif.category,
                    "original": modif.original,
                    "proposition": modif.custom_value
                })
            elif modif.decision == "v":
                modifs_valides.append({
                    "category": modif.category,
                    "original": modif.original,
                    "proposition": modif.proposition
                })

        if modifs_valides:
            validated_plan.append({
                "chemin_fichier": fichier.chemin_fichier,
                "modif_interne": modifs_valides
            })

    # ─── Sauvegarde ───────────────────────────────────────────
    output_path = Path("utils/validated_change_plan.json")  # ← MODIF 2 : Path + nouveau nom
    output_path.parent.mkdir(parents=True, exist_ok=True)

    try:
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(validated_plan, f, indent=2, ensure_ascii=False)
        return {"status": "success", "count": len(validated_plan), "path": str(output_path)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))