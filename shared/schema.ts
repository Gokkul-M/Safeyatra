import { z } from "zod";

// User Schema
export const users = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  role: z.enum(["pilgrim", "administrator", "police", "medical", "coordinator"]),
  employeeId: z.string().optional(),
  otp: z.number().optional(),
  verified: z.boolean().default(false),
  createdAt: z.string()
});

export const insertUserSchema = users.omit({ id: true, createdAt: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = z.infer<typeof users>;

// Alert Schema
export const alerts = z.object({
  id: z.string(),
  type: z.enum(["emergency", "medical", "crowd", "missing_person", "security"]),
  status: z.enum(["active", "responding", "resolved"]),
  priority: z.enum(["low", "medium", "high", "critical"]),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
    address: z.string().optional()
  }),
  description: z.string(),
  reportedBy: z.string(),
  assignedTo: z.string().optional(),
  timestamp: z.string(),
  resolvedAt: z.string().optional()
});

export const insertAlertSchema = alerts.omit({ id: true, timestamp: true });
export type InsertAlert = z.infer<typeof insertAlertSchema>;
export type Alert = z.infer<typeof alerts>;

// Lost and Found Schema
export const lostFound = z.object({
  id: z.string(),
  name: z.string(),
  age: z.number().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  description: z.string(),
  lastSeenLocation: z.object({
    lat: z.number(),
    lng: z.number(),
    address: z.string().optional()
  }),
  status: z.enum(["missing", "found", "closed"]),
  reportedBy: z.object({
    name: z.string(),
    phone: z.string(),
    relation: z.string()
  }),
  foundBy: z.string().optional(),
  timestamp: z.string(),
  resolvedAt: z.string().optional()
});

export const insertLostFoundSchema = lostFound.omit({ id: true, timestamp: true });
export type InsertLostFound = z.infer<typeof insertLostFoundSchema>;
export type LostFound = z.infer<typeof lostFound>;

// Heatmap Schema
export const heatmaps = z.object({
  id: z.string(),
  lat: z.number(),
  lng: z.number(),
  crowdLevel: z.enum(["safe", "moderate", "crowded"]),
  capacity: z.number(),
  currentCount: z.number(),
  area: z.string(),
  timestamp: z.string()
});

export const insertHeatmapSchema = heatmaps.omit({ id: true, timestamp: true });
export type InsertHeatmap = z.infer<typeof insertHeatmapSchema>;
export type Heatmap = z.infer<typeof heatmaps>;

// Drone Schema
export const drones = z.object({
  id: z.string(),
  name: z.string(),
  status: z.enum(["active", "inactive", "maintenance", "emergency"]),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
    altitude: z.number()
  }),
  batteryLevel: z.number(),
  assignedArea: z.string(),
  lastActive: z.string()
});

export const insertDroneSchema = drones.omit({ id: true, lastActive: true });
export type InsertDrone = z.infer<typeof insertDroneSchema>;
export type Drone = z.infer<typeof drones>;

// Communication Schema
export const communication = z.object({
  id: z.string(),
  message: z.string(),
  unit: z.enum(["police", "medical", "coordinator", "administrator"]),
  userId: z.string(),
  userName: z.string(),
  priority: z.enum(["normal", "urgent"]).default("normal"),
  timestamp: z.string()
});

export const insertCommunicationSchema = communication.omit({ id: true, timestamp: true });
export type InsertCommunication = z.infer<typeof insertCommunicationSchema>;
export type Communication = z.infer<typeof communication>;

// OTP Schema
export const otpVerification = z.object({
  identifier: z.string(), // email or phone
  otp: z.string(),
  expiresAt: z.number(),
  verified: z.boolean().default(false)
});

export type OTPVerification = z.infer<typeof otpVerification>;
