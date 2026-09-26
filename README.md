# 🌧️ Flash Flood Prediction System — Datasets & Data Sources

This repository uses **multi-source environmental, hydrological, meteorological, and geospatial data** to support flash-flood prediction and hyper-local early warning for hilly regions, with a primary focus on **Uttarakhand, India**.

The data sources below are used for rainfall monitoring, water-level analysis, weather forecasting, terrain analysis, flood-history analysis, and model development.

> The master dataset is the combined and cleaned dataset created from all the datasets present in this repository. It integrates the available sources into one cleaned dataset for analysis and model training.

---

## 📊 Data Sources Overview

| #  | Data Source                       | Data Type                     | Primary Use                            |
| -- | --------------------------------- | ----------------------------- | -------------------------------------- |
| 1  | CWC / NWIC — Uttarakhand Rainfall | Hourly rainfall telemetry     | Rainfall monitoring & flood prediction |
| 2  | Uttarakhand Water Department      | Hourly rainfall telemetry     | Local rainfall analysis                |
| 3  | IMD                               | Meteorological rainfall data  | Rainfall forecasting & validation      |
| 4  | India-WRIS                        | Water resources & hydrology   | River, basin & water-resource analysis |
| 5  | ISRO/NRSC Bhuvan — CartoDEM       | Digital Elevation Model       | Elevation & terrain analysis           |
| 6  | Open-Meteo                        | Weather API                   | Real-time/weather forecast features    |
| 7  | OpenWeather API                   | Weather API                   | Weather monitoring & prediction        |
| 8  | India Flood Inventory             | Historical flood data         | Historical flood-event analysis        |
| 9  | India Flood Inventory v3          | Historical flood dataset      | Flood mapping & model validation       |
| 10 | National Water Data Portal        | Water & hydrological datasets | Multi-source data integration          |
| 11 | Bhuvan — ISRO/NRSC                | Geospatial & satellite data   | Terrain, land-use & spatial analysis   |
| 12 | Master Dataset (Google Drive)     | Combined & cleaned multi-source data | Final combined and cleaned dataset from all present datasets for model training and analysis |

---

# 🌧️ 1. CWC / NWIC — Uttarakhand Rainfall

**Dataset:** Rainfall — CWC Telemetry Hourly

Provides telemetry-based rainfall observations that can be used for **hourly rainfall monitoring and time-series analysis**.

🔗 **Dataset:**
https://www.nwdp.nwic.gov.in/en/dataset/rainfall-cwc-telemetry-hourly

### Used For

* Hourly rainfall analysis
* Rainfall threshold detection
* Flash-flood feature generation
* Time-series forecasting
* Model training and validation

---

# 🌧️ 2. Uttarakhand Water Department — Rainfall

**Dataset:** Rainfall Telemetry Hourly — Uttarakhand

Provides rainfall telemetry data for Uttarakhand that can complement other meteorological and hydrological datasets.

🔗 **Dataset:**
https://www.nwdp.nwic.gov.in/en/dataset/rainfall-telemetry-hourly-uttarakhand

### Used For

* Local rainfall monitoring
* Station-level rainfall analysis
* Rainfall trend detection
* Multi-source data fusion

---

# 🌦️ 3. India Meteorological Department — IMD

The **India Meteorological Department (IMD)** provides official meteorological information, including rainfall observations and related weather information.

🔗 **Rainfall Information:**
https://mausam.imd.gov.in/responsive/rainfallinformation.php

### Used For

* Rainfall analysis
* Meteorological validation
* Historical rainfall comparison
* Weather-based flood-risk features

---

# 💧 4. India-WRIS

**India Water Resources Information System (India-WRIS)** provides water-resource and hydrological information for India.

🔗 **Portal:**
https://indiawris.gov.in/

### Used For

* River and basin analysis
* Water-resource information
* Hydrological datasets
* Watershed analysis
* Flood-related research

---

# 🛰️ 5. ISRO / NRSC Bhuvan — CartoDEM

**CartoDEM** provides Digital Elevation Model (DEM) data that can be used to understand the terrain characteristics of mountainous regions.

🔗 **Satellite Data Download:**
https://bhuvan.nrsc.gov.in/wiki/index.php/Free_Satellite_Data_Download

### Used For

* Elevation
* Slope calculation
* Terrain analysis
* Drainage analysis
* Watershed delineation
* Identification of low-lying/high-risk areas

### Example Derived Features

```text
DEM
 ↓
Elevation
 ↓
Slope
 ↓
Terrain Characteristics
 ↓
Flood Susceptibility Features
```

---

# 🌤️ 6. Open-Meteo

Open-Meteo provides weather and forecast data through APIs.

🔗 **Official Website:**
https://open-meteo.com/

### Used For

* Weather forecasting
* Precipitation
* Temperature
* Wind
* Humidity
* Forecast-based flood-risk features

### Example API Data

```text
Timestamp
Rainfall
Temperature
Humidity
Wind Speed
Weather Conditions
```

---

# 🌦️ 7. OpenWeather API

OpenWeather provides weather and forecast APIs that can be integrated into real-time monitoring systems.

🔗 **API:**
https://openweathermap.org/api

### Used For

* Real-time weather information
* Precipitation monitoring
* Temperature
* Humidity
* Wind conditions
* Forecast information

---

# 🌊 8. India Flood Inventory — GitHub

The **India Flood Inventory (IFI)** provides historical flood-event information for India.

🔗 **GitHub Repository:**
https://github.com/hydrosenselab/India-Flood-Inventory

### Used For

* Historical flood-event analysis
* Flood occurrence mapping
* Model validation
* Training labels/reference data
* Spatial flood analysis

---

# 🌊 9. India Flood Inventory v3 — Zenodo

A version of the India Flood Inventory is also available through Zenodo for research and reproducible data access.

🔗 **Dataset:**
https://zenodo.org/records/11275211

### Used For

* Historical flood analysis
* Flood-event validation
* Spatial-temporal analysis
* Machine-learning dataset generation

---

# 💧 10. National Water Data Portal — NWDP

The **National Water Data Portal (NWDP)** provides access to water-related datasets from different sources.

🔗 **Portal:**
https://www.nwdp.nwic.gov.in/

### Used For

* Hydrological datasets
* Rainfall datasets
* Water-resource information
* Data discovery
* Multi-source data integration

---

# 🛰️ 11. Bhuvan — ISRO / NRSC

**Bhuvan** is an ISRO/NRSC geospatial platform providing access to various satellite and geographic datasets.

🔗 **Bhuvan Portal:**
https://bhuvan.nrsc.gov.in/

### Used For

* Satellite data
* Terrain information
* Land-use/land-cover analysis
* Geographic information
* Spatial analysis
* Disaster management applications

---

# 🧠 Multi-Source Data Fusion

The proposed system combines multiple data sources to improve flash-flood prediction.

```text
                 ┌─────────────────────┐
                 │   Rainfall Data     │
                 │ CWC / IMD / NWDP    │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │   Weather Data      │
                 │ Open-Meteo /        │
                 │ OpenWeather         │
                 └──────────┬──────────┘
                            │
                            ▼
┌────────────────┐   ┌─────────────────────┐   ┌─────────────────┐
│ Terrain / DEM  │──►│  Data Preprocessing │◄──│ Historical Flood│
│ Bhuvan         │   │  & Feature Engine.  │   │ Inventory       │
└────────────────┘   └──────────┬──────────┘   └─────────────────┘
                                 │
                                 ▼
                       ┌──────────────────┐
                       │ ML Prediction    │
                       │ Engine           │
                       │ XGBoost + BiLSTM │
                       └────────┬─────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │ Flood Risk Level │
                       │ Low / Medium /   │
                       │ High / Critical  │
                       └────────┬─────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │ Early Warning &  │
                       │ Alert System     │
                       └──────────────────┘
```

---

# 📁 Recommended Dataset Structure

The downloaded/processed datasets can be organized as follows:

```text
data/
│
├── rainfall/
│   ├── cwc/
│   ├── uttarakhand_water_department/
│   └── imd/
│
├── weather/
│   ├── open_meteo/
│   └── openweather/
│
├── hydrology/
│   └── india_wris/
│
├── terrain/
│   ├── cartodem/
│   └── bhuvan/
│
├── flood_history/
│   ├── india_flood_inventory/
│   └── india_flood_inventory_v3/
│
└── processed/
    ├── cleaned_data.csv
    ├── features.csv
    └── training_data.csv
```

---

# 🔬 Important Features for ML

The following features can be generated from the above data sources:

| Feature                     | Source                                    |
| --------------------------- | ----------------------------------------- |
| Hourly Rainfall             | CWC / NWIC / Uttarakhand Water Department |
| Cumulative Rainfall         | Derived from rainfall data                |
| Rainfall Intensity          | Derived                                   |
| 3-hour Rainfall             | Derived                                   |
| 6-hour Rainfall             | Derived                                   |
| 24-hour Rainfall            | Derived                                   |
| Temperature                 | Open-Meteo / OpenWeather                  |
| Humidity                    | Open-Meteo / OpenWeather                  |
| Wind Speed                  | Open-Meteo / OpenWeather                  |
| Elevation                   | Bhuvan / CartoDEM                         |
| Slope                       | Derived from DEM                          |
| Terrain Characteristics     | Bhuvan / DEM                              |
| Historical Flood Occurrence | India Flood Inventory                     |
| River / Water Resources     | India-WRIS                                |
| Flood Event Labels          | Historical flood datasets                 |

---

# ⚠️ Data Usage & Attribution

These datasets are provided by their respective organizations and platforms. Users should review the **individual dataset's license, terms of use, attribution requirements, and access conditions** before downloading, redistributing, or using the data commercially.

This project does **not claim ownership** of the external datasets.

---

# 🎯 Project Objective

The purpose of integrating these datasets is to develop a **multi-source flash-flood prediction and early-warning system** capable of:

* 🌧️ Monitoring rainfall
* 🌊 Analyzing hydrological conditions
* 🛰️ Understanding terrain characteristics
* 🤖 Predicting flood risk using machine learning
* 📍 Supporting hyper-local risk assessment
* 🚨 Generating early warnings
* 🧭 Supporting timely evacuation decisions

---

## 🔗 Quick Access

| Resource                   | Link                                                                                          |
| -------------------------- | --------------------------------------------------------------------------------------------- |
| CWC / NWIC Rainfall        | [Open Dataset](https://www.nwdp.nwic.gov.in/en/dataset/rainfall-cwc-telemetry-hourly)         |
| Uttarakhand Rainfall       | [Open Dataset](https://www.nwdp.nwic.gov.in/en/dataset/rainfall-telemetry-hourly-uttarakhand) |
| IMD Rainfall               | [Open IMD](https://mausam.imd.gov.in/responsive/rainfallinformation.php)                      |
| India-WRIS                 | [Open Portal](https://indiawris.gov.in/)                                                      |
| Bhuvan CartoDEM            | [Open Data](https://bhuvan.nrsc.gov.in/wiki/index.php/Free_Satellite_Data_Download)           |
| Open-Meteo                 | [Open Website](https://open-meteo.com/)                                                       |
| OpenWeather                | [Open API](https://openweathermap.org/api)                                                    |
| India Flood Inventory      | [GitHub](https://github.com/hydrosenselab/India-Flood-Inventory)                              |
| India Flood Inventory v3   | [Zenodo](https://zenodo.org/records/11275211)                                                 |
| National Water Data Portal | [Open NWDP](https://www.nwdp.nwic.gov.in/)                                                    |
| Bhuvan                     | [Open Bhuvan](https://bhuvan.nrsc.gov.in/)                                                    |
| Master Dataset             | [Google Drive](https://drive.google.com/drive/folders/1YCB-MXjmMcoD7fozU5asQr5BxsmeALQD?usp=sharing) |

---

## 📌 Note

For model development, external datasets should generally be **downloaded, cleaned, standardized, spatially aligned, and temporally synchronized** before being used for training.

The final ML dataset should maintain appropriate timestamps, geographic coordinates/station IDs, missing-value handling, and clearly defined prediction labels.
