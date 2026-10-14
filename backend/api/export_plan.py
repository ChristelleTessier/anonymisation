import zipfile
import io
from pathlib import Path
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

router = APIRouter(prefix="/api/chargement", tags=["chargement"])


@router.get("/download")
def download_results():
    """
    Zipe le dossier anonymized/ + le plan validé et renvoie le fichier.
    """
    anonymized_dir = Path("anonymized")
    plan_file = Path("utils/validated_change_plan.json")

    if not anonymized_dir.exists():
        raise HTTPException(status_code=404, detail="Dossier anonymized/ introuvable.")
    if not plan_file.exists():
        raise HTTPException(status_code=404, detail="Plan validé introuvable.")

    buffer = io.BytesIO()
    with zipfile.ZipFile(buffer, "w", zipfile.ZIP_DEFLATED) as zipf:
        # Ajouter le plan validé
        zipf.write(plan_file, "validated_change_plan.json")
        # Ajouter tous les fichiers anonymisés
        for f in anonymized_dir.rglob("*"):
            if f.is_file():
                zipf.write(f, f"anonymized/{f.relative_to(anonymized_dir)}")

    buffer.seek(0)

    return StreamingResponse(
        buffer,
        media_type="application/zip",
        headers={"Content-Disposition": "attachment; filename=anonymized_results.zip"},
    )