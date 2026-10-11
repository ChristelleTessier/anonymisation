import io
import zipfile
from pathlib import Path
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

router = APIRouter(prefix="/api", tags=["export"])

# Remonte d'un cran depuis backend/api vers backend, puis cible utils
UTILS_DIR = Path(__file__).resolve().parent.parent / "utils"

@router.get("/download-configs")
def download_configs():
    files_to_pack = ["scan_settings.json", "custom_entities.json", "pattern.json"]

    zip_buffer = io.BytesIO()
    found_files = 0

    with zipfile.ZipFile(zip_buffer, mode="w", compression=zipfile.ZIP_DEFLATED) as archive:
        for file_name in files_to_pack:
            file_path = UTILS_DIR / file_name
            if file_path.exists():
                archive.write(file_path, arcname=file_name)
                found_files += 1

    if found_files == 0:
        raise HTTPException(
            status_code=404,
            detail="Aucun fichier de configuration trouvé dans utils"
        )

    zip_buffer.seek(0)

    return StreamingResponse(
        zip_buffer,
        media_type="application/zip",
        headers={"Content-Disposition": "attachment; filename=config_files.zip"}
    )
