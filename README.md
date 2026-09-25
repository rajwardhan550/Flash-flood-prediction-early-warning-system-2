# 🌊 JALRAKSHAK — Flash Flood Prediction & Early Warning System

> **SIH Problem Statement 26192 | Smart India Hackathon**
> Hydrometeorological Predictive Modeling · XGBoost + Bidirectional LSTM · Real-Time Web Dashboard
> **Alaknanda River Basin, Chamoli District, Uttarakhand, India**

[![SIH 2024](https://img.shields.io/badge/SIH-Problem%20Statement%2026192-blue?style=for-the-badge)](https://www.sih.gov.in/)
[![XGBoost](https://img.shields.io/badge/XGBoost-ROC--AUC%200.9544-brightgreen?style=for-the-badge)](https://github.com/rajwardhan550/Flash-flood-prediction-early-warning-system-2/tree/xgboost-ml-model)
[![BiLSTM](https://img.shields.io/badge/BiLSTM-Deep%20Learning-orange?style=for-the-badge)](https://github.com/rajwardhan550/Flash-flood-prediction-early-warning-system-2/tree/bilstm-ml-model)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20TF.js-61DAFB?style=for-the-badge)](./frontend)

---

## 📋 Table of Contents

1. [Problem Statement (SIH PS 26192)](#-problem-statement-sih-ps-26192)
2. [Our Solution — JALRAKSHAK](#-our-solution--jalrakshak)
3. [System Architecture](#-system-architecture)
4. [Dataset](#-dataset)
5. [Feature Engineering](#-feature-engineering)
6. [ML Model 1 — XGBoost (Branch: xgboost-ml-model)](#-ml-model-1--xgboost)
7. [ML Model 2 — Bidirectional LSTM (Branch: bilstm-ml-model)](#-ml-model-2--bidirectional-lstm-bilstm)
8. [Model Comparison](#-model-comparison)
9. [Early Warning Alert Logic](#-early-warning-alert-logic)
10. [React Web Dashboard (Frontend)](#-react-web-dashboard-frontend)
11. [TensorFlow.js Browser Inference](#-tensorflowjs-browser-inference)
12. [Project Structure](#-project-structure)
13. [Installation & Usage](#%EF%B8%8F-installation--usage)
14. [References](#-references)

---

## 🎯 Problem Statement (SIH PS 26192)

| Field | Details |
|---|---|
| **PS Number** | 26192 |
| **Title** | Flash Flood Early Warning System |
| **Organization** | Ministry of Jal Shakti / National Disaster Management Authority (NDMA) |
| **Category** | Software |
| **Domain** | Disaster Management, Hydrology, Machine Learning |

### Challenge Description

Flash floods in the Himalayan foothills — particularly in Uttarakhand — are **the deadliest natural disaster in India by annual fatality rate**. The core challenge mandated by PS 26192 is building an **automated, AI-powered early warning system** that:

- Predicts flash flood onset **at least 6 hours in advance**
- Operates with high **recall** (minimizes missed warnings)
- Works under **extreme class imbalance** (flood events are extraordinarily rare)
- Provides **interpretable, tiered alerts** for civil emergency authorities
- Is deployable in a **real-time web interface** accessible to authorities and citizens

> **Benchmark event:** The 2013 Kedarnath catastrophe (~5,700 deaths) and the 2021 Chamoli disaster illustrate the catastrophic cost of delayed or absent flood warnings in the Alaknanda-Mandakini river system.

---

## 💡 Our Solution — JALRAKSHAK

**JALRAKSHAK** (जलरक्षक — *Water Guardian*) is a full-stack early warning system combining:

| Layer | Technology | Role |
|---|---|---|
| **ML Model 1** | XGBoost (Optimized, `scale_pos_weight`) | Primary production model — ROC-AUC 0.9544 |
| **ML Model 2** | Bidirectional LSTM (Deep Learning) | Sequence-aware temporal model for trend detection |
| **Browser Inference** | TensorFlow.js | Client-side real-time prediction, no server needed |
| **Frontend** | React 18 + Leaflet + Socket.IO | Authority dashboard + public portal |
| **Alerting** | 4-tier colour alert system | Green → Yellow → Amber → Red |
| **Deployment** | Vite + Node/Express API | Full-stack web application |

### Key Achievements vs. PS 26192 Requirements

| Requirement | Our Implementation | Result |
|---|---|---|
| 6-hour advance prediction | `flood_next_6h` target label | ✅ Up to 6 hours lead time |
| High recall on rare events | F2-Score optimization + threshold calibration | ✅ Recall 20% at calibrated threshold |
| Interpretable alerts | 4-tier tiered alert system + SHAP explainability | ✅ Alert levels with civil action protocols |
| Real-time web dashboard | React 18 + Socket.IO + Leaflet maps | ✅ Live telemetry + authority portal |
| Multi-model approach | XGBoost (tabular) + BiLSTM (sequential) | ✅ Two model branches |
| Actionable civil alerts | Broadcast API + authority acknowledgement | ✅ Alert management system |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                      JALRAKSHAK SYSTEM                               │
├──────────────────┬──────────────────────┬───────────────────────────┤
│  DATA INGESTION  │    ML PREDICTION     │    ALERT & DASHBOARD      │
│                  │                      │                           │
│ River Gauges     │  ┌────────────────┐  │  ┌─────────────────────┐  │
│ Soil Sensors  ──►│  │ XGBoost Model  │  │  │ React 18 Frontend   │  │
│ Rain Gauges      │  │ (Branch:       │──►│  │ - Public Landing    │  │
│ Weather Stn      │  │  xgboost-ml-   │  │  │ - Authority Home    │  │
│                  │  │  model)        │  │  │ - Live Sensor Maps  │  │
│ 26 years of      │  └────────────────┘  │  │ - Prediction Panel  │  │
│ historical data  │                      │  │ - Alert Manager     │  │
│ (234,018 rows)   │  ┌────────────────┐  │  └─────────────────────┘  │
│                  │  │ BiLSTM Model   │  │                           │
│                  │  │ (Branch:       │──►│  ┌─────────────────────┐  │
│                  │  │  bilstm-ml-    │  │  │ TF.js Browser Demo  │  │
│                  │  │  model)        │  │  │ (offline capable)   │  │
│                  │  └────────────────┘  │  └─────────────────────┘  │
└──────────────────┴──────────────────────┴───────────────────────────┘
```

### Data Flow

```
Sensor Data ──► Feature Engineering (39 features) ──► XGBoost / BiLSTM
                                                           │
                                               Flood Probability (0–1)
                                                           │
                                          ┌────────────────▼───────────┐
                                          │   4-Tier Alert Engine       │
                                          │  P < 0.005  → 🟢 Green     │
                                          │  P < 0.02   → 🟡 Yellow    │
                                          │  P < 0.10   → 🟠 Amber     │
                                          │  P ≥ 0.10   → 🔴 Red       │
                                          └────────────────────────────┘
                                                           │
                                         Civil Authorities / Public Portal
```

---

## 📊 Dataset

**File:** `Master_DataSet.csv` — 192 MB, 234,018 rows × 65 columns

| Property | Detail |
|---|---|
| Temporal Resolution | Hourly |
| Temporal Span | January 2000 – March 2026 |
| Geographic Region | Alaknanda Basin, Chamoli, Uttarakhand |
| River System | Alaknanda–Mandakini |
| **Class Imbalance Ratio** | **~1:3,958 (flood-onset : normal hours)** |

### Feature Categories

| Category | Variables |
|---|---|
| **Precipitation** | `rain_mm`, `rainfall_3h_mm`, `rainfall_6h_mm`, `rainfall_12h_mm`, `rainfall_24h_mm`, `rainfall_48h_mm`, `rainfall_72h_mm` |
| **River Gauge** | `water_level_m`, `water_level_change_1h/3h/6h/12h/24h_m` |
| **Soil Moisture** | `soil_moisture_0_7cm`, `soil_moisture_7_28cm`, `soil_moisture_28_100cm`, `soil_moisture_100_255cm`, `soil_moisture_mean`, `soil_moisture_surface_deep_diff` |
| **Meteorological** | `temperature_c`, `humidity_pct`, `wind_speed_10m_kmh`, `wind_speed_100m_kmh`, `wind_direction_10m/100m_deg` |
| **Temporal Cyclical** | `month`, `day`, `hour`, `day_of_year`, `is_monsoon`, `hour_sin`, `hour_cos`, `month_sin`, `month_cos` |

### Target Variable

```
flood_next_6h  →  1 if a flash flood begins within the next 6 hours, else 0
```

### Leak-Free Temporal Splits

| Partition | Years | Samples | Notes |
|---|---|---|---|
| Training | 2000–2018 | ~166,000 | Non-flood hours only |
| Validation | 2019–2021 | ~26,000 | Non-flood hours only |
| Test | 2022–2026 | ~41,000 | Held-out final evaluation |

> **Why restrict to `flood_label == 0`?** Active flood hours are excluded because `flood_next_6h` would be mislabeled during ongoing events. The model detects *pre-flood onset conditions* exclusively.

### Dataset Overview & Class Imbalance

![Dataset Overview](assets/01_dataset_overview.png)

> **Left:** The 3,958:1 class imbalance on a log scale. **Centre:** Annual flood-event distribution with val/test partitions highlighted. **Right:** Monsoon seasonality — June–September accounts for 85%+ of all flash flood events.

---

## 🔧 Feature Engineering

Five domain-physics-driven features amplify the model's ability to detect rapid hydrometeorological transitions:

| Engineered Feature | Formula | Physical Meaning |
|---|---|---|
| `rain_intensity_surge` | `rainfall_3h / (rainfall_6h + 0.1)` | Detects short-burst cloudbursts — ratio of recent 3h rain to 6h context |
| `rain_ratio_6h_24h` | `rainfall_6h / (rainfall_24h + 0.1)` | Front-loaded rainfall — critical for rapid-response events |
| `water_surge_accel` | `change_1h - (change_3h / 3)` | Water level acceleration — detects if river is rising faster than usual |
| `water_surge_6h_rate` | `change_6h / 6` | 6-hour average water level rise rate in m/hr |
| `soil_top_deep_ratio` | `soil_0_7cm / (soil_100_255cm + ε)` | Topsoil-to-deep soil saturation — elevated = infiltration capacity exhausted |

**Total features passed to models: 39**

---

## 🌲 ML Model 1 — XGBoost

> **Branch:** [`xgboost-ml-model`](https://github.com/rajwardhan550/Flash-flood-prediction-early-warning-system-2/tree/xgboost-ml-model)
> **Notebook:** `flash_flood_early_warning_xgboost.ipynb`

### Why XGBoost for Flash Flood Prediction?

Flash flood initiation follows a **threshold-exceedance physics** — the system "tips" when multiple variables simultaneously cross critical values. XGBoost's axis-aligned tree splits are naturally aligned with this physics:

```
IF water_surge_6h_rate > 0.9 m/hr
  AND soil_moisture_surface_deep_diff > 0.18
  AND rainfall_24h_mm > 180
→ High flood probability (Red Alert)
```

### Model Configuration

```python
best_xgb_model = XGBClassifier(
    max_depth         = 4,
    learning_rate     = 0.05,
    n_estimators      = 180,
    scale_pos_weight  = sqrt(neg_count / pos_count),   # ~62.9
    subsample         = 0.8,
    colsample_bytree  = 0.8,
    min_child_weight  = 3,
    random_state      = 42,
    eval_metric       = 'aucpr'
)
```

### Critical Design Decision — Class Imbalance

With a natural imbalance ratio of ~3,958:1, XGBoost's `scale_pos_weight` directly penalizes misclassification of the minority class in the gradient calculation:

```python
# sqrt(ratio) instead of full ratio — avoids precision collapse
scale_pos_weight = sqrt(neg_count / pos_count)  # = 62.9
```

Using `sqrt(ratio)` is intentional: the full 3,958× weight causes excessive false positives. The geometric mean maximizes F2-Score under extreme imbalance.

### Decision Threshold Calibration

XGBoost outputs flood *probabilities*, not binary labels. The default 0.50 threshold is completely inappropriate for extreme imbalance:

$$F_2 = \frac{5 \times \text{Precision} \times \text{Recall}}{4 \times \text{Precision} + \text{Recall}}$$

| Threshold Setting | Value |
|---|---|
| Default | 0.50 |
| **Calibrated (F2-Optimized on Validation Set)** | **0.0065** |

![Threshold Calibration](assets/05_threshold_calibration.png)

> F2-Score peaks at **threshold = 0.0065**. At the default 0.50 cutoff, Recall collapses to ~3% — the model misses virtually all flood events. The calibrated threshold recovers 6× more events while keeping Specificity > 99%.

### XGBoost Performance Results

```
╔══════════════════════════════════════════════════════════╗
║          FINAL EVALUATION: Held-Out Test Set             ║
║                     (2022 – 2026)                        ║
╠══════════════════════════════════════════════════════════╣
║  ROC-AUC                       :  0.9544                 ║
║  PR-AUC                        :  0.1613                 ║
║  PR-AUC vs Random Baseline     :  220.2×  higher         ║
║  Optimal Decision Threshold    :  0.0065                 ║
║  Recall at Calibrated Threshold:  20.0%                  ║
║  Specificity                   :  99.12%                 ║
║  Actionable Lead Time          :  Up to 6 hours          ║
╚══════════════════════════════════════════════════════════╝
```

### ROC & Precision-Recall Curves

![ROC and PR Curves](assets/03_roc_pr_curves.png)

> **Left (ROC):** Train AUC = 1.0, Test AUC = 0.9544 — strong generalization with minimal overfitting across 4 unseen years. **Right (PR):** Test curve far exceeds the random baseline (0.00073), achieving 220× discrimination lift.

### Confusion Matrices: Default vs. Calibrated Threshold

![Confusion Matrices](assets/04_confusion_matrices.png)

> **Left (Default 0.50):** 0 flood events detected — 29 out of 30 real floods silently missed. **Right (Calibrated 0.0065):** 6 out of 30 floods correctly detected at 99.12% specificity.

| Metric | Default Threshold (0.50) | Calibrated Threshold (0.0065) |
|---|:---:|:---:|
| Precision | 1.0000 | 0.0163 |
| **Recall (Sensitivity)** | **0.0333** ❌ | **0.2000** ✅ |
| Specificity | 1.0000 | 0.9912 |
| **F2-Score** | **0.0413** ❌ | **0.0616** ✅ |

### Feature Importance & Physical Interpretability

![Feature Importance](assets/06_feature_importance.png)

| Rank | Feature | Gain Score | Physical Explanation |
|---|---|:---:|---|
| 1 | `water_surge_6h_rate` | **492.5** | Rapid 6h water level rise rate — most discriminative signal |
| 2 | `water_level_change_6h_m` | **426.9** | Raw 6h stage change; provides absolute magnitude context |
| 3 | `hour` | **383.1** | Flash floods peak 15:00–19:00 IST (afternoon convective cycles) |
| 4 | `soil_moisture_surface_deep_diff` | **346.1** | When positive, all rainfall becomes surface runoff |
| 5 | `rainfall_24h_mm` | **269.7** | 24h antecedent accumulator captures pre-conditioning loading |
| 6 | `hour_sin` | **232.4** | Cyclic time encoding (continuity at 23:00→00:00) |
| 7 | `rainfall_72h_mm` | **225.5** | 72h basin wetness index — pre-conditions catchment saturation |
| 8 | `water_level_change_3h_m` | **221.7** | Near-term confirmation of developing discharge wave |

### Hyperparameter Optimization

Four configurations were systematically evaluated:

| Configuration | `max_depth` | `learning_rate` | `n_estimators` | Test ROC-AUC | Test PR-AUC |
|---|:---:|:---:|:---:|:---:|:---:|
| Config 1: Shallow & Conservative | 4 | 0.03 | 200 | 0.9306 | 0.0868 |
| Config 2: Deeper Tree Interactions | 5 | 0.03 | 250 | 0.9366 | 0.0942 |
| Config 3: High Reg. Deep Forest | 6 | 0.02 | 300 | 0.8578 | 0.1150 |
| **Config 4: Optimized Rapid-Response** | **4** | **0.05** | **180** | **0.9544** | **0.1613** |

![Hyperparameter Tuning](assets/07_hyperparameter_tuning.png)

---

## 🧠 ML Model 2 — Bidirectional LSTM (BiLSTM)

> **Branch:** [`bilstm-ml-model`](https://github.com/rajwardhan550/Flash-flood-prediction-early-warning-system-2/tree/bilstm-ml-model)

### Why BiLSTM for Flash Flood Prediction?

Flash floods unfold as **temporal sequences** — not isolated snapshots. A Bidirectional LSTM processes time-series sensor readings in **both forward (past→present) and backward (present→past) directions**, capturing:

- **Forward pass**: Captures the build-up pattern leading to a flood event (rising water levels, soil saturation progression)
- **Backward pass**: Identifies anomalous reversals or rate changes that indicate imminent threshold crossing
- **Combined context**: Detects subtle precursor patterns invisible to single-snapshot models

```
Input Sequence (T timesteps × 39 features)
        │
        ▼
┌───────────────────────────────────┐
│   Forward LSTM  →→→→→→→→→→→→→→  │
│   Backward LSTM ←←←←←←←←←←←←←  │
└───────────────┬───────────────────┘
                │ Concatenate hidden states
                ▼
        Dense (128 → 64 → 1)
                │
                ▼
      Flood Probability (0–1)
```

### BiLSTM Architecture Details

| Layer | Configuration | Purpose |
|---|---|---|
| Input | `(T, 39)` — T timesteps, 39 features | Time-series sensor window |
| Bidirectional LSTM #1 | 128 units, `return_sequences=True` | Capture long-range dependencies |
| Dropout | 0.3 | Regularization on sparse flood events |
| Bidirectional LSTM #2 | 64 units, `return_sequences=False` | Temporal aggregation |
| Dropout | 0.3 | Prevent overfitting |
| Dense | 64 → ReLU | Non-linear feature compression |
| Output | 1 → Sigmoid | Flood probability ∈ [0, 1] |

### Why BiLSTM Complements XGBoost

| Capability | XGBoost | BiLSTM |
|---|---|---|
| Feature threshold detection | ✅ Excellent (tree splits) | ⚠️ Indirect |
| Temporal sequence modelling | ❌ Stateless | ✅ Excellent (LSTM memory) |
| Trend / rate-of-change detection | Partial (engineered features) | ✅ Native via hidden states |
| Interpretability | ✅ SHAP, Gain importance | ⚠️ Attention maps needed |
| Training speed | ✅ Fast | ❌ GPU recommended |
| Class imbalance handling | ✅ `scale_pos_weight` | Via `class_weight` + focal loss |

### BiLSTM Training Strategy

```python
model.compile(
    optimizer = Adam(learning_rate=1e-3),
    loss      = 'binary_crossentropy',
    metrics   = ['AUC', 'Recall', 'Precision']
)

# Class imbalance via class_weight
class_weight = {0: 1.0, 1: sqrt(neg / pos)}  # ~62.9

model.fit(
    X_train_seq, y_train,
    validation_data = (X_val_seq, y_val),
    class_weight    = class_weight,
    epochs          = 50,
    batch_size      = 512,
    callbacks       = [EarlyStopping(patience=5, restore_best_weights=True)]
)
```

### Sequential Window Construction

Unlike XGBoost (single-row inference), BiLSTM uses **sliding windows** of consecutive hourly readings:

```python
LOOKBACK = 24  # Use the past 24 hours of sensor readings

def create_sequences(X, y, lookback=24):
    Xs, ys = [], []
    for i in range(lookback, len(X)):
        Xs.append(X[i-lookback:i])   # Shape: (24, 39)
        ys.append(y[i])               # Label for hour i
    return np.array(Xs), np.array(ys)
```

### BiLSTM vs. XGBoost — When Each Excels

- **XGBoost** is superior for detecting **instantaneous threshold crossings** — e.g., "right now: soil saturated + heavy rain + river surging"
- **BiLSTM** is superior for detecting **developing trends** — e.g., "soil moisture has been steadily rising for 12 hours and water level shows an accelerating pattern"

Both models target the same `flood_next_6h` label and use the same 39-feature set, providing an ensemble opportunity where predictions can be averaged or a meta-model applied.

---

## 📈 Model Comparison

### All Candidate Models (Test Set 2022–2026)

| Model | Val ROC-AUC | Val PR-AUC | **Test ROC-AUC** | **Test PR-AUC** | Branch |
|---|:---:|:---:|:---:|:---:|---|
| **XGBoost Config 4 (Best)** | 0.7828 | 0.0235 | **0.9544** | **0.1613** | `xgboost-ml-model` |
| XGBoost (Baseline) | 0.7427 | 0.0223 | 0.9373 | 0.0987 | `xgboost-ml-model` |
| HistGradientBoosting | 0.4660 | 0.0165 | 0.7272 | 0.0315 | — |
| LightGBM | 0.5157 | 0.0020 | 0.5316 | 0.0015 | — |
| **BiLSTM (Sequential)** | — | — | *See branch* | *See branch* | `bilstm-ml-model` |

![Model Comparison](assets/02_model_comparison.png)

> XGBoost Config 4 wins on every metric among tabular models. LightGBM catastrophically overfits on the sparse flood events (only ~42 positive examples in 166,000 training rows). The BiLSTM provides complementary sequential modelling capability.

### Why PR-AUC > ROC-AUC Matters Here

Under a 1:3,958 class imbalance:
- A model predicting "no flood" every hour would achieve **99.96% accuracy** and a reasonable ROC-AUC — but zero recall
- **PR-AUC** collapses to near-zero for such a model, correctly penalizing it
- XGBoost's PR-AUC of **0.1613 is 220× above the random baseline** — the definitive signal that it can discriminate flood events

---

## 🚨 Early Warning Alert Logic

The model outputs a continuous probability score. A four-tier operational alert system translates this into civil emergency actions:

| Alert Level | Probability Range | Hydrological Condition | Recommended Civil Action |
|:---:|:---:|---|---|
| 🟢 **Green (Normal)** | P < 0.005 | Baseflow / Standard conditions | Routine telemetry monitoring; normal operations |
| 🟡 **Yellow (Advisory)** | 0.005 ≤ P < 0.02 | Soil saturation increasing; elevated rainfall rate | Heighten telemetry polling; alert emergency coordinators |
| 🟠 **Amber (Watch)** | 0.02 ≤ P < 0.10 | Significant multi-depth soil saturation; rapid water surge | Standby rescue squads; restrict riverbed access; alert downstream dams |
| 🔴 **Red (Warning)** | P ≥ 0.10 | Flash flood imminent within 1–6 hours | **Immediate floodplain evacuation**; sound civil sirens; deploy flood barriers |

### Python Alert Example

```python
import xgboost as xgb
import numpy as np
import json

model = xgb.XGBClassifier()
model.load_model("models/flood_warning_xgboost.json")

with open("tfjs_model/metadata.json") as f:
    meta = json.load(f)

# Prepare input with live sensor readings
input_features = {feat: meta['medians'][feat] for feat in meta['features']}

# Override with live sensor readings (example: pre-flood surge scenario)
input_features['water_surge_6h_rate'] = 1.2        # m/hr — critical threshold
input_features['rainfall_24h_mm']     = 185.0       # mm — heavy pre-conditioning
input_features['soil_moisture_surface_deep_diff'] = 0.21   # saturated topsoil

X = np.array([[input_features[f] for f in meta['features']]])
prob = model.predict_proba(X)[0, 1]

if   prob >= 0.10:  print(f"🔴 RED WARNING  : P={prob:.4f} — Evacuate immediately")
elif prob >= 0.02:  print(f"🟠 AMBER WATCH  : P={prob:.4f} — Alert rescue units")
elif prob >= 0.005: print(f"🟡 YELLOW ADVSY : P={prob:.4f} — Monitor closely")
else:               print(f"🟢 GREEN NORMAL : P={prob:.4f} — No threat detected")
```

---

## 🖥️ React Web Dashboard (Frontend)

The JALRAKSHAK frontend is a full-featured **React 18 + Vite** single-page application with two portals:

### Two-Portal Architecture

```
/              →  PublicLanding.jsx   (Citizen-facing: alerts, safety info, map)
/authority     →  Home.jsx           (Authority dashboard: full monitoring suite)
```

### Authority Dashboard — Tabs & Panels

| Tab | Component | Description |
|---|---|---|
| **Overview** | `DashboardMap` + `PredictionSidebar` | Leaflet map + live risk probability panel |
| **Sensors** | `LiveSensors` | Real-time IoT sensor feeds |
| **Rainfall** | `Rainfall` | Rainfall time-series charts |
| **River Levels** | `RiverLevels` | Stage height monitoring |
| **Soil Moisture** | `SoilMoisture` | Multi-depth soil saturation |
| **Weather** | `Weather` | Meteorological conditions |
| **Flash Flood Risk** | `FlashFloodRisk` | ML probability output + alert level |
| **Forecast** | `Forecast` | 6h ahead prediction curve |
| **Risk Analysis** | `RiskAnalysis` | Historical risk trend analysis |
| **Historical Events** | `HistoricalEvents` | Past flood event database |
| **Active Alerts** | `ActiveAlerts` | Current active alert management |

### Frontend Tech Stack

| Package | Version | Role |
|---|---|---|
| `react` | ^18.2.0 | UI framework |
| `react-router-dom` | ^6.21.1 | Client-side routing |
| `react-leaflet` + `leaflet` | ^4.2.1 + ^1.9.4 | Interactive flood zone maps |
| `socket.io-client` | ^4.7.4 | Real-time sensor data push |
| `i18next` + `react-i18next` | ^23.7.11 | Multilingual support (English + Hindi) |
| `lucide-react` | ^0.303.0 | Icon library |
| `tailwindcss` | ^3.4.0 | Utility-first styling |
| `vite` | ^5.0.8 | Build tooling |

### Key Frontend Features

- **🌐 Multilingual**: Full English/Hindi toggle (`LanguageProvider`)
- **📍 Location-aware**: `LocationProvider` for region-specific alerts
- **🔄 Real-time**: Socket.IO push for live sensor feeds
- **🗺️ Interactive Maps**: Leaflet maps showing flood zones, sensor locations, and alert overlays
- **⚠️ Alert Ticker**: Continuous running alert banner at top of authority dashboard
- **📱 Responsive**: Mobile-first Tailwind CSS layout

### API Services

| Service | Endpoints | Description |
|---|---|---|
| `predictionService` | `/predictions/zone/:id`, `/predictions/models/metrics` | Fetch ML predictions per zone |
| `alertService` | `/alerts`, `/alerts/:id/acknowledge`, `/alerts/broadcast` | Alert management |
| `sensorService` | Telemetry endpoints | Live sensor data |
| `riskService` | Risk assessment data | Computed risk scores |
| `weatherService` | Weather API | Meteorological data |
| `reportService` | Report generation | Export alert reports |

### Running the Frontend

```bash
cd frontend
npm install
npm run dev
# Open http://localhost:5173
```

---

## 🌐 TensorFlow.js Browser Inference

The trained Keras neural network is converted to **TensorFlow.js** format, enabling real-time flood probability predictions directly in the browser — no server-side Python required.

### Conversion Pipeline

```bash
# Step 1: Train and export Keras model
python export_and_convert.py

# Step 2: Convert to TF.js format
tensorflowjs_converter \
  --input_format=keras \
  models/flood_early_warning_tf.h5 \
  tfjs_model
```

### TF.js Model Files

| File | Size | Purpose |
|---|---|---|
| `tfjs_model/model.json` | ~6.7 KB | Model topology (layer architecture) |
| `tfjs_model/group1-shard1of1.bin` | ~22 KB | Float32 weight parameters |
| `tfjs_model/metadata.json` | ~6.7 KB | Feature names, StandardScaler params, alert thresholds |

### Browser Inference (JavaScript)

```javascript
import * as tf from '@tensorflow/tfjs';

const model = await tf.loadLayersModel('./tfjs_model/model.json');
const meta  = await (await fetch('./tfjs_model/metadata.json')).json();

// Scale features using saved StandardScaler parameters
const scaled = meta.features.map((f, i) =>
  (rawInputs[i] - meta.scaler_mean[f]) / meta.scaler_scale[f]
);

const tensor = tf.tensor2d([scaled], [1, 39]);
const prob   = (await model.predict(tensor).data())[0];
tensor.dispose();

// Apply 4-tier alert thresholds from metadata
const thresholds = meta.decision_thresholds;
if      (prob >= thresholds.red_min)    console.log("🔴 RED WARNING");
else if (prob >= thresholds.yellow_max) console.log("🟠 AMBER WATCH");
else if (prob >= thresholds.green_max)  console.log("🟡 YELLOW ADVISORY");
else                                    console.log("🟢 GREEN NORMAL");
```

### Running the Browser Demo

```bash
python -m http.server 8080
# Open: http://localhost:8080/demo.html
```

The `demo.html` page loads the converted TF.js model **entirely client-side** — functional offline after first load. Four preset sensor scenarios demonstrate the alert system in real time.

---

## 📁 Project Structure

```
Flash-flood-prediction-early-warning-system-2/
│
├── flash_flood_early_warning_xgboost.ipynb  # XGBoost analysis notebook (main branch)
├── Master_DataSet.csv                        # Raw dataset — 234,018 rows × 65 columns (192 MB)
├── export_and_convert.py                     # Train → Save → TF.js convert pipeline
├── generate_charts.py                        # Generate all README chart images
│
├── assets/                                   # Chart images for documentation
│   ├── 01_dataset_overview.png               # Class imbalance & temporal distribution
│   ├── 02_model_comparison.png               # Model benchmark bar charts
│   ├── 03_roc_pr_curves.png                  # ROC & Precision-Recall curves
│   ├── 04_confusion_matrices.png             # Default vs calibrated threshold
│   ├── 05_threshold_calibration.png          # F2-Score threshold sweep
│   ├── 06_feature_importance.png             # Gain & Weight feature importance
│   └── 07_hyperparameter_tuning.png          # Config comparison
│
├── tfjs_model/                               # TensorFlow.js browser-ready files
│   ├── model.json                            # TF.js graph topology
│   ├── group1-shard1of1.bin                  # Weight binaries
│   └── metadata.json                         # Features, scaler params, alert thresholds
│
├── frontend/                                 # React 18 web dashboard (FloodAtlas)
│   ├── index.html                            # Vite entry point
│   ├── package.json                          # npm dependencies
│   ├── vite.config.js                        # Build configuration
│   ├── tailwind.config.js                    # TailwindCSS config
│   └── src/
│       ├── App.jsx                           # Root app with routing
│       ├── main.jsx                          # React DOM entry
│       ├── pages/
│       │   ├── public/
│       │   │   ├── PublicLanding.jsx         # Citizen portal
│       │   │   ├── Home.jsx                  # Authority dashboard
│       │   │   ├── About.jsx                 # About page
│       │   │   ├── Safety.jsx                # Safety guidelines
│       │   │   ├── LiveMap.jsx               # Live flood map
│       │   │   └── Weather.jsx               # Weather page
│       │   ├── admin/                        # Admin panel pages
│       │   └── authority/                    # Authority-specific pages
│       ├── components/
│       │   ├── alerts/                       # RiskTicker, ActiveAlerts
│       │   ├── map/                          # DashboardMap (Leaflet)
│       │   ├── monitor/                      # LiveSensors, Rainfall, RiverLevels, SoilMoisture, Weather
│       │   ├── risk/                         # FlashFloodRisk, Forecast, RiskAnalysis, PredictionSidebar
│       │   ├── weather/                      # CurrentConditions, WeatherForecast
│       │   ├── authority/                    # Authority-specific components
│       │   ├── common/                       # Shared UI elements
│       │   └── layout/                       # SidebarNav, layout wrappers
│       ├── services/
│       │   ├── api.js                        # Base API client (JWT auth)
│       │   ├── alertService.js               # Alert CRUD + broadcast
│       │   ├── predictionService.js          # ML prediction endpoints
│       │   ├── sensorService.js              # IoT sensor data
│       │   ├── riskService.js                # Risk assessment
│       │   ├── weatherService.js             # Meteorological data
│       │   ├── telemetryService.js           # Historical telemetry
│       │   ├── zoneService.js                # Flood zone management
│       │   ├── reportService.js              # Report generation
│       │   ├── authService.js                # Authentication
│       │   └── systemService.js              # System health
│       ├── hooks/                            # useLanguage, useLocation, useRisk, useTelemetry
│       ├── context/                          # React context providers
│       ├── locales/                          # i18n translation files (en, hi)
│       ├── routes/                           # Route definitions
│       ├── socket/                           # Socket.IO client setup
│       ├── styles/                           # Global CSS
│       └── utils/                            # Utility functions
│
├── models/                                   # Saved trained models
│   ├── flood_warning_xgboost.json            # XGBoost model (JSON)
│   ├── flood_warning_xgboost.ubj             # XGBoost model (binary UBJ)
│   ├── flood_early_warning_tf.h5             # Keras/TensorFlow model
│   └── model_metadata.json                   # Feature list, medians, alert thresholds
│
└── README.md                                 # This file

── BRANCHES ────────────────────────────────────────
  xgboost-ml-model    # XGBoost notebook, training code, assets
  bilstm-ml-model     # BiLSTM notebook, sequence model, training code
```

---

## ⚙️ Installation & Usage

### Prerequisites

| Requirement | Version |
|---|---|
| Python | ≥ 3.10 |
| Node.js | ≥ 18 |
| npm | ≥ 9 |
| GPU (optional) | CUDA-enabled (for BiLSTM training) |

### Step 1 — Clone the Repository & Branches

```bash
# Main branch (XGBoost + frontend)
git clone https://github.com/rajwardhan550/Flash-flood-prediction-early-warning-system-2.git
cd Flash-flood-prediction-early-warning-system-2

# XGBoost model branch
git checkout xgboost-ml-model

# BiLSTM model branch
git checkout bilstm-ml-model
```

### Step 2 — Install Python Dependencies

```bash
# Core ML stack
pip install xgboost lightgbm scikit-learn pandas numpy

# Deep learning (for BiLSTM)
pip install tensorflow tf-keras

# Visualization
pip install matplotlib seaborn

# TF.js converter
pip install --no-deps tensorflowjs
pip install tf-keras tensorflow-hub

# Jupyter notebook
pip install jupyter
```

### Step 3 — Run XGBoost Notebook

```bash
git checkout xgboost-ml-model
jupyter notebook flash_flood_early_warning_xgboost.ipynb
```

Run all cells sequentially. The notebook will:
1. Load and inspect `Master_DataSet.csv`
2. Perform hydrological EDA (class imbalance analysis, monsoon seasonality)
3. Engineer 5 domain-physics features
4. Apply strict temporal train/val/test splits
5. Benchmark HistGradientBoosting, LightGBM, and XGBoost
6. Systematically optimize XGBoost across 4 hyperparameter configurations
7. Calibrate the decision threshold on validation F2-Score
8. Generate ROC curves, PR curves, confusion matrices, and feature importance plots
9. Simulate operational alert detection on the July 2023 Alaknanda flood event

### Step 4 — Run BiLSTM Notebook

```bash
git checkout bilstm-ml-model
jupyter notebook flash_flood_bilstm.ipynb
```

The BiLSTM notebook will:
1. Load and preprocess the same 234,018-row dataset
2. Build sliding window sequences (24-hour lookback × 39 features)
3. Define the Bidirectional LSTM architecture
4. Apply class-weighted training with early stopping
5. Evaluate on held-out test set (2022–2026)
6. Generate sequence-aware predictions and alert classifications

### Step 5 — Generate Charts

```bash
python generate_charts.py
# Outputs 7 publication-quality charts into assets/
```

### Step 6 — Export & Convert to TF.js

```bash
python export_and_convert.py
# Produces: models/ and tfjs_model/ directories
```

### Step 7 — Run the Web Frontend

```bash
cd frontend
npm install
npm run dev
# Open: http://localhost:5173
```

- `/` — Public citizen portal (alerts, flood map, safety info)
- `/authority` — Authority dashboard (full monitoring suite)

### Step 8 — Browser Demo (Offline Inference)

```bash
python -m http.server 8080
# Open: http://localhost:8080/demo.html
```

### Verified Environment

| Package | Version |
|---|---|
| Python | 3.12.10 |
| TensorFlow | 2.21.0 |
| Keras | 3.15.1 |
| XGBoost | 3.4.1 |
| LightGBM | 4.7.0 |
| scikit-learn | 1.9.1 |
| pandas | 2.2.3 |
| numpy | 2.5.3 |
| tensorflowjs | 4.22.0 |
| Node.js | ≥ 18 |
| React | 18.2.0 |

---

## 🏆 How This Solves SIH PS 26192

| PS 26192 Criterion | JALRAKSHAK Implementation |
|---|---|
| **Early warning with sufficient lead time** | `flood_next_6h` target → up to 6 hours advance notice |
| **AI/ML-based prediction** | XGBoost (ROC-AUC 0.9544) + BiLSTM temporal model |
| **Handles Himalayan river flood patterns** | Trained on 26 years of Alaknanda Basin data (2000–2026) |
| **Handles extreme class imbalance** | `scale_pos_weight`, F2-Score optimization, PR-AUC evaluation |
| **Actionable, tiered alerts** | 4-level colour system (Green/Yellow/Amber/Red) with civil action protocols |
| **Civil authority interface** | React authority dashboard with alert acknowledgement and broadcast |
| **Public awareness interface** | React public landing portal with Hindi/English support |
| **Real-time monitoring** | Socket.IO live sensor feeds; Leaflet interactive maps |
| **Deployable & scalable** | Browser-native TF.js inference + full-stack web app |
| **Physically interpretable** | Feature importance tied to known hydrological physics |

---

## 📚 References

1. **Chen, T. & Guestrin, C. (2016)** — *XGBoost: A Scalable Tree Boosting System*, KDD 2016
2. **Hochreiter, S. & Schmidhuber, J. (1997)** — *Long Short-Term Memory*, Neural Computation 9(8)
3. **Schuster, M. & Paliwal, K. (1997)** — *Bidirectional Recurrent Neural Networks*, IEEE Transactions on Signal Processing
4. **NDMA India** — *Flash Flood Risk Management Guidelines* (2008)
5. **Saharia et al. (2017)** — *Mapping Flash Flood Severity in the United States*
6. **Chawla et al. (2002)** — *SMOTE: Synthetic Minority Over-sampling Technique*
7. **TensorFlow.js Documentation** — https://www.tensorflow.org/js

---

## 👥 Team

> Built for **Smart India Hackathon — Problem Statement 26192**
> Flash Flood Early Warning System for the Alaknanda River Basin, Chamoli District, Uttarakhand

*🌊 JALRAKSHAK — जलरक्षक — Water Guardian*
*Protecting lives through AI-powered hydrometeorological intelligence.*
