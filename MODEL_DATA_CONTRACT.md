# MODEL DATA CONTRACT
## Flash Flood Prediction & Early Warning System — Chamoli District

> **Document Version**: 1.0  
> **Last Updated**: 2026-09-15  
> **Purpose**: Documents the exact requirements for the two pre-trained ML models used in this system. DO NOT modify, retrain, or re-engineer these models.

---

## 1. BiLSTM Flood Prediction Model

### Model File
- **Path**: `_bilstm_extracted/BiLSTM model on flood prediction/best_chamoli_bilstm.keras`
- **Format**: Keras 3.13.2 (.keras zip archive)
- **Saved**: 2026-09-14 @ 20:22:22
- **Architecture Name**: `Chamoli_Improved_BiLSTM`

### Architecture
```
InputLayer          → (batch, 24, 30)      float32   "hourly_input"
Bidirectional LSTM  → (batch, 24, 128)     64 units, return_sequences=True
LayerNormalization  → (batch, 24, 128)
Dropout(0.25)       → (batch, 24, 128)
Bidirectional LSTM  → (batch, 24, 64)      32 units, return_sequences=True
LayerNormalization  → (batch, 24, 64)
MultiHeadAttention  → (batch, 24, 64)      4 heads, key_dim=16, dropout=0.15
Add (Residual)      → (batch, 24, 64)
LayerNormalization  → (batch, 24, 64)
GlobalAvgPool1D     → (batch, 64)
Dense(32, relu)     → (batch, 32)
Dropout(0.3)        → (batch, 32)
Dense(1, sigmoid)   → (batch, 1)           "flood_probability"
```

### Input Specification
- **Shape**: `(batch_size, 24, 30)` — 24 hourly timesteps × 30 features
- **Data Type**: `float32`
- **Preprocessing**: StandardScaler normalization (sklearn 1.6.1)
- **Sequence Length**: 24 hours (each row = 1 hour)

### 30 Input Features (Exact Order)
| Index | Feature Name | Unit | Description |
|-------|-------------|------|-------------|
| 0 | rain_mm | mm | Current hourly rainfall |
| 1 | water_level_m | m | Water level (gauge reading) |
| 2 | soil_moisture_mean | fraction | Mean soil moisture (0-1) |
| 3 | soil_moisture_surface_deep_diff | fraction | Surface minus deep soil moisture |
| 4 | slope_deg | degrees | Terrain slope |
| 5 | rainfall_3h_mm | mm | Cumulative rainfall (last 3h) |
| 6 | rainfall_6h_mm | mm | Cumulative rainfall (last 6h) |
| 7 | rainfall_12h_mm | mm | Cumulative rainfall (last 12h) |
| 8 | rainfall_24h_mm | mm | Cumulative rainfall (last 24h) |
| 9 | rainfall_48h_mm | mm | Cumulative rainfall (last 48h) |
| 10 | rainfall_72h_mm | mm | Cumulative rainfall (last 72h) |
| 11 | water_level_change_1h_m | m | Water level change (last 1h) |
| 12 | water_level_change_3h_m | m | Water level change (last 3h) |
| 13 | water_level_change_6h_m | m | Water level change (last 6h) |
| 14 | water_level_change_12h_m | m | Water level change (last 12h) |
| 15 | water_level_change_24h_m | m | Water level change (last 24h) |
| 16 | temperature_c | °C | Air temperature |
| 17 | humidity_pct | % | Relative humidity |
| 18 | wind_speed_10m_kmh | km/h | Wind speed at 10m |
| 19 | wind_direction_10m_deg | degrees | Wind direction at 10m |
| 20 | year | integer | Calendar year |
| 21 | month | integer | Calendar month (1-12) |
| 22 | day | integer | Day of month (1-31) |
| 23 | hour | integer | Hour of day (0-23) |
| 24 | day_of_year | integer | Day of year (1-366) |
| 25 | is_monsoon | binary | 1 if month in [6,7,8,9], else 0 |
| 26 | hour_sin | float | sin(2π × hour / 24) |
| 27 | hour_cos | float | cos(2π × hour / 24) |
| 28 | month_sin | float | sin(2π × month / 12) |
| 29 | month_cos | float | cos(2π × month / 12) |

### StandardScaler Parameters
- **Source**: Extracted from `chamoli_scaler.pkl` (sklearn 1.6.1)
- **Type**: `sklearn.preprocessing.StandardScaler`
- **Transform**: `X_scaled = (X - mean) / scale`
- **Stored in**: `ml-service/scaler_params.json`
- **Training Samples**: 234,018

### Missing Value Handling
- **Source**: `chamoli_train_medians.pkl` (pandas Series)
- **Method**: Fill NaN with training median values
- **Stored in**: `ml-service/scaler_params.json` (medians array)

### Output Specification
- **Shape**: `(batch_size, 1)` — scalar probability
- **Activation**: Sigmoid
- **Range**: [0.0, 1.0]
- **Interpretation**: Probability of flood occurrence in the next 6 hours
- **Target Variable**: `flood_next_6h` (binary: 0 = no flood, 1 = flood)

### Classification Threshold
- **Value**: `0.9969623684883118`
- **Source**: `chamoli_model_config.pkl`
- **Note**: Very high threshold indicates the model was optimized for precision (minimizing false positives in a highly imbalanced dataset)

### Compilation Configuration
- **Optimizer**: Adam (lr=0.0005, β1=0.9, β2=0.999)
- **Loss**: Custom function (referenced as `builtins.function.loss`)
- **Metrics**: BinaryAccuracy, Precision, Recall, ROC-AUC, PR-AUC

---

## 2. XGBoost Flood Prediction Model

### Model File
- **Path**: `optimized_xgboost_flood_model.onnx`
- **Format**: ONNX (IR Version 8, ai.onnx.ml opset v1)
- **Size**: 39,839 bytes
- **Operator**: `TreeEnsembleClassifier`

### Input Specification
- **Name**: `float_input`
- **Shape**: `(batch_size, 63)`
- **Data Type**: `tensor(float)` (float32)
- **No metadata stored**: Feature names are not embedded in the ONNX model

### 63 Input Features (Exact Order)
Derived from training dataset column order (all columns except `flood_next_6h` and `datetime`).
Categorical columns are label-encoded.

| Index | Feature Name | Type | Encoding |
|-------|-------------|------|----------|
| 0 | timestamp | LE | Label-encoded epoch/ordinal |
| 1 | district | LE | {'Chamoli': 0} |
| 2 | river | LE | {'Alaknanda': 0} |
| 3 | rain_mm | float | Direct value |
| 4 | water_level_m | float | Direct value |
| 5 | soil_moisture_mean | float | Direct value |
| 6 | slope_deg | float | Direct value |
| 7 | flood_label | int | Current flood state (0/1) |
| 8 | basin | LE | {'Ganga': 0} |
| 9 | division | LE | {'Himalayan Ganga Division, Haridwar': 0} |
| 10 | latitude | float | Direct value |
| 11 | longitude | float | Direct value |
| 12 | gauge_zero_elevation_m | float | Direct value |
| 13 | gauge_height_m | float | Direct value |
| 14 | data_source | LE | 2 classes |
| 15 | data_quality | LE | 2 classes |
| 16 | observation_status | LE | 2 classes |
| 17 | soil_moisture_0_7cm | float | Direct value |
| 18 | soil_moisture_7_28cm | float | Direct value |
| 19 | soil_moisture_28_100cm | float | Direct value |
| 20 | soil_moisture_100_255cm | float | Direct value |
| 21 | slope_grid_id | LE | Default 0 |
| 22 | slope_latitude | float | Direct value |
| 23 | slope_longitude | float | Direct value |
| 24 | slope_elevation_m | float | Direct value |
| 25 | slope_slope_deg | float | Direct value |
| 26 | slope_distance_to_river_m | float | Direct value |
| 27 | slope_distance_to_gauge_km | float | Direct value |
| 28 | landslide_record_count_year | int | Direct value |
| 29 | landslide_material_types_year | LE | Default 0 |
| 30 | landslide_movement_types_year | LE | Default 0 |
| 31 | soil_moisture_surface_deep_diff | float | Direct value |
| 32 | rainfall_3h_mm | float | Cumulative 3h rainfall |
| 33 | rainfall_6h_mm | float | Cumulative 6h rainfall |
| 34 | rainfall_12h_mm | float | Cumulative 12h rainfall |
| 35 | rainfall_24h_mm | float | Cumulative 24h rainfall |
| 36 | rainfall_48h_mm | float | Cumulative 48h rainfall |
| 37 | rainfall_72h_mm | float | Cumulative 72h rainfall |
| 38 | water_level_change_1h_m | float | 1h water level change |
| 39 | water_level_change_3h_m | float | 3h water level change |
| 40 | water_level_change_6h_m | float | 6h water level change |
| 41 | water_level_change_12h_m | float | 12h water level change |
| 42 | water_level_change_24h_m | float | 24h water level change |
| 43 | year | int | Calendar year |
| 44 | month | int | Calendar month |
| 45 | day | int | Day of month |
| 46 | hour | int | Hour of day |
| 47 | day_of_year | int | Day of year |
| 48 | is_monsoon | int | 1 if monsoon season |
| 49 | hour_sin | float | sin(2π × hour / 24) |
| 50 | hour_cos | float | cos(2π × hour / 24) |
| 51 | month_sin | float | sin(2π × month / 12) |
| 52 | month_cos | float | cos(2π × month / 12) |
| 53 | master_dataset_version | LE | Default 0 |
| 54 | slope_integration_method | LE | Default 0 |
| 55 | slope_grid_distance_km | float | Direct value |
| 56 | flood_start | int | Flood start indicator (0/1) |
| 57 | temperature_c | float | Air temperature |
| 58 | humidity_pct | float | Relative humidity |
| 59 | wind_speed_10m_kmh | float | Wind speed at 10m |
| 60 | wind_speed_100m_kmh | float | Wind speed at 100m |
| 61 | wind_direction_10m_deg | float | Wind direction at 10m |
| 62 | wind_direction_100m_deg | float | Wind direction at 100m |

### Output Specification
1. **`label`**: `tensor(int64)`, shape `(batch_size,)` — predicted class (0 = no flood, 1 = flood)
2. **`probabilities`**: `tensor(float)`, shape `(batch_size, 2)` — [P(no_flood), P(flood)]

---

## 3. Ensemble Configuration

### Method
Weighted average of flood probabilities from both models:

```
ensemble_score = (w_bilstm × P_bilstm_flood) + (w_xgboost × P_xgboost_flood)
```

### Default Weights
| Model | Weight | Rationale |
|-------|--------|-----------|
| BiLSTM | 0.6 | Temporal model with attention; captures sequential patterns |
| XGBoost | 0.4 | Tree-based model; captures non-linear feature interactions |

### Risk Classification Thresholds
| Risk Level | Score Range | Color |
|-----------|-------------|-------|
| LOW | 0.00 – 0.25 | Green (#22c55e) |
| MODERATE | 0.25 – 0.50 | Amber (#f59e0b) |
| HIGH | 0.50 – 0.75 | Red (#ef4444) |
| EXTREME | 0.75 – 1.00 | Dark Red (#dc2626) |

All weights and thresholds are configurable via environment variables.

---

## 4. GIS Data

### 500m Grid
- **File**: `chamoli_500m_grid.gpkg`
- **Records**: 31,336 cells
- **CRS**: EPSG:4326
- **Geometry**: Point (centroids)
- **Columns**: grid_id, latitude, longitude, distance_to_river_m

### Static ML Dataset
- **File**: `chamoli_static_ml_dataset.csv`
- **Records**: 31,336 rows (1:1 match with grid)
- **Columns**: grid_id, latitude, longitude, elevation_m, slope_deg, distance_to_river_m

### District Boundary
- **Source**: `Chamoli_district_boundary shapefile.zip`
- **Records**: 1,237 polygons
- **CRS**: LCC_WGS84 (exported to GeoJSON as EPSG:4326)

### Rivers
- **File**: `waterway_river_chamoli.gpkg`
- **Records**: 125 LineString features
- **CRS**: EPSG:4326
- **Source**: OpenStreetMap

### Streams
- **File**: `waterway_stream_chamoli.gpkg`
- **Records**: 807 LineString features
- **CRS**: EPSG:4326

### Historical Flood Events
- **File**: `chamoli_flood_events_2000_2026.csv`
- **Records**: 24 events (2005–2025)
- **Columns**: 37 fields including event_id, date, location, severity, deaths, affected_population

---

## 5. Important Notes

1. **DO NOT RETRAIN** either model under any circumstances.
2. **DO NOT MODIFY** the model weights, architecture, or preprocessing pipeline.
3. The BiLSTM threshold (0.997) is extremely high — this was intentionally tuned for precision.
4. The XGBoost model was trained with label-encoded categoricals — the same encoding must be reproduced exactly.
5. The StandardScaler parameters were extracted from the actual `chamoli_scaler.pkl` artifact.
6. For live inference, many XGBoost features (e.g., `flood_label`, `flood_start`, `gauge_zero_elevation_m`) will use default/context values since they represent training dataset metadata rather than real-time measurements.
7. Both models predict `flood_next_6h` — the probability of a flood occurring in the next 6 hours.
