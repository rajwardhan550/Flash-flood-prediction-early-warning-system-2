import json
import os
import numpy as np

ARTIFACTS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../artifacts"))
SCALER_PATH = os.path.join(ARTIFACTS_DIR, "scaler_params.json")

# Authoritative feature contract derived from the trained Chamoli model artifacts
EXPECTED_INFERENCE_FEATURES = [
    "rain_mm", "water_level_m", "soil_moisture_mean", "slope_deg", "latitude", "longitude",
    "gauge_zero_elevation_m", "gauge_height_m", "soil_moisture_0_7cm", "soil_moisture_7_28cm",
    "soil_moisture_28_100cm", "soil_moisture_100_255cm", "slope_latitude", "slope_longitude",
    "slope_elevation_m", "slope_slope_deg", "slope_distance_to_river_m", "slope_distance_to_gauge_km",
    "landslide_record_count_year", "soil_moisture_surface_deep_diff", "rainfall_3h_mm",
    "rainfall_6h_mm", "rainfall_12h_mm", "rainfall_24h_mm", "rainfall_48h_mm", "rainfall_72h_mm",
    "water_level_change_1h_m", "water_level_change_3h_m", "water_level_change_6h_m",
    "water_level_change_12h_m", "water_level_change_24h_m", "year", "month", "day", "hour",
    "day_of_year", "is_monsoon", "hour_sin", "hour_cos", "month_sin", "month_cos",
    "slope_grid_distance_km", "temperature_c", "humidity_pct", "wind_speed_10m_kmh",
    "wind_speed_100m_kmh", "wind_direction_10m_deg", "wind_direction_100m_deg",
    "data_source_Open-Meteo rainfall-runoff calibrated model (Nash-SCS/Alaknanda)",
    "data_quality_hydrologically_simulated", "observation_status_supplied_graph_observation",
    "landslide_material_types_year_Debris|Rock|Rock cum Debris|Rock cum debris|Slope wash material|River borne and Slope wash material|rock cum debris",
    "landslide_material_types_year_Debris|Rock|Soil & Debis",
    "landslide_material_types_year_Rock cum debris|Rock",
    "landslide_material_types_year_Rock cum debris|Rock|Debris",
    "landslide_material_types_year_Rock cum debris|Rock|Debris|Soil",
    "landslide_material_types_year_Rock|Debris|Debris Flow",
    "landslide_material_types_year_Rock|Debris|Soil|Debris/Bank Erosion",
    "landslide_material_types_year_Rock|Debris|Soil|Rock cum debris",
    "landslide_material_types_year_Slope wash material",
    "landslide_material_types_year_Soil|Debris|Rock",
    "landslide_movement_types_year_Fall|Flow|Slide",
    "landslide_movement_types_year_Slide"
]

class FeaturePipeline:
    def __init__(self):
        self.scaler_params = self._load_scaler()

    def _load_scaler(self):
        if os.path.exists(SCALER_PATH):
            with open(SCALER_PATH, "r") as f:
                return json.load(f)
        return None

    def transform(self, raw_features: dict) -> np.ndarray:
        """
        Converts the incoming raw dictionary into a strictly ordered (1, 63) float32 array.
        Applies min-max / standard scaling parameters if scaler_params.json is loaded.
        """
        vector = []
        for key in EXPECTED_INFERENCE_FEATURES:
            val = raw_features.get(key, 0.0)
            vector.append(float(val))

        arr = np.array(vector, dtype=np.float32).reshape(1, -1)

        # Apply scaling if parameters exist
        if self.scaler_params:
            means = np.array(self.scaler_params.get("mean", []), dtype=np.float32)
            scales = np.array(self.scaler_params.get("scale", []), dtype=np.float32)
            if len(means) == arr.shape[1] and len(scales) == arr.shape[1]:
                # Standard scaler: (x - mean) / scale
                scales[scales == 0.0] = 1.0  # Prevent divide-by-zero
                arr = (arr - means) / scales

        return arr

pipeline = FeaturePipeline()