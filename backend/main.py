from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
import uvicorn, os, json
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

app = FastAPI(title="ForestGuard EcoBlueprint API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SPECIES = {
    "prunus_africana": {"name":"Prunus africana","common":"African Cherry","status":"Vulnerable","habitat":"montane","kefri_code":"KEF-001"},
    "olea_capensis": {"name":"Olea capensis","common":"East African Olive","status":"Near Threatened","habitat":"montane","kefri_code":"KEF-002"},
    "vitex_keniensis": {"name":"Vitex keniensis","common":"Meru Oak","status":"Endangered","habitat":"montane","kefri_code":"KEF-003"},
    "juniperus_procera": {"name":"Juniperus procera","common":"African Pencil Cedar","status":"Near Threatened","habitat":"montane","kefri_code":"KEF-004"},
    "podocarpus_spp": {"name":"Podocarpus latifolius","common":"Yellowwood","status":"Vulnerable","habitat":"montane","kefri_code":"KEF-005"},
    "brachylaena_huillensis": {"name":"Brachylaena huillensis","common":"Muhuhu","status":"Endangered","habitat":"coastal","kefri_code":"KEF-006"},
    "hagenia_abyssinica": {"name":"Hagenia abyssinica","common":"African Redwood","status":"Vulnerable","habitat":"montane","kefri_code":"KEF-007"},
    "warburgia_ugandensis": {"name":"Warburgia ugandensis","common":"Pepper Bark","status":"Vulnerable","habitat":"lowland","kefri_code":"KEF-008"},
    "croton_megalocarpus": {"name":"Croton megalocarpus","common":"Croton","status":"Least Concern","habitat":"lowland","kefri_code":"KEF-009"},
    "acacia_xanthophloea": {"name":"Acacia xanthophloea","common":"Fever Tree","status":"Least Concern","habitat":"savanna","kefri_code":"KEF-010"},
    "albizia_spp": {"name":"Albizia gummifera","common":"Peacock Flower","status":"Least Concern","habitat":"lowland","kefri_code":"KEF-011"},
    "syzygium_guineense": {"name":"Syzygium guineense","common":"Waterberry","status":"Least Concern","habitat":"riparian","kefri_code":"KEF-012"},
}

REGIONS = {
    "mau": {"name":"Mau Forest Complex","lat":-0.5,"lng":35.3,"status":"critical","deforested_ha":480,"habitat":"montane","color":"#1a7a3a"},
    "mt_kenya": {"name":"Mt. Kenya Forest","lat":-0.2,"lng":37.5,"status":"critical","deforested_ha":320,"habitat":"montane","color":"#1a5a2a"},
    "kakamega": {"name":"Kakamega Forest","lat":0.5,"lng":34.8,"status":"moderate","deforested_ha":195,"habitat":"lowland","color":"#2a8a3a"},
    "karura": {"name":"Karura Forest","lat":-1.2,"lng":36.8,"status":"moderate","deforested_ha":85,"habitat":"lowland","color":"#3a9a4a"},
    "tsavo": {"name":"Tsavo Ecosystem","lat":-2.5,"lng":38.0,"status":"stable","deforested_ha":52,"habitat":"savanna","color":"#b8860b"},
    "arabuko": {"name":"Arabuko-Sokoke","lat":-3.4,"lng":39.5,"status":"moderate","deforested_ha":67,"habitat":"coastal","color":"#1a7a6a"},
    "elgon": {"name":"Mt. Elgon Forest","lat":1.1,"lng":34.6,"status":"critical","deforested_ha":210,"habitat":"montane","color":"#1a5a3a"},
    "aberdare": {"name":"Aberdare Range","lat":-0.4,"lng":36.7,"status":"moderate","deforested_ha":120,"habitat":"montane","color":"#1a6b3a"},
    "nyambene": {"name":"Nyambene Hills","lat":0.2,"lng":38.0,"status":"critical","deforested_ha":140,"habitat":"montane","color":"#2a6a2a"},
    "shimba": {"name":"Shimba Hills","lat":-4.2,"lng":39.4,"status":"stable","deforested_ha":35,"habitat":"coastal","color":"#2a8a6a"},
    "masai_mara": {"name":"Mara Woodland","lat":-1.4,"lng":35.0,"status":"stable","deforested_ha":28,"habitat":"savanna","color":"#c8960b"},
}

HABITATS = {
    "montane": {"name":"Montane Forest","color":"#1a6b4a"},
    "lowland": {"name":"Lowland Rainforest","color":"#2d8a4e"},
    "coastal": {"name":"Coastal Forest","color":"#1a7a6a"},
    "savanna": {"name":"Savanna Woodland","color":"#b8860b"},
    "riparian": {"name":"Riparian Forest","color":"#2a6b8a"},
}

HOTSPOTS = [
    {"id":1,"region":"Mau Forest","lat":-0.48,"lng":35.28,"cause":"illegal","severity":"high","trees_affected":340,"date":"2026-06-14","description":"Night logging operation detected"},
    {"id":2,"region":"Mau Forest","lat":-0.55,"lng":35.32,"cause":"disease","severity":"high","trees_affected":180,"date":"2026-06-10","description":"Fungal infection in Prunus africana"},
    {"id":3,"region":"Mt. Kenya","lat":-0.18,"lng":37.48,"cause":"illegal","severity":"critical","trees_affected":520,"date":"2026-06-12","description":"Large-scale illegal timber operation"},
    {"id":4,"region":"Mt. Kenya","lat":-0.22,"lng":37.52,"cause":"fire","severity":"medium","trees_affected":90,"date":"2026-06-08","description":"Surface fire in lower slopes"},
    {"id":5,"region":"Kakamega","lat":0.48,"lng":34.78,"cause":"legal","severity":"low","trees_affected":60,"date":"2026-06-15","description":"Licensed harvesting plot KMG-04"},
    {"id":6,"region":"Kakamega","lat":0.52,"lng":34.82,"cause":"illegal","severity":"medium","trees_affected":120,"date":"2026-06-11","description":"Charcoal burning site"},
    {"id":7,"region":"Karura","lat":-1.18,"lng":36.82,"cause":"illegal","severity":"medium","trees_affected":85,"date":"2026-06-13","description":"Encroachment on northern boundary"},
    {"id":8,"region":"Elgon","lat":1.08,"lng":34.58,"cause":"legal","severity":"medium","trees_affected":200,"date":"2026-06-09","description":"Government-sanctioned timber harvest"},
    {"id":9,"region":"Arabuko-Sokoke","lat":-3.42,"lng":39.48,"cause":"illegal","severity":"high","trees_affected":280,"date":"2026-06-14","description":"Muhuhu poaching for carving trade"},
    {"id":10,"region":"Nyambene","lat":0.18,"lng":38.02,"cause":"illegal","severity":"critical","trees_affected":410,"date":"2026-06-13","description":"Meru Oak targeted by syndicate"},
    {"id":11,"region":"Mau Forest","lat":-0.52,"lng":35.26,"cause":"legal","severity":"low","trees_affected":45,"date":"2026-06-07","description":"Licensed exotic plantation harvest"},
    {"id":12,"region":"Aberdare","lat":-0.38,"lng":36.72,"cause":"disease","severity":"medium","trees_affected":150,"date":"2026-06-06","description":"Root rot in Hagenia stands"},
    {"id":13,"region":"Tsavo","lat":-2.48,"lng":38.02,"cause":"fire","severity":"high","trees_affected":230,"date":"2026-06-12","description":"Wildfire in Acacia woodland"},
    {"id":14,"region":"Shimba","lat":-4.18,"lng":39.42,"cause":"disease","severity":"medium","trees_affected":95,"date":"2026-06-05","description":"Dieback in Brachylaena"},
    {"id":15,"region":"Elgon","lat":1.12,"lng":34.62,"cause":"fire","severity":"high","trees_affected":175,"date":"2026-06-11","description":"Bush fire on eastern slopes"},
    {"id":16,"region":"Masai Mara","lat":-1.42,"lng":35.02,"cause":"fire","severity":"medium","trees_affected":80,"date":"2026-06-14","description":"Grassland fire affecting Acacia"},
    {"id":17,"region":"Mt. Kenya","lat":-0.16,"lng":37.55,"cause":"legal","severity":"low","trees_affected":120,"date":"2026-06-04","description":"Licensed plantation thinning"},
    {"id":18,"region":"Mau Forest","lat":-0.45,"lng":35.35,"cause":"illegal","severity":"high","trees_affected":290,"date":"2026-06-15","description":"Timber convoy intercepted"},
]

KEFRI_WEBHOOK_SECRET = os.getenv("KEFRI_WEBHOOK_SECRET", "forestguard-dev-secret")
kefri_data_store = []

# ---------------------------------------------------------------------------
# KEFRI FLR Knowledge Base
# ---------------------------------------------------------------------------
from kefri_flr import FLR_RESOURCES, RESOURCE_CATEGORIES, RESOURCE_TYPES, SPECIES_FLR

@app.get("/api/flr/categories")
def flr_categories():
    return RESOURCE_CATEGORIES

@app.get("/api/flr/types")
def flr_types():
    return RESOURCE_TYPES

@app.get("/api/flr/resources")
def flr_resources(category: str = None, type_id: str = None, species_id: str = None):
    results = FLR_RESOURCES
    if category:
        results = [r for r in results if r["category"] == category]
    if type_id:
        results = [r for r in results if r["type"] == type_id]
    if species_id:
        uuids = set(SPECIES_FLR.get(species_id, []))
        results = [r for r in results if r["uuid"] in uuids]
    return results

@app.get("/api/flr/resources/{uuid}")
def flr_resource_detail(uuid: str):
    for r in FLR_RESOURCES:
        if r["uuid"] == uuid:
            return r
    raise HTTPException(404, "FLR resource not found")

@app.get("/api/flr/species/{species_id}")
def flr_for_species(species_id: str):
    if species_id not in SPECIES_FLR:
        return []
    uuids = SPECIES_FLR[species_id]
    return [r for r in FLR_RESOURCES if r["uuid"] in uuids]

@app.get("/")
def root():
    return {"app": "ForestGuard EcoBlueprint API", "version": "2.0.0", "status": "operational"}

@app.get("/api/species")
def get_species():
    return [{"id": sid, **s} for sid, s in SPECIES.items()]

@app.get("/api/species/{species_id}")
def get_species_detail(species_id: str):
    if species_id not in SPECIES:
        raise HTTPException(404, "Species not found")
    return {"id": species_id, **SPECIES[species_id]}

@app.get("/api/regions")
def get_regions():
    return [{"id": rid, **r} for rid, r in REGIONS.items()]

@app.get("/api/region/{region_id}")
def get_region(region_id: str):
    if region_id not in REGIONS:
        raise HTTPException(404, "Region not found")
    return {"id": region_id, **REGIONS[region_id]}

@app.get("/api/habitats")
def get_habitats():
    return HABITATS

@app.get("/api/hotspots")
def get_hotspots(cause: str = None):
    if cause:
        return [h for h in HOTSPOTS if h["cause"] == cause]
    return HOTSPOTS

@app.get("/api/hotspots/stats")
def get_hotspot_stats():
    stats = {"legal": 0, "illegal": 0, "disease": 0, "fire": 0}
    for h in HOTSPOTS:
        stats[h["cause"]] += h["trees_affected"]
    stats["total"] = sum(stats.values())
    stats["hotspot_count"] = len(HOTSPOTS)
    return stats

@app.get("/api/stats")
def get_stats():
    total_deforested = sum(r["deforested_ha"] for r in REGIONS.values())
    return {
        "forest_cover_km2": 5846,
        "deforested_ytd_ha": total_deforested,
        "reforested_ha": 685,
        "carbon_sequestered_kt": 3.5,
        "active_alerts": sum(1 for r in REGIONS.values() if r["status"] == "critical"),
        "regions_monitored": len(REGIONS),
        "species_tracked": len(SPECIES),
        "species_endangered": sum(1 for s in SPECIES.values() if s["status"] in ("Endangered","Vulnerable")),
    }

@app.get("/api/loss-breakdown")
def get_loss_breakdown():
    return {
        "legal": 1225,
        "illegal": 2840,
        "disease": 865,
        "fire": 530,
        "total": 5460,
    }

@app.get("/api/alerts")
def get_alerts():
    return [
        {"id":1,"region":"Nyambene Hills","severity":"critical","message":"Meru Oak (Vitex keniensis) logging accelerating — 410 trees lost","time":"8h ago"},
        {"id":2,"region":"Mau Forest","severity":"high","message":"Night logging operation detected — 340 Prunus africana affected","time":"2h ago"},
        {"id":3,"region":"Arabuko-Sokoke","severity":"high","message":"Muhuhu poaching for carving trade — 280 trees lost","time":"12h ago"},
        {"id":4,"region":"Tsavo","severity":"high","message":"Wildfire in Acacia woodland — 230 trees affected","time":"3d ago"},
        {"id":5,"region":"Mt. Kenya","severity":"critical","message":"Large-scale illegal timber syndicate — 520 trees","time":"1d ago"},
    ]

@app.post("/api/webhook/kefri")
async def kefri_webhook(request: Request):
    body = await request.json()
    secret = request.headers.get("X-KEFRI-Secret")
    if secret != KEFRI_WEBHOOK_SECRET:
        raise HTTPException(401, "Invalid webhook secret")
    record = {
        "received_at": datetime.now().isoformat(),
        "data": body,
    }
    kefri_data_store.append(record)
    if len(kefri_data_store) > 1000:
        kefri_data_store.pop(0)
    return {"status": "accepted", "record_id": len(kefri_data_store)}

@app.get("/api/webhook/kefri/history")
def get_kefri_history(limit: int = 50):
    return kefri_data_store[-limit:]

@app.get("/api/gemini/status")
def gemini_status():
    has_key = bool(os.getenv("GEMINI_API_KEY"))
    return {"available": has_key, "configured": has_key}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
