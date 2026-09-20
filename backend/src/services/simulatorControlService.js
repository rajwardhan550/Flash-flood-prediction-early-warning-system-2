const chamoliLocations = require('../utils/chamoliLocations');
const dataIngestionService = require('./dataIngestionService');
const logger = require('../utils/logger');
const { PROVENANCE } = require('../utils/constants');

class SimulatorControlService {
  constructor() {
    this.intervalHandle = null;
    this.isRunning = false;
    this.simulationState = new Map();
  }

  /**
   * Initializes baseline parameters for each monitored station
   */
  initBaselines() {
    chamoliLocations.forEach((loc) => {
      this.simulationState.set(loc.zoneId, {
        currentRainfall: 0.0,
        currentWaterLevel: 1.2, // normal baseflow
        currentSoilMoisture: 35.0, // base moisture %
        surgePhase: 'stable',
      });
    });
  }

  /**
   * Generates step-wise physical increments for testing dynamic ML reactions
   */
  stepSimulation(zoneId) {
    const state = this.simulationState.get(zoneId);
    if (!state) return null;

    // Physical progression pattern
    if (state.surgePhase === 'rising') {
      state.currentRainfall = Math.min(state.currentRainfall + 4.5, 85.0);
      state.currentWaterLevel = Math.min(state.currentWaterLevel + 0.35, 6.5);
      state.currentSoilMoisture = Math.min(state.currentSoilMoisture + 2.5, 92.0);
      if (state.currentWaterLevel >= 5.0) state.surgePhase = 'receding';
    } else if (state.surgePhase === 'receding') {
      state.currentRainfall = Math.max(state.currentRainfall - 5.0, 0.0);
      state.currentWaterLevel = Math.max(state.currentWaterLevel - 0.2, 1.2);
      state.currentSoilMoisture = Math.max(state.currentSoilMoisture - 1.5, 40.0);
      if (state.currentWaterLevel <= 1.5) state.surgePhase = 'stable';
    } else {
      // Stable conditions with minor physical variance
      state.currentRainfall = Math.max(0, state.currentRainfall);
      state.currentWaterLevel = Number((1.2 + (state.currentRainfall > 0 ? 0.3 : 0)).toFixed(2));
      state.currentSoilMoisture = 38.0;
    }

    return {
      rainfall_mm: Number(state.currentRainfall.toFixed(1)),
      water_level_m: Number(state.currentWaterLevel.toFixed(2)),
      soil_moisture_pct: Number(state.currentSoilMoisture.toFixed(1)),
      water_level_rate_of_rise_m_h: state.surgePhase === 'rising' ? 0.35 : 0.0,
    };
  }

  /**
   * Forces a surge scenario for testing high-risk and evacuation triggers
   */
  triggerSurge(zoneId) {
    const state = this.simulationState.get(zoneId);
    if (state) {
      state.surgePhase = 'rising';
      logger.warn(`Surge phase activated manually for zone: ${zoneId}`, { subsystem: 'SIMULATOR' });
      return true;
    }
    return false;
  }

  start(intervalMs = 15000) {
    if (this.isRunning) return;
    this.initBaselines();
    this.isRunning = true;

    logger.info(`IoT Simulation loop started (Interval: ${intervalMs}ms)`, { subsystem: 'SIMULATOR' });

    this.intervalHandle = setInterval(async () => {
      for (const loc of chamoliLocations) {
        const telemetry = this.stepSimulation(loc.zoneId);
        if (!telemetry) continue;

        try {
          await dataIngestionService.ingestReading({
            sensorId: `SIM-${loc.zoneId.toUpperCase()}`,
            zoneId: loc.zoneId,
            rainfall_mm: telemetry.rainfall_mm,
            water_level_m: telemetry.water_level_m,
            soil_moisture_pct: telemetry.soil_moisture_pct,
            temperature_c: 18.5,
            humidity_pct: 75.0,
            water_level_rate_of_rise_m_h: telemetry.water_level_rate_of_rise_m_h,
            provenance: PROVENANCE.SIMULATED,
            batteryPct: 98,
            recordedAt: new Date(),
          });
        } catch (err) {
          logger.error(`Simulation ingestion error for ${loc.zoneId}: ${err.message}`, {
            subsystem: 'SIMULATOR',
          });
        }
      }
    }, intervalMs);
  }

  stop() {
    if (this.intervalHandle) {
      clearInterval(this.intervalHandle);
      this.intervalHandle = null;
    }
    this.isRunning = false;
    logger.info('IoT Simulation loop stopped.', { subsystem: 'SIMULATOR' });
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      zonesTracked: Array.from(this.simulationState.keys()),
    };
  }
}

module.exports = new SimulatorControlService();