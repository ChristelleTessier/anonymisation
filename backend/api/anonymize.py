from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from scripts.AdvancedAnalyzer import AdvancedAnalyzer

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