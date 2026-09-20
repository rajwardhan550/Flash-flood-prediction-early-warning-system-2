import os
import json
import numpy as np
import onnxruntime as ort
import tensorflow as tf

ARTIFACTS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "artifacts"))
XGB_ONNX_PATH = os.path.join(ARTIFACTS_DIR, "optimized_xgboost_flood_model.onnx")
BILSTM_KERAS_PATH = os.path.join(ARTIFACTS_DIR, "best_chamoli_bilstm.keras")
SCALER_PARAMS_PATH = os.path.join(ARTIFACTS_DIR, "scaler_params.json")

class InferenceEngine:
    def __init__(self):
        self.xgb_session = None
        self.bilstm_model = None
        self.scaler_params = {}
        self.load_models()
        self.load_scaler()

    def load_models(self):
        if os.path.exists(XGB_ONNX_PATH):
            self.xgb_session = ort.InferenceSession(XGB_ONNX_PATH)
            print(f"[ML ENGINE] XGBoost ONNX model loaded successfully from {XGB_ONNX_PATH}")

        if os.path.exists(BILSTM_KERAS_PATH):
            self.bilstm_model = tf.keras.models.load_model(BILSTM_KERAS_PATH, compile=False)
            print(f"[ML ENGINE] Bi-LSTM Keras model loaded successfully from {BILSTM_KERAS_PATH}")

    def load_scaler(self):
        if os.path.exists(SCALER_PARAMS_PATH):
            with open(SCALER_PARAMS_PATH, 'r') as f:
                self.scaler_params = json.load(f)
                print(f"[ML ENGINE] Scaler params loaded successfully")

    def predict_flood_risk(self, features: dict) -> dict:
        # Default fallback values for expected training columns
        rainfall = float(features.get("rainfall_mm", features.get("rainfall", 10.0)))
        water_level = float(features.get("water_level_m", features.get("water_level", 2.0)))
        soil_moisture = float(features.get("soil_moisture_pct", features.get("soil_moisture", 50.0)))
        temp = float(features.get("temperature_c", features.get("temperature", 20.0)))
        humidity = float(features.get("humidity_pct", features.get("humidity", 60.0)))
        rate_of_rise = float(features.get("water_level_rate_of_rise_m_h", 0.05))
        
        # 1. XGBoost Inference (Flat 2D Array)
        xgb_prob = 0.5
        if self.xgb_session:
            input_name = self.xgb_session.get_inputs()[0].name
            input_shape = self.xgb_session.get_inputs()[0].shape
            n_features = input_shape[1] if len(input_shape) > 1 and isinstance(input_shape[1], int) else 10
            
            # Construct feature vector matching expected dimension
            base_vec = [rainfall, water_level, soil_moisture, temp, humidity, rate_of_rise]
            while len(base_vec) < n_features:
                base_vec.append(0.0)
            base_vec = base_vec[:n_features]
            
            raw_input = np.array([base_vec], dtype=np.float32)
            outputs = self.xgb_session.run(None, {input_name: raw_input})
            xgb_prob = float(outputs[1][0][1]) if len(outputs) > 1 else float(outputs[0][0])

        # 2. Bi-LSTM Inference (3D Array: Batch, Timesteps, Features)
        bilstm_prob = 0.5
        if self.bilstm_model:
            input_shape = self.bilstm_model.input_shape
            timesteps = input_shape[1] if input_shape[1] is not None else 6
            n_features = input_shape[2] if len(input_shape) > 2 and input_shape[2] is not None else 6
            
            step_vec = [rainfall, water_level, soil_moisture, temp, humidity, rate_of_rise]
            while len(step_vec) < n_features:
                step_vec.append(0.0)
            step_vec = step_vec[:n_features]
            
            bilstm_input = np.array([[step_vec] * timesteps], dtype=np.float32)
            pred = self.bilstm_model.predict(bilstm_input, verbose=0)
            bilstm_prob = float(pred[0][0])

        # 3. Weighted Ensemble Calculation (60% Bi-LSTM temporal, 40% XGBoost tabular)
        ensemble_prob = float((0.6 * bilstm_prob) + (0.4 * xgb_prob))
        
        return {
            "ensembleProbability": round(ensemble_prob, 4),
            "biLstmProbability": round(bilstm_prob, 4),
            "xgboostProbability": round(xgb_prob, 4)
        }