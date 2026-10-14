from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from api.scan_patterns import router as scan_patterns_router
from api.scan_settings import router as scan_settings_router
from api.scan_custom_entities import router as scan_custom_entities_router

from api.export_configs import router as export_configs_router
from api.config_specs import router as config_specs_router

from api.anonymize import router as anonymize_router
from api.validation import router as validation_router
from api.export_plan import router as chargement_router


app = FastAPI(title="Anonymisation API")

# Configuration CORS pour React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Enregistrement des routes
app.include_router(scan_settings_router)
app.include_router(scan_custom_entities_router)
app.include_router(scan_patterns_router)

app.include_router(export_configs_router)
app.include_router(config_specs_router)

app.include_router(anonymize_router)
app.include_router(validation_router)
app.include_router(chargement_router)