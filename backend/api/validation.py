import json
from pathlib import Path
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List

router = APIRouter(prefix="/api/validation", tags=["validation"])


# ─── Modèles Pydantic ───────────────────────────────────

class ModifInterne(BaseModel):
    category: str
    original: str
    proposition: str
    # Champ que le frontend utilisera pour stocker la décision
    decision: Optional[str] = "v"  # "v" | "e" | "i"
    custom_value: Optional[str] = None  # si decision == "e"


class FichierPlan(BaseModel):
    chemin_fichier: str
    chemin_enregistrement: str
    modif_nom: Optional[str] = None
    modif_interne: List[ModifInterne] = []
    # Décision à l'échelle du fichier
    decision_fichier: Optional[str] = "o"  # "o" | "n"


class ValidatedPlanRequest(BaseModel):
    plan: List[FichierPlan]


# ─── Endpoints ───────────────────────────────────────────

@router.get("/plan")
def get_plan():
    """
    Récupère proposition_changes_plan.json généré par analyzer.run().
    Le paramètre folder_path permet de localiser le bon dossier
    de plan (plan_anonymisation/changes_plan.json).
    """
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
    """
    Reçoit le plan validé par l'utilisateur depuis le frontend.
    Construit le validated_plan (même structure que dans ValidationInterface.py)
    et le sauvegarde.
    """
    validated_plan = []

    for fichier in request.plan:
        # Si l'utilisateur a choisi de sauter le fichier ("n"), on l'ajoute sans modifs
        if fichier.decision_fichier == "n":
            validated_plan.append({
                "chemin_fichier": fichier.chemin_fichier,
                "chemin_enregistrement": fichier.chemin_enregistrement,
                "modif_interne": None
            })
            continue

        # On filtre les modifs selon les décisions
        modifs_valides = []
        for modif in fichier.modif_interne:
            if modif.decision == "i":
                continue  # ignorée
            if modif.decision == "e" and modif.custom_value:
                modifs_valides.append({
                    "category": modif.category,
                    "original": modif.original,
                    "proposition": modif.custom_value  # valeur éditée par l'utilisateur
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
                "chemin_enregistrement": fichier.chemin_enregistrement,
                "modif_interne": modifs_valides
            })

    # Sauvegarde
    output_path = "utils/validated_plan.json"
    output_path.parent.mkdir(parents=True, exist_ok=True)

    try:
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(validated_plan, f, indent=2, ensure_ascii=False)
        return {"status": "success", "count": len(validated_plan), "path": str(output_path)}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))