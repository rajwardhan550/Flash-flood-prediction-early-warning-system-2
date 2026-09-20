const mongoose = require('mongoose');
const { mongo } = require('./src/config/env');
const Zone = require('./src/models/Zone');
const User = require('./src/models/User');
const IoTSensor = require('./src/models/IoTSensor');
const chamoliLocations = require('./src/utils/chamoliLocations');
const logger = require('./src/utils/logger');

const seedSystem = async () => {
  try {
    await mongoose.connect(mongo.uri);
    logger.info('Connected to MongoDB Atlas for seeding sequence...', { subsystem: 'SEED' });

    // Drop old phone unique index if it exists
    try {
      await User.collection.dropIndex('phone_1');
      logger.info('Dropped stale unique index on phone field.', { subsystem: 'SEED' });
    } catch (idxErr) {
      // Ignore if index did not exist
    }

    // 1. Seed Monitored Zones
    for (const loc of chamoliLocations) {
      await Zone.findOneAndUpdate(
        { zoneId: loc.zoneId },
        { $set: loc },
        { upsert: true, returnDocument: 'after' }
      );
      
      // Ensure matching hardware/simulator sensor entry exists
      await IoTSensor.findOneAndUpdate(
        { sensorId: `SIM-${loc.zoneId.toUpperCase()}` },
        {
          $set: {
            sensorId: `SIM-${loc.zoneId.toUpperCase()}`,
            zoneId: loc.zoneId,
            name: `${loc.name} Multi-Sensor Station`,
            sensorType: 'multisensor',
            location: loc.location,
            status: 'online',
            batteryPct: 100,
            isSimulated: true
          }
        },
        { upsert: true, returnDocument: 'after' }
      );
    }
    logger.info(`Seeded ${chamoliLocations.length} canonical Chamoli monitoring stations.`, { subsystem: 'SEED' });

    // 2. Seed Default Authority & Admin Credentials
    const defaultAccounts = [
      {
        name: 'State Disaster Management Authority (SDMA)',
        email: 'authority@floodatlas.gov.in',
        password: 'AuthoritySecure2026!',
        role: 'authority',
        assignedZoneId: 'chamoli-joshimath',
        phone: '+911372252101', // Official District Emergency Operation Centre (DEOC) Chamoli line
        preferredLanguage: 'hi',
        isActive: true
      },
      {
        name: 'System Operations Admin',
        email: 'admin@floodatlas.gov.in',
        password: 'AdminSuperPass2026!',
        role: 'admin',
        assignedZoneId: null,
        phone: '+911372252102',
        preferredLanguage: 'en',
        isActive: true
      }
    ];

    for (const acc of defaultAccounts) {
      const existing = await User.findOne({ email: acc.email });
      if (!existing) {
        await User.create(acc);
        logger.info(`Created default credential: ${acc.email} [${acc.role}]`, { subsystem: 'SEED' });
      }
    }

    logger.info('Database seeding sequence completed successfully.', { subsystem: 'SEED' });
    process.exit(0);
  } catch (err) {
    logger.error(`Seeding aborted due to fatal error: ${err.message}`, { subsystem: 'SEED' });
    process.exit(1);
  }
};

seedSystem();