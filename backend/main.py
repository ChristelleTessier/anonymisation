from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from api.scan_patterns import router as scan_patterns_router
from api.scan_settings import router as scan_settings_router
from api.scan_custom_entities import router as scan_custom_entities_router

from api.export_configs import router as export_configs_router
from api.config_specs import router as config_specs_router

from pydantic import BaseModel # Pour structurer la demande de React
from scripts.AdvancedAnalyzer import AdvancedAnalyzer # On importe le moteur


app = FastAPI(title="Anonymisation API")

# Configuration CORS pour React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnonymizeRequest(BaseModel):
    folder_path: str

# --- Route pour lancer l'analyse ---
@app.post("/api/anonymize")
async def start_anonymization(request: AnonymizeRequest):
    try:
        # 1. On récupère le chemin envoyé par le bouton React
        path_to_scan = request.folder_path
        
        # 2. On instancie le moteur avec ce chemin [1]
        # Cela remplace l'ancien fonctionnement via sys.argv[1] [1]
        analyzer = AdvancedAnalyzer(path_to_scan)
        
        # 3. On lance l'analyse. 
        # Le moteur va travailler et générer le plan_anonymisation/changes_plan.json [1]
        analyzer.run()
        
        return {"status": "success", "message": "Analyse terminée avec succès."}
    
    except Exception as e:
        # Si le dossier n'existe pas ou si l'analyse échoue
        raise HTTPException(status_code=500, detail=str(e))

# Enregistrement des routes
app.include_router(scan_settings_router)
app.include_router(scan_custom_entities_router)
app.include_router(scan_patterns_router)

app.include_router(export_configs_router)
app.include_router(config_specs_router)