const { Server } = require('socket.io');
const logger = require('../utils/logger');
const { SOCKET_EVENTS } = require('../utils/constants');

class SocketHandler {
  constructor() {
    this.io = null;
  }

  /**
   * Initializes the Socket.IO instance on top of the native HTTP server
   */
  init(httpServer, corsOptions) {
    this.io = new Server(httpServer, {
      cors: corsOptions,
      pingTimeout: 30000,
      pingInterval: 25000,
    });

    this.io.on('connection', (socket) => {
      logger.info(`Client connected to WebSocket: ${socket.id}`, { subsystem: 'WEBSOCKET' });

      // Join a specific zone's hyper-local update channel
      socket.on('join:zone', (zoneId) => {
        if (zoneId) {
          socket.join(`zone:${zoneId}`);
          logger.debug(`Socket ${socket.id} joined room: zone:${zoneId}`, { subsystem: 'WEBSOCKET' });
        }
      });

      // Leave a specific zone's channel
      socket.on('leave:zone', (zoneId) => {
        if (zoneId) {
          socket.leave(`zone:${zoneId}`);
          logger.debug(`Socket ${socket.id} left room: zone:${zoneId}`, { subsystem: 'WEBSOCKET' });
        }
      });

      // Join operational authority room
      socket.on('join:authority', () => {
        socket.join('authority:operations');
        logger.debug(`Socket ${socket.id} joined authority room`, { subsystem: 'WEBSOCKET' });
      });

      socket.on('disconnect', (reason) => {
        logger.info(`Socket disconnected: ${socket.id} | Reason: ${reason}`, { subsystem: 'WEBSOCKET' });
      });
    });

    return this.io;
  }

  /**
   * Broadcasts raw telemetry packet to subscribers
   */
  broadcastTelemetry(zoneId, telemetryData) {
    if (!this.io) return;
    this.io.to(`zone:${zoneId}`).emit(SOCKET_EVENTS.TELEMETRY_UPDATE, telemetryData);
    this.io.to('authority:operations').emit(SOCKET_EVENTS.TELEMETRY_UPDATE, telemetryData);
  }

  /**
   * Broadcasts authoritative risk score to subscribers
   */
  broadcastRiskUpdate(zoneId, riskPayload) {
    if (!this.io) return;
    // Broadcast to location channel
    this.io.to(`zone:${zoneId}`).emit(SOCKET_EVENTS.RISK_UPDATE, riskPayload);
    // Broadcast to global authority monitoring
    this.io.to('authority:operations').emit(SOCKET_EVENTS.RISK_UPDATE, riskPayload);
    // Global broadcast for map visual sync
    this.io.emit('map:risk_update', riskPayload);
  }

  /**
   * Broadcasts critical alerts to all connected clients
   */
  broadcastAlert(alertDoc) {
    if (!this.io) return;
    this.io.emit(SOCKET_EVENTS.ALERT_TRIGGERED, alertDoc);
  }

  /**
   * Broadcasts alert resolution status
   */
  broadcastAlertResolved(alertDoc) {
    if (!this.io) return;
    this.io.emit(SOCKET_EVENTS.ALERT_RESOLVED, alertDoc);
  }

  /**
   * Broadcasts system heartbeat and health telemetry
   */
  broadcastSystemHealth(healthData) {
    if (!this.io) return;
    this.io.to('authority:operations').emit(SOCKET_EVENTS.SYSTEM_HEALTH, healthData);
  }
}

module.exports = new SocketHandler();