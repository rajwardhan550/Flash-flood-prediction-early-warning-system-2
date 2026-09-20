require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Zone = require('./src/models/Zone');

const enrichedDataPath = path.join(__dirname, 'src', 'utils', 'chamoliPanchayatsEnriched.json');

async function seedHyperlocalPanchayats() {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/floodatlas';
    console.log(`[SEED] Connecting to MongoDB: ${mongoUri}`);
    await mongoose.connect(mongoUri);
    console.log('[SEED] Connected successfully.');

    if (!fs.existsSync(enrichedDataPath)) {
      throw new Error(`Enriched dataset not found at: ${enrichedDataPath}`);
    }

    const rawData = fs.readFileSync(enrichedDataPath, 'utf-8');
    const panchayats = JSON.parse(rawData);
    console.log(`[SEED] Loaded ${panchayats.length} panchayats from JSON.`);

    let upsertCount = 0;
    for (const p of panchayats) {
      const zonePayload = {
        zoneId: p.zoneId,
        name: p.name,
        district: p.district || 'Chamoli',
        adminLevel: 'panchayat',
        placeType: p.place_type || 'village',
        location: {
          type: 'Point',
          coordinates: [p.longitude, p.latitude], // GeoJSON order: [lng, lat]
        },
        latitude: p.latitude,
        longitude: p.longitude,
        terrain: {
          elevation_m: p.terrain.elevation_m,
          slope_deg: p.terrain.slope_deg,
          distance_to_river_m: p.terrain.distance_to_river_m,
        },
        status: 'ACTIVE',
        riskTier: 'LOW',
        riskScore: 0.0,
      };

      await Zone.findOneAndUpdate(
        { zoneId: p.zoneId },
        { $set: zonePayload },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      upsertCount++;
    }

    console.log(`\n[SUCCESS] Successfully seeded/updated ${upsertCount} hyper-local Panchayats into MongoDB!`);
  } catch (err) {
    console.error('[SEED ERROR]:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('[SEED] Database disconnected.');
  }
}

seedHyperlocalPanchayats();