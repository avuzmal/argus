from fastapi import APIRouter
from .endpoints import ingest

api_router = APIRouter()
api_router.include_router(ingest.router, prefix="/ingest", tags=["Ingestion"])
