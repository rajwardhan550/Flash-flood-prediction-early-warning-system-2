import os
import json
import geopandas as gpd
from shapely.geometry import Point

base_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.abspath(os.path.join(base_dir, ".."))
gpkg_path = os.path.join(project_root, "chamoli_500m_grid.gpkg")
input_json = os.path.join(project_root, "backend", "src", "utils", "chamoliPanchayats.json")
output_json = os.path.join(project_root, "backend", "src", "utils", "chamoliPanchayatsEnriched.json")

print("Loading Chamoli 500m Grid GeoPackage...")
grid_gdf = gpd.read_file(gpkg_path)

# Reproject to metric UTM Zone 44N for distance calculations
UTM_CRS = "EPSG:32644"
if grid_gdf.crs is None or grid_gdf.crs.to_epsg() != 32644:
    grid_gdf = grid_gdf.to_crs(UTM_CRS)

# Spatial index build karo fast lookups ke liye
grid_sindex = grid_gdf.sindex

with open(input_json, "r", encoding="utf-8") as f:
    panchayats = json.load(f)

print(f"Enriching {len(panchayats)} Panchayats via Spatial Index...")

# Create GeoDataFrame in WGS84, then convert to UTM
pts_wgs84 = [Point(p["longitude"], p["latitude"]) for p in panchayats]
p_gdf_utm = gpd.GeoSeries(pts_wgs84, crs="EPSG:4326").to_crs(UTM_CRS)

enriched_list = []
for idx, p in enumerate(panchayats):
    point_geom = p_gdf_utm.iloc[idx]
    
    # Find nearest grid cell geometry index
    nearest_idx = grid_sindex.nearest(point_geom, return_distance=False)[1][0]
    matched_cell = grid_gdf.iloc[nearest_idx]
    
    # Extract terrain metrics from the matched 500m cell
    elevation = matched_cell.get("elevation", matched_cell.get("dem", 1850.0))
    slope = matched_cell.get("slope", 24.5)
    dist_river = matched_cell.get("dist_river", matched_cell.get("river_dist", matched_cell.get("distance_to_river_m", 150.0)))
    
    enriched_list.append({
        "zoneId": str(p["panchayatId"]).lower().replace("-", "_"),
        "name": str(p["name"]),
        "district": "Chamoli",
        "place_type": str(p.get("place_type", "village")),
        "latitude": round(float(p["latitude"]), 6),
        "longitude": round(float(p["longitude"]), 6),
        "terrain": {
            "elevation_m": round(float(elevation), 2),
            "slope_deg": round(float(slope), 2),
            "distance_to_river_m": round(float(dist_river), 2)
        }
    })

with open(output_json, "w", encoding="utf-8") as f:
    json.dump(enriched_list, f, ensure_ascii=False, indent=2)

print(f"[SUCCESS] Successfully enriched {len(enriched_list)} Panchayats!")
print(f"File saved to: {output_json}")