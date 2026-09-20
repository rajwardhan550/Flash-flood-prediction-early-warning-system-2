import os
import json
import requests

# Multiple reliable Overpass API mirror endpoints
ENDPOINTS = [
    "https://overpass.kumi.systems/api/interpreter",
    "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
    "https://overpass-api.de/api/interpreter"
]

# Chamoli District Bounding Box: [south, west, north, east]
# Min Lat: 30.0, Min Lon: 79.2, Max Lat: 31.0, Max Lon: 80.1
query = """
[out:json][timeout:30];
(
  node["place"~"village|hamlet|town"](30.0,79.2,31.0,80.1);
);
out body;
"""

data = None
for url in ENDPOINTS:
    try:
        print(f"Connecting to mirror: {url} ...")
        res = requests.post(url, data={"data": query}, headers={"User-Agent": "FloodAtlasSystem/2.0"}, timeout=35)
        if res.status_code == 200:
            data = res.json()
            print(f"[OK] Response successfully received from {url}")
            break
        else:
            print(f"Mirror returned HTTP {res.status_code}, trying next...")
    except Exception as err:
        print(f"Connection failed to {url}: {err}, trying next...")

if not data or "elements" not in data:
    print("[ERROR] Could not fetch from Overpass mirrors at this moment.")
    exit(1)

elements = data.get("elements", [])
panchayats = []
seen_names = set()

for elem in elements:
    tags = elem.get("tags", {})
    name = tags.get("name") or tags.get("name:en")
    
    if not name or name.strip() in seen_names:
        continue
    
    clean_name = name.strip()
    seen_names.add(clean_name)
    
    panchayats.append({
        "panchayatId": f"GP-{elem['id']}",
        "name": clean_name,
        "latitude": round(float(elem["lat"]), 6),
        "longitude": round(float(elem["lon"]), 6),
        "place_type": tags.get("place", "village"),
        "district": "Chamoli"
    })

print(f"[SUCCESS] Total genuine Chamoli Panchayats/Wards extracted: {len(panchayats)}")

base_dir = os.path.dirname(os.path.abspath(__file__))
output_path = os.path.abspath(os.path.join(base_dir, "..", "backend", "src", "utils", "chamoliPanchayats.json"))
os.makedirs(os.path.dirname(output_path), exist_ok=True)

with open(output_path, "w", encoding="utf-8") as f:
    json.dump(panchayats, f, ensure_ascii=False, indent=2)

print(f"Saved directly to: {output_path}")