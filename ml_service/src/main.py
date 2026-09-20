import traceback
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse

from src.inference_engine import InferenceEngine

app = FastAPI(title="FloodAtlas ML Inference Service", version="2.0.0")
engine = InferenceEngine()

@app.get("/")
def read_root():
    return {"status": "healthy", "service": "FloodAtlas Chamoli ML Engine"}

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "models_loaded": {
            "xgboost": engine.xgb_session is not None,
            "bilstm": engine.bilstm_model is not None
        }
    }

@app.post("/predict")
async def predict(request: Request):
    try:
        payload = await request.json()
        features = payload.get("features", payload)
        
        result = engine.predict_flood_risk(features)
        
        # Backend expects direct keys without wrapping inside 'data'
        return {
            "ensembleProbability": result["ensembleProbability"],
            "bilstmProbability": result["biLstmProbability"],
            "biLstmProbability": result["biLstmProbability"],
            "xgboostProbability": result["xgboostProbability"]
        }
        
    except Exception as e:
        traceback.print_exc()
        return JSONResponse(
            status_code=500,
            content={"error": str(e), "trace": traceback.format_exc()}
        )