import json
from pathlib import Path
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List

from scripts.Transformer import Transformer

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
    chemin_enregistrement: Optional[str] = None
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
    output_path = Path("utils/validated_changes_plan.json") 
    output_path.parent.mkdir(parents=True, exist_ok=True)

    try:
        with open(output_path, "w", encoding="utf-8") as f:
            json.dump(validated_plan, f, indent=2, ensure_ascii=False)
        # return {"status": "success", "count": len(validated_plan), "path": str(output_path)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    # ─── Lancer l'anonymisation ───────────────────────────────
    try:
        transformer = Transformer(str(output_path), folder_path)
        transformer.run(False)  # False = anonymisation (original → proposition)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Plan sauvegardé mais anonymisation échouée: {e}"
        )

    return {
        "status": "success",
        "count": len(validated_plan),
        "plan_path": str(output_path),
        "output_dir": str(Path("anonymized")),
    }


class SubmitContentRequest(BaseModel):
    content: str
    plan: List[FichierPlan]

@router.post("/submit_content")
def submit_content(request: SubmitContentRequest):
    """
    Applique les transformations validées sur un contenu de fichier.
    Retourne le texte anonymisé.
    """
    content = request.content
    filename = "contenu.txt"

    # Appliquer les remplacements
    result = content
    for fichier in request.plan:
        if fichier.decision_fichier == "n":
            continue
        for modif in fichier.modif_interne:
            if modif.decision == "i":
                continue
            if modif.decision == "e" and modif.custom_value:
                result = result.replace(modif.original, modif.custom_value)
            elif modif.decision == "v":
                result = result.replace(modif.original, modif.proposition)

    # Sauvegarder dans anonymized/
    output_path = Path("anonymized") / filename
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(result, encoding="utf-8")

    # Sauvegarder le plan validé
    plan_file = Path("utils/validated_changes_plan.json")
    plan_file.parent.mkdir(parents=True, exist_ok=True)

    validated_plan = []
    for fichier in request.plan:
        if fichier.decision_fichier == "n":
            validated_plan.append({
                "chemin_fichier": filename,
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
                "chemin_fichier": filename,
                "modif_interne": modifs_valides
            })

    with open(plan_file, "w", encoding="utf-8") as f:
        json.dump(validated_plan, f, indent=2, ensure_ascii=False)

    return {
        "status": "success",
        "anonymized_text": result,
        "filename": filename,
        "count": len(validated_plan),
    }


    