from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from scripts.AdvancedAnalyzer import AdvancedAnalyzer
import json
from pathlib import Path
from typing import Optional

router = APIRouter(prefix="/api", tags=["anonymize"])


class AnonymizeRequest(BaseModel):
    folder_path: str


@router.post("/anonymize")
async def start_anonymization(request: AnonymizeRequest):
    try:
        # 1. On récupère le chemin envoyé par le bouton React
        path_to_scan = request.folder_path

        # 2. On instancie le moteur avec ce chemin
        analyzer = AdvancedAnalyzer(path_to_scan)

        # 3. On lance l'analyse
        analyzer.run()

        return {"status": "success", "message": "Analyse terminée avec succès."}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class ScanContentRequest(BaseModel):
    content: str
    filename: Optional[str] = None

@router.post("/scan_content")
async def scan_content(request: ScanContentRequest):
    """
    Analyse un contenu de fichier collé par l'utilisateur.
    Génère un plan d'anonymisation (même structure qu'un scan de dossier).
    """
    content = request.content
    filename = request.filename or "contenu.txt"

    # Écrire temporairement dans un fichier pour réutiliser l'analyseur
    temp_file = Path("utils/temp_content.txt")
    temp_file.parent.mkdir(parents=True, exist_ok=True)
    temp_file.write_text(content, encoding="utf-8")

    # Créer un dossier temporaire avec le fichier
    temp_dir = Path("utils/temp_scan")
    temp_dir.mkdir(parents=True, exist_ok=True)
    (temp_dir / filename).write_text(content, encoding="utf-8")

    # Lancer l'analyseur sur le dossier temporaire
    try:
        analyzer = AdvancedAnalyzer(str(temp_dir))
        analyzer.run()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Échec de l'analyse: {e}")

    # Lire le plan généré
    plan_path = Path("utils/proposition_changes_plan.json")
    if not plan_path.exists():
        raise HTTPException(status_code=500, detail="Plan non généré.")

    with open(plan_path, "r", encoding="utf-8") as f:
        plan = json.load(f)

    # Nettoyer les fichiers temporaires
    import shutil
    shutil.rmtree(temp_dir, ignore_errors=True)
    temp_file.unlink(missing_ok=True)

    return {"status": "success", "count": len(plan)}