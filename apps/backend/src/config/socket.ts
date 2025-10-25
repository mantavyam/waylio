import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { jwtUtils } from '../utils/jwt.js';
import { env } from './env.js';

let io: SocketIOServer;

export function initializeSocket(httpServer: HTTPServer): SocketIOServer {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: env.CORS_ORIGIN,
      credentials: true,
    },
  });

  // Authentication middleware for socket connections
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication required'));
    }

    try {
      const payload = jwtUtils.verifyAccessToken(token);
      socket.data.user = payload;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const user = socket.data.user;
    console.log(`✅ Socket connected: ${user.email} (${user.role})`);

    // Join role-specific room
    socket.join(`role:${user.role}`);
    
    // Join user-specific room
    socket.join(`user:${user.userId}`);

    // For doctors, join doctor-specific room
    if (user.role === 'DOCTOR') {
      socket.join(`doctor:${user.userId}`);
    }

    socket.on('disconnect', () => {
      console.log(`❌ Socket disconnected: ${user.email}`);
    });
  });

  console.log('✅ Socket.IO initialized');
  return io;
}

export function getIO(): SocketIOServer {
  if (!io) {
    throw new Error('Socket.IO not initialized');
  }
  return io;
}

// Event emitters for different events
export const socketEvents = {
  // Queue events
  emitQueueUpdate(doctorId: string, queueData: any) {
    io.to(`doctor:${doctorId}`).emit('queue:update', queueData);
  },

  emitPatientQueuePosition(patientId: string, position: number, estimatedWait: number) {
    io.to(`user:${patientId}`).emit('queue:position', { position, estimatedWait });
  },

  // Appointment events
  emitAppointmentStatusChange(userId: string, appointmentData: any) {
    io.to(`user:${userId}`).emit('appointment:status', appointmentData);
  },

  // Prescription events
  emitNewPrescription(patientId: string, prescriptionData: any) {
    io.to(`user:${patientId}`).emit('prescription:new', prescriptionData);
  },

  // Parking events
  emitParkingOccupancy(occupancyData: any) {
    io.to('role:ADMIN').to('role:RECEPTION').emit('parking:occupancy', occupancyData);
  },

  // General notification
  emitNotification(userId: string, notification: any) {
    io.to(`user:${userId}`).emit('notification', notification);
  },
};

