import express from "express";
import cors from "cors";
import { randomUUID } from "crypto";

const app = express();

// Enable CORS for localhost development
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// In-memory storage class
class MemStorage {
  constructor() {
    this.users = new Map();
    this.otps = new Map();
    this.alerts = new Map();
    this.lostFound = new Map();
    this.heatmaps = new Map();
    this.drones = new Map();
    this.communications = new Map();
    this.initializeSampleData();
  }

  initializeSampleData() {
    // Sample heatmap data
    const sampleHeatmaps = [
      { lat: 23.1815, lng: 75.7804, crowdLevel: 'safe', capacity: 1000, currentCount: 250, area: 'Main Ghat' },
      { lat: 23.1820, lng: 75.7800, crowdLevel: 'moderate', capacity: 800, currentCount: 600, area: 'Bridge Junction' },
      { lat: 23.1810, lng: 75.7810, crowdLevel: 'crowded', capacity: 1200, currentCount: 1100, area: 'Temple Complex' },
      { lat: 23.1825, lng: 75.7795, crowdLevel: 'safe', capacity: 500, currentCount: 150, area: 'Parking Area' },
      { lat: 23.1830, lng: 75.7815, crowdLevel: 'moderate', capacity: 600, currentCount: 400, area: 'Food Court' }
    ];

    sampleHeatmaps.forEach(data => {
      const id = randomUUID();
      this.heatmaps.set(id, {
        id,
        ...data,
        timestamp: new Date().toISOString()
      });
    });

    // Sample alerts
    const sampleAlerts = [
      {
        type: 'medical',
        status: 'active',
        priority: 'high',
        location: { lat: 23.1815, lng: 75.7804, address: 'Main Ghat Area' },
        description: 'Cardiac incident reported at Main Ghat Area',
        reportedBy: 'user1'
      },
      {
        type: 'crowd',
        status: 'active',
        priority: 'medium',
        location: { lat: 23.1823, lng: 75.7798, address: 'Bridge Junction' },
        description: 'Overcrowding detected at Bridge Junction',
        reportedBy: 'system'
      }
    ];

    sampleAlerts.forEach(data => {
      const id = randomUUID();
      this.alerts.set(id, {
        id,
        ...data,
        timestamp: new Date().toISOString()
      });
    });

    // Sample Lost & Found reports
    const sampleLostFound = [
      {
        type: 'missing_person',
        name: 'Rajesh Kumar',
        age: '45',
        description: 'Wearing white kurta, black glasses',
        lastSeenLocation: 'Main Ghat Area, near Temple',
        contactInfo: 'rajesh@email.com',
        reporterName: 'Priya Kumar',
        reporterPhone: '+91-9876543210',
        additionalInfo: 'Last seen around 2 PM near the main temple',
        reportedBy: 'pilgrim_user',
        status: 'active'
      },
      {
        type: 'found_item',
        name: 'Black leather wallet',
        age: '',
        description: 'Contains ID cards and some cash',
        lastSeenLocation: 'Bridge Junction, lost and found desk',
        contactInfo: '',
        reporterName: 'Security Guard',
        reporterPhone: '+91-9876543211',
        additionalInfo: 'Found near bridge entrance, handed to security',
        reportedBy: 'security_user',
        status: 'active'
      }
    ];

    sampleLostFound.forEach(data => {
      const id = randomUUID();
      this.lostFound.set(id, {
        id,
        ...data,
        timestamp: new Date().toISOString()
      });
    });
  }

  async getUserByIdentifier(identifier) {
    return Array.from(this.users.values()).find(
      (user) => user.email === identifier || user.phone === identifier
    );
  }

  async createUser(insertUser) {
    const id = randomUUID();
    const user = { 
      ...insertUser, 
      id,
      createdAt: new Date().toISOString()
    };
    this.users.set(id, user);
    return user;
  }

  async storeOTP(identifier, otp, expiresAt) {
    this.otps.set(identifier, {
      identifier,
      otp,
      expiresAt,
      verified: false
    });
  }

  async verifyOTP(identifier, otp) {
    const stored = this.otps.get(identifier);
    if (!stored) return false;
    
    if (stored.otp === otp && Date.now() < stored.expiresAt) {
      stored.verified = true;
      return true;
    }
    return false;
  }

  async getActiveAlerts() {
    return Array.from(this.alerts.values()).filter(alert => alert.status === 'active');
  }

  async createAlert(insertAlert) {
    const id = randomUUID();
    const alert = { 
      ...insertAlert, 
      id,
      timestamp: new Date().toISOString()
    };
    this.alerts.set(id, alert);
    return alert;
  }

  async getHeatmapData() {
    return Array.from(this.heatmaps.values());
  }

  async getCommunications() {
    return Array.from(this.communications.values())
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  async createCommunication(insertMessage) {
    const id = randomUUID();
    const message = { 
      ...insertMessage, 
      id,
      timestamp: new Date().toISOString()
    };
    this.communications.set(id, message);
    return message;
  }

  async createLostFoundReport(insertReport) {
    const id = randomUUID();
    const report = { 
      ...insertReport, 
      id,
      timestamp: new Date().toISOString(),
      status: 'active'
    };
    this.lostFound.set(id, report);
    return report;
  }

  async getLostFoundReports() {
    return Array.from(this.lostFound.values())
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  async updateLostFoundStatus(id, status, notes) {
    const report = this.lostFound.get(id);
    if (report) {
      report.status = status;
      report.notes = notes;
      report.updatedAt = new Date().toISOString();
      return report;
    }
    return null;
  }

  async getOverviewStats() {
    const activeAlerts = await this.getActiveAlerts();
    const activeLostFound = Array.from(this.lostFound.values()).filter(r => r.status === 'active');
    
    return {
      totalPilgrims: 2847325,
      activeAlerts: activeAlerts.length,
      activeLostFound: activeLostFound.length,
      dronesActive: "24/28",
      responseTime: "3m 42s"
    };
  }
}

const storage = new MemStorage();

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (req.path.startsWith("/api")) {
      console.log(`${req.method} ${req.path} ${res.statusCode} in ${duration}ms`);
    }
  });
  
  next();
});

// Authentication routes
app.post("/api/auth/send-otp", async (req, res) => {
  try {
    const { identifier, type, role, employeeId } = req.body;
    
    // For demo purposes, generate a simple OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + (10 * 60 * 1000); // 10 minutes
    
    // Store OTP
    await storage.storeOTP(identifier, otp, expiresAt);
    
    // In a real app, you would send SMS/Email here
    console.log(`🔐 OTP for ${identifier}: ${otp}`);
    
    res.json({ 
      message: "OTP sent successfully", 
      otp: otp, // Include OTP in response for demo
      expiresIn: "10 minutes"
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

app.post("/api/auth/verify-otp", async (req, res) => {
  try {
    const { identifier, otp, role, employeeId } = req.body;
    
    const isValid = await storage.verifyOTP(identifier, otp);
    if (!isValid) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
    
    // Check if user exists, create if not
    let user = await storage.getUserByIdentifier(identifier);
    if (!user) {
      const userData = {
        name: role === 'pilgrim' ? 'Pilgrim User' : `${role.charAt(0).toUpperCase() + role.slice(1)} Officer`,
        role: role,
        verified: true
      };
      
      if (identifier.includes('@')) {
        userData.email = identifier;
      } else {
        userData.phone = identifier;
      }
      
      if (employeeId) {
        userData.employeeId = employeeId;
      }
      
      user = await storage.createUser(userData);
    }
    
    res.json({ 
      message: "Login successful",
      user
    });
  } catch (error) {
    res.status(500).json({ message: "Authentication failed" });
  }
});

// Pilgrim routes
app.post("/api/pilgrim/sos", async (req, res) => {
  try {
    const alertData = {
      type: 'emergency',
      status: 'active',
      priority: 'critical',
      location: req.body.location,
      description: req.body.description || 'SOS Emergency Alert',
      reportedBy: req.body.userId || 'anonymous'
    };
    
    const alert = await storage.createAlert(alertData);
    console.log(`🚨 SOS Alert Created: ${alert.description} at ${alert.location.lat}, ${alert.location.lng}`);
    res.json({ message: "SOS alert sent", alert });
  } catch (error) {
    res.status(500).json({ message: "Failed to send SOS alert" });
  }
});

app.get("/api/pilgrim/status", async (req, res) => {
  try {
    res.json({
      crowdLevel: 'safe',
      coordinates: '23.1815°N, 75.7804°E',
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to get status" });
  }
});

app.get("/api/pilgrim/heatmap", async (req, res) => {
  try {
    const heatmapData = await storage.getHeatmapData();
    res.json(heatmapData);
  } catch (error) {
    res.status(500).json({ message: "Failed to get heatmap data" });
  }
});

// Lost & Found routes
app.post("/api/pilgrim/lost-found", async (req, res) => {
  try {
    const reportData = {
      type: req.body.type, // 'missing_person' or 'found_item'
      name: req.body.name,
      description: req.body.description,
      age: req.body.age,
      lastSeenLocation: req.body.lastSeenLocation,
      contactInfo: req.body.contactInfo,
      reporterName: req.body.reporterName,
      reporterPhone: req.body.reporterPhone,
      additionalInfo: req.body.additionalInfo,
      reportedBy: req.body.userId || 'anonymous'
    };
    
    const report = await storage.createLostFoundReport(reportData);
    console.log(`📋 Lost & Found Report Created: ${report.type} - ${report.name}`);
    res.json({ message: "Report submitted successfully", report });
  } catch (error) {
    res.status(500).json({ message: "Failed to submit report" });
  }
});

app.get("/api/pilgrim/lost-found", async (req, res) => {
  try {
    const reports = await storage.getLostFoundReports();
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: "Failed to get reports" });
  }
});

// Command Center routes
app.get("/api/admin/overview", async (req, res) => {
  try {
    const stats = await storage.getOverviewStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: "Failed to get overview stats" });
  }
});

app.get("/api/admin/alerts", async (req, res) => {
  try {
    const alerts = await storage.getActiveAlerts();
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: "Failed to get alerts" });
  }
});

app.get("/api/admin/heatmap", async (req, res) => {
  try {
    const heatmapData = await storage.getHeatmapData();
    res.json(heatmapData);
  } catch (error) {
    res.status(500).json({ message: "Failed to get heatmap data" });
  }
});

app.get("/api/admin/communication", async (req, res) => {
  try {
    const messages = await storage.getCommunications();
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Failed to get communications" });
  }
});

app.post("/api/admin/communication", async (req, res) => {
  try {
    const messageData = {
      message: req.body.message,
      unit: req.body.unit,
      userId: req.body.userId,
      userName: req.body.userName,
      priority: req.body.priority || 'normal'
    };
    
    const message = await storage.createCommunication(messageData);
    res.json(message);
  } catch (error) {
    res.status(500).json({ message: "Failed to send message" });
  }
});

// Admin Lost & Found routes
app.get("/api/admin/lost-found", async (req, res) => {
  try {
    const reports = await storage.getLostFoundReports();
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: "Failed to get lost & found reports" });
  }
});

app.put("/api/admin/lost-found/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    
    const updatedReport = await storage.updateLostFoundStatus(id, status, notes);
    if (!updatedReport) {
      return res.status(404).json({ message: "Report not found" });
    }
    
    console.log(`📋 Lost & Found Updated: ${updatedReport.name} - Status: ${status}`);
    res.json(updatedReport);
  } catch (error) {
    res.status(500).json({ message: "Failed to update report" });
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "OK", 
    message: "SafeYatra Backend Server is running",
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 SafeYatra Backend Server is running!`);
  console.log(`📡 Server URL: http://localhost:${PORT}`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🔄 CORS enabled for: http://localhost:3000, http://localhost:5173`);
  console.log(`📊 Sample data loaded: ${storage.heatmaps.size} heatmap points, ${storage.alerts.size} alerts, ${storage.lostFound.size} lost & found reports\n`);
});