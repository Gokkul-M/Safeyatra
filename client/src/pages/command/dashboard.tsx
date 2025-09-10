import React, { useState, useEffect } from 'react';
import { LogOut, Users, AlertTriangle, Plane, Clock, TrendingUp, TrendingDown, Send, X, MapPin, Navigation, MessageCircle, Radio, Shield, Search, User, Phone, Mail, Eye, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

// Lost & Found Management Component
const LostFoundManagement = () => {
  const [lostFoundReports, setLostFoundReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState({ status: '', notes: '' });
  const [isUpdating, setIsUpdating] = useState(false);
  const [filter, setFilter] = useState('all');

  // Fetch Lost & Found reports
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch('/api/admin/lost-found');
        if (response.ok) {
          const reports = await response.json();
          setLostFoundReports(reports);
        } else {
          console.error('Failed to fetch reports');
          // Fallback to mock data for demo
          setLostFoundReports([
            {
              id: 'report_1',
              type: 'missing_person',
              name: 'Rajesh Kumar',
              age: '45',
              description: 'Wearing white kurta, black glasses, approximately 5\'6" height',
              lastSeenLocation: 'Main Ghat Area, near Temple entrance',
              contactInfo: 'rajesh@email.com',
              reporterName: 'Priya Kumar',
              reporterPhone: '+91-9876543210',
              additionalInfo: 'Last seen around 2 PM near the main temple. Was carrying a brown bag.',
              reportedBy: 'pilgrim_user',
              status: 'active',
              timestamp: new Date(Date.now() - 30 * 60000).toISOString()
            },
            {
              id: 'report_2',
              type: 'found_item',
              name: 'Black leather wallet',
              age: '',
              description: 'Contains ID cards, some cash, and credit cards. Brand: Titan',
              lastSeenLocation: 'Bridge Junction, near lost and found desk',
              contactInfo: '',
              reporterName: 'Security Guard Mohan',
              reporterPhone: '+91-9876543211',
              additionalInfo: 'Found near bridge entrance, handed to security. Contains Aadhar card of "Suresh Patel"',
              reportedBy: 'security_user',
              status: 'active',
              timestamp: new Date(Date.now() - 45 * 60000).toISOString()
            },
            {
              id: 'report_3',
              type: 'missing_person',
              name: 'Anita Sharma',
              age: '8',
              description: 'Child wearing red dress, has a small mole on left cheek',
              lastSeenLocation: 'Food court area, near stall number 15',
              contactInfo: 'sharma.family@email.com',
              reporterName: 'Vikram Sharma',
              reporterPhone: '+91-9876543212',
              additionalInfo: 'Got separated from family during rush hour. Very shy, might be scared.',
              reportedBy: 'pilgrim_user',
              status: 'in_progress',
              timestamp: new Date(Date.now() - 15 * 60000).toISOString()
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching reports:', error);
        // Fallback to mock data
        setLostFoundReports([
          {
            id: 'report_1',
            type: 'missing_person',
            name: 'Rajesh Kumar',
            age: '45',
            description: 'Wearing white kurta, black glasses, approximately 5\'6" height',
            lastSeenLocation: 'Main Ghat Area, near Temple entrance',
            contactInfo: 'rajesh@email.com',
            reporterName: 'Priya Kumar',
            reporterPhone: '+91-9876543210',
            additionalInfo: 'Last seen around 2 PM near the main temple. Was carrying a brown bag.',
            reportedBy: 'pilgrim_user',
            status: 'active',
            timestamp: new Date(Date.now() - 30 * 60000).toISOString()
          },
          {
            id: 'report_2',
            type: 'found_item',
            name: 'Black leather wallet',
            age: '',
            description: 'Contains ID cards, some cash, and credit cards. Brand: Titan',
            lastSeenLocation: 'Bridge Junction, near lost and found desk',
            contactInfo: '',
            reporterName: 'Security Guard Mohan',
            reporterPhone: '+91-9876543211',
            additionalInfo: 'Found near bridge entrance, handed to security. Contains Aadhar card of "Suresh Patel"',
            reportedBy: 'security_user',
            status: 'active',
            timestamp: new Date(Date.now() - 45 * 60000).toISOString()
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
    
    // Set up polling for real-time updates every 5 seconds
    const interval = setInterval(fetchReports, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusUpdate = async (reportId) => {
    if (!statusUpdate.status) return;
    
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/admin/lost-found/${reportId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(statusUpdate)
      });

      if (response.ok) {
        const updatedReport = await response.json();
        setLostFoundReports(prev => 
          prev.map(report => 
            report.id === reportId ? updatedReport : report
          )
        );
        setSelectedReport(null);
        setStatusUpdate({ status: '', notes: '' });
      } else {
        console.error('Failed to update report');
        // Mock update for demo
        setLostFoundReports(prev => 
          prev.map(report => 
            report.id === reportId ? { ...report, status: statusUpdate.status, notes: statusUpdate.notes, updatedAt: new Date().toISOString() } : report
          )
        );
        setSelectedReport(null);
        setStatusUpdate({ status: '', notes: '' });
      }
    } catch (error) {
      console.error('Error updating report:', error);
      // Mock update for demo
      setLostFoundReports(prev => 
        prev.map(report => 
          report.id === reportId ? { ...report, status: statusUpdate.status, notes: statusUpdate.notes, updatedAt: new Date().toISOString() } : report
        )
      );
      setSelectedReport(null);
      setStatusUpdate({ status: '', notes: '' });
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-red-100 text-red-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getTypeIcon = (type) => {
    return type === 'missing_person' ? <User className="w-4 h-4" /> : <Search className="w-4 h-4" />;
  };

  const getTimeAgo = (timestamp) => {
    const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const filteredReports = lostFoundReports.filter(report => {
    if (filter === 'all') return true;
    if (filter === 'missing_person') return report.type === 'missing_person';
    if (filter === 'found_item') return report.type === 'found_item';
    if (filter === 'active') return report.status === 'active';
    if (filter === 'resolved') return report.status === 'resolved';
    return true;
  });

  return (
    <>
      <Card>
        <CardContent className="p-0">
          <div className="px-6 py-4 border-b border-border">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Lost & Found Management</h3>
              <div className="flex items-center space-x-4">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-3 py-1 border border-border rounded-lg text-sm"
                >
                  <option value="all">All Reports ({lostFoundReports.length})</option>
                  <option value="missing_person">Missing Persons ({lostFoundReports.filter(r => r.type === 'missing_person').length})</option>
                  <option value="found_item">Found Items ({lostFoundReports.filter(r => r.type === 'found_item').length})</option>
                  <option value="active">Active ({lostFoundReports.filter(r => r.status === 'active').length})</option>
                  <option value="resolved">Resolved ({lostFoundReports.filter(r => r.status === 'resolved').length})</option>
                </select>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Live Updates</span>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-3"></div>
              <span className="text-muted-foreground">Loading reports...</span>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Search className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p className="font-medium">No reports found</p>
              <p className="text-sm">All Lost & Found reports will appear here</p>
            </div>
          ) : (
            <div className="divide-y divide-border max-h-96 overflow-y-auto">
              {filteredReports.map((report) => (
                <div key={report.id} className="px-6 py-4 hover:bg-accent/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className={`w-10 h-10 ${
                        report.type === 'missing_person' ? 'bg-red-500' : 'bg-blue-500'
                      } rounded-lg flex items-center justify-center text-white`}>
                        {getTypeIcon(report.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-medium text-foreground">
                            {report.name}
                            {report.age && <span className="text-muted-foreground ml-1">({report.age} years)</span>}
                          </h4>
                          <Badge className={getStatusColor(report.status)}>
                            {report.status.replace('_', ' ')}
                          </Badge>
                          <span className="text-xs text-muted-foreground capitalize">
                            {report.type.replace('_', ' ')}
                          </span>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                          {report.description}
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-muted-foreground">
                          {report.lastSeenLocation && (
                            <div className="flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              <span>Last seen: {report.lastSeenLocation}</span>
                            </div>
                          )}
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            <span>Reported: {getTimeAgo(report.timestamp)}</span>
                          </div>
                          {report.reporterName && (
                            <div className="flex items-center">
                              <User className="w-3 h-3 mr-1" />
                              <span>Reporter: {report.reporterName}</span>
                            </div>
                          )}
                          {report.reporterPhone && (
                            <div className="flex items-center">
                              <Phone className="w-3 h-3 mr-1" />
                              <span>{report.reporterPhone}</span>
                            </div>
                          )}
                        </div>
                        
                        {report.additionalInfo && (
                          <div className="mt-2 p-2 bg-muted/50 rounded text-xs">
                            <span className="font-medium">Additional Info:</span> {report.additionalInfo}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedReport(report)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      {report.status === 'active' && (
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedReport(report);
                            setStatusUpdate({ status: 'in_progress', notes: '' });
                          }}
                        >
                          Update
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Report Details Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 ${
                  selectedReport.type === 'missing_person' ? 'bg-red-500' : 'bg-blue-500'
                } rounded-lg flex items-center justify-center text-white`}>
                  {getTypeIcon(selectedReport.type)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{selectedReport.name}</h3>
                  <p className="text-sm text-muted-foreground capitalize">
                    {selectedReport.type.replace('_', ' ')} Report
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedReport(null);
                  setStatusUpdate({ status: '', notes: '' });
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Status and Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <Badge className={`${getStatusColor(selectedReport.status)} mt-1`}>
                    {selectedReport.status.replace('_', ' ')}
                  </Badge>
                </div>
                {selectedReport.age && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Age</label>
                    <p className="text-sm font-medium">{selectedReport.age} years</p>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-medium text-muted-foreground">Description</label>
                <p className="text-sm mt-1 p-3 bg-muted/50 rounded-lg">{selectedReport.description}</p>
              </div>

              {/* Location and Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedReport.lastSeenLocation && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      {selectedReport.type === 'missing_person' ? 'Last Seen Location' : 'Found Location'}
                    </label>
                    <p className="text-sm mt-1">{selectedReport.lastSeenLocation}</p>
                  </div>
                )}
                {selectedReport.contactInfo && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Contact Info</label>
                    <p className="text-sm mt-1">{selectedReport.contactInfo}</p>
                  </div>
                )}
              </div>

              {/* Reporter Information */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <label className="text-sm font-medium text-blue-900">Reporter Information</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div>
                    <span className="text-xs text-blue-700">Name:</span>
                    <p className="text-sm font-medium text-blue-900">{selectedReport.reporterName}</p>
                  </div>
                  {selectedReport.reporterPhone && (
                    <div>
                      <span className="text-xs text-blue-700">Phone:</span>
                      <p className="text-sm font-medium text-blue-900">{selectedReport.reporterPhone}</p>
                    </div>
                  )}
                </div>
                <div className="mt-2">
                  <span className="text-xs text-blue-700">Reported:</span>
                  <p className="text-sm text-blue-800">
                    {new Date(selectedReport.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Additional Information */}
              {selectedReport.additionalInfo && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Additional Information</label>
                  <p className="text-sm mt-1 p-3 bg-muted/50 rounded-lg">{selectedReport.additionalInfo}</p>
                </div>
              )}

              {/* Status Update Section */}
              {selectedReport.status !== 'resolved' && (
                <div className="border-t border-border pt-6">
                  <h4 className="font-medium mb-4">Update Report Status</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">New Status</label>
                      <select
                        value={statusUpdate.status}
                        onChange={(e) => setStatusUpdate({ ...statusUpdate, status: e.target.value })}
                        className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm"
                      >
                        <option value="">Select Status</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Notes</label>
                      <textarea
                        value={statusUpdate.notes}
                        onChange={(e) => setStatusUpdate({ ...statusUpdate, notes: e.target.value })}
                        placeholder="Add notes about the status update..."
                        className="w-full mt-1 px-3 py-2 border border-border rounded-lg text-sm h-20 resize-none"
                      />
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleStatusUpdate(selectedReport.id)}
                        disabled={!statusUpdate.status || isUpdating}
                        className="flex-1"
                      >
                        {isUpdating ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Updating...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Update Status
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Mock Communication Feed Component
const CommunicationFeed = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      user: 'Security Team Alpha',
      message: 'Crowd movement detected at Main Ghat. Deploying additional units.',
      timestamp: new Date(Date.now() - 2 * 60000),
      type: 'security'
    },
    {
      id: 2,
      user: 'Medical Unit 3',
      message: 'Patient stabilized and transferred to base hospital.',
      timestamp: new Date(Date.now() - 5 * 60000),
      type: 'medical'
    },
    {
      id: 3,
      user: 'Drone Operator 1',
      message: 'AeroRover-X2 reporting normal patrol status in Sector 4.',
      timestamp: new Date(Date.now() - 8 * 60000),
      type: 'drone'
    }
  ]);

  const [newMessage, setNewMessage] = useState('');

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        user: 'Command Center',
        message: newMessage,
        timestamp: new Date(),
        type: 'command'
      };
      setMessages([message, ...messages]);
      setNewMessage('');
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <Radio className="w-5 h-5 mr-2" />
            Team Communication
          </h3>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live Feed</span>
          </div>
        </div>
        
        <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
          {messages.map((msg) => (
            <div key={msg.id} className="p-3 bg-muted rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">{msg.user}</span>
                <span className="text-xs text-muted-foreground">
                  {msg.timestamp.toLocaleTimeString()}
                </span>
              </div>
              <p className="text-sm text-foreground">{msg.message}</p>
            </div>
          ))}
        </div>
        
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Send message to teams..."
            className="flex-1 px-3 py-2 border rounded-lg text-sm"
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <Button size="sm" onClick={sendMessage}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default function CommandDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [responseModal, setResponseModal] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [responses, setResponses] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Location and heatmap state
  const [location, setLocation] = useState({
    lat: null,
    lng: null,
    accuracy: null,
    lastUpdated: null
  });
  const [locationError, setLocationError] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [heatmapData, setHeatmapData] = useState([]);
  const [lastHeatmapUpdate, setLastHeatmapUpdate] = useState(new Date());

  // Mock user data
  const user = {
    name: 'Command Administrator',
    role: 'administrator',
    employeeId: 'CMD001'
  };

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Get command center's current location for monitoring
  useEffect(() => {
    let watchId;

    const getLocation = () => {
      if ('geolocation' in navigator) {
        const options = {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0
        };

        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              accuracy: Math.round(position.coords.accuracy),
              lastUpdated: new Date()
            });
            setLocationError(null);
            setIsLoadingLocation(false);
            console.log('Command Center Location:', position.coords.latitude, position.coords.longitude);
          },
          (error) => {
            console.error('Initial geolocation error:', error);
            setLocationError(error.message);
            setIsLoadingLocation(false);
          },
          options
        );

        watchId = navigator.geolocation.watchPosition(
          (position) => {
            setLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              accuracy: Math.round(position.coords.accuracy),
              lastUpdated: new Date()
            });
            setLocationError(null);
            setIsLoadingLocation(false);
          },
          (error) => {
            console.error('Watch geolocation error:', error);
            setLocationError(error.message);
            setIsLoadingLocation(false);
          },
          options
        );
      } else {
        setLocationError('Geolocation not supported by this browser');
        setIsLoadingLocation(false);
      }
    };

    getLocation();

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  // Generate realistic heatmap data around command center location
  useEffect(() => {
    if (location.lat && location.lng) {
      const generateHeatmapData = () => {
        const points = [];
        const baseRadius = 0.015;
        const numPoints = 25 + Math.floor(Math.random() * 15);
        
        for (let i = 0; i < numPoints; i++) {
          const angle = Math.random() * 2 * Math.PI;
          const distance = Math.random() * baseRadius;
          
          const lat = location.lat + (distance * Math.cos(angle));
          const lng = location.lng + (distance * Math.sin(angle));
          
          let intensity;
          const distanceFromCenter = Math.sqrt(Math.pow(lat - location.lat, 2) + Math.pow(lng - location.lng, 2));
          
          if (distanceFromCenter < baseRadius * 0.2) {
            intensity = Math.random() < 0.7 ? 'high' : 'medium';
          } else if (distanceFromCenter < baseRadius * 0.5) {
            intensity = Math.random() < 0.6 ? 'medium' : Math.random() < 0.7 ? 'low' : 'high';
          } else {
            intensity = Math.random() < 0.8 ? 'low' : 'medium';
          }
          
          points.push({
            id: `cmd_point_${i}`,
            lat,
            lng,
            intensity,
            population: intensity === 'high' ? 200 + Math.floor(Math.random() * 400) : 
                       intensity === 'medium' ? 75 + Math.floor(Math.random() * 125) : 
                       15 + Math.floor(Math.random() * 60),
            lastUpdated: new Date(),
            sector: `Sector ${Math.floor(i / 5) + 1}`
          });
        }
        
        setHeatmapData(points);
        setLastHeatmapUpdate(new Date());
      };

      generateHeatmapData();
      
      const heatmapInterval = setInterval(() => {
        setHeatmapData(prevData => 
          prevData.map(point => {
            if (Math.random() < 0.4) {
              const newPopulation = point.intensity === 'high' ? 200 + Math.floor(Math.random() * 400) : 
                                  point.intensity === 'medium' ? 75 + Math.floor(Math.random() * 125) : 
                                  15 + Math.floor(Math.random() * 60);
              
              let newIntensity = point.intensity;
              if (newPopulation > 300) newIntensity = 'high';
              else if (newPopulation > 100) newIntensity = 'medium';
              else newIntensity = 'low';
              
              return {
                ...point,
                intensity: newIntensity,
                population: newPopulation,
                lastUpdated: new Date()
              };
            }
            return point;
          })
        );
        setLastHeatmapUpdate(new Date());
      }, 15000);

      return () => clearInterval(heatmapInterval);
    }
  }, [location.lat, location.lng]);

  // Mock alerts data
  const mockAlerts = [
    {
      id: 'alert_001',
      type: 'medical',
      priority: 'high',
      description: 'Cardiac incident reported at Main Ghat Area',
      location: { lat: 23.1815, lng: 75.7804 },
      timestamp: new Date(Date.now() - 3 * 60000).toISOString(),
      status: 'active'
    },
    {
      id: 'alert_002',
      type: 'crowd',
      priority: 'medium',
      description: 'Overcrowding detected at Bridge Junction',
      location: { lat: 23.1823, lng: 75.7798 },
      timestamp: new Date(Date.now() - 7 * 60000).toISOString(),
      status: 'active'
    },
    {
      id: 'alert_003',
      type: 'missing_person',
      priority: 'high',
      description: 'Child separated from family near Temple Complex',
      location: { lat: 23.1810, lng: 75.7812 },
      timestamp: new Date(Date.now() - 12 * 60000).toISOString(),
      status: 'active'
    }
  ];

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour12: false
    }) + ' IST';
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatCoordinate = (coord) => {
    return coord ? coord.toFixed(6) : '0.000000';
  };

  const getTimeAgo = (date) => {
    if (!date) return 'Never';
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  const getIntensityColor = (intensity) => {
    switch (intensity) {
      case 'low': return '#22c55e';
      case 'medium': return '#f59e0b';
      case 'high': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getIntensitySize = (intensity) => {
    switch (intensity) {
      case 'low': return 8;
      case 'medium': return 12;
      case 'high': return 16;
      default: return 8;
    }
  };

  const getCurrentOverallCrowdLevel = () => {
    if (!heatmapData.length) return 'Low';
    
    const highIntensity = heatmapData.filter(p => p.intensity === 'high').length;
    const mediumIntensity = heatmapData.filter(p => p.intensity === 'medium').length;
    const totalPoints = heatmapData.length;
    
    const highPercentage = (highIntensity / totalPoints) * 100;
    const mediumPercentage = (mediumIntensity / totalPoints) * 100;
    
    if (highPercentage > 25) return 'Critical';
    if (highPercentage > 15 || mediumPercentage > 40) return 'High';
    if (mediumPercentage > 20) return 'Medium';
    return 'Low';
  };

  const getSecondsUntilUpdate = () => {
    if (!lastHeatmapUpdate) return 15;
    const elapsed = Math.floor((new Date() - lastHeatmapUpdate) / 1000);
    return Math.max(0, 15 - elapsed);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical':
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-orange-500';
      case 'low':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'medical':
      case 'emergency':
        return <AlertTriangle className="text-white" />;
      case 'crowd':
        return <Users className="text-white" />;
      case 'missing_person':
        return <Users className="text-white" />;
      default:
        return <AlertTriangle className="text-white" />;
    }
  };

  const handleLogout = () => {
    console.log('Logout clicked');
  };

  const handleRespond = (alert) => {
    setResponseModal(alert);
    setResponseText('');
  };

  const handleSubmitResponse = async () => {
    if (!responseText.trim()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response = {
        id: `response_${Date.now()}`,
        alertId: responseModal.id,
        message: responseText,
        timestamp: new Date().toISOString(),
        responderId: user?.employeeId || 'CMD001',
        responderName: user?.name || 'Command Administrator'
      };
      
      setResponses(prev => ({
        ...prev,
        [responseModal.id]: response
      }));

      setResponseModal(null);
      setResponseText('');
    } catch (error) {
      console.error('Response error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getResponseTemplate = (alertType) => {
    switch (alertType) {
      case 'medical':
        return 'Medical team has been dispatched to your location. Please remain calm and stay where you are. Help is on the way.';
      case 'crowd':
        return 'We are aware of the crowd situation. Please follow alternate routes and maintain distance. Additional security deployed.';
      case 'missing_person':
        return 'Security team is actively searching for the missing person. Please check nearby help desks and stay in the area.';
      default:
        return 'Your alert has been received. Our team is responding to the situation.';
    }
  };

  const currentAlerts = mockAlerts;
  const dynamicOverallCrowdLevel = getCurrentOverallCrowdLevel();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="text-white h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">SafeYatra Command Center</h1>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span className="capitalize">{user?.role || 'Administrator'}</span>
                  <span>•</span>
                  <span>ID: {user?.employeeId || 'CMD001'}</span>
                  <span>•</span>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Online</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right text-sm">
                <div className="font-medium text-foreground">{formatTime(currentTime)}</div>
                <div className="text-muted-foreground">{formatDate(currentTime)}</div>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="px-6 py-6 bg-muted/50">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Overall Crowd Level</p>
                  <p className={`text-2xl font-bold ${
                    dynamicOverallCrowdLevel === 'Critical' ? 'text-red-600' :
                    dynamicOverallCrowdLevel === 'High' ? 'text-orange-600' :
                    dynamicOverallCrowdLevel === 'Medium' ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>
                    {dynamicOverallCrowdLevel}
                  </p>
                </div>
                <div className={`w-12 h-12 ${
                  dynamicOverallCrowdLevel === 'Critical' ? 'bg-red-500' :
                  dynamicOverallCrowdLevel === 'High' ? 'bg-orange-500' :
                  dynamicOverallCrowdLevel === 'Medium' ? 'bg-yellow-500' :
                  'bg-green-500'
                } rounded-lg flex items-center justify-center`}>
                  <Users className="text-white" />
                </div>
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                Based on {heatmapData.length} monitoring points
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Active Alerts</p>
                  <p className="text-2xl font-bold text-red-600">
                    {currentAlerts?.length || 3}
                  </p>
                </div>
                <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="text-white" />
                </div>
              </div>
              <div className="mt-2 text-sm text-red-600 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                +2 in last hour
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Drones Active</p>
                  <p className="text-2xl font-bold text-foreground">24/28</p>
                </div>
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                  <Plane className="text-white" />
                </div>
              </div>
              <div className="mt-2 text-sm text-green-600 flex items-center">
                <span>85.7% operational</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm">Avg Response Time</p>
                  <p className="text-2xl font-bold text-foreground">3m 42s</p>
                </div>
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <Clock className="text-white" />
                </div>
              </div>
              <div className="mt-2 text-sm text-green-600 flex items-center">
                <TrendingDown className="w-4 h-4 mr-1" />
                -18s from target
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="px-6 py-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="alerts">Live Alerts</TabsTrigger>
            <TabsTrigger value="heatmap">Crowd Heatmap</TabsTrigger>
            <TabsTrigger value="drones">AeroRover-X</TabsTrigger>
            <TabsTrigger value="lostfound">Lost & Found</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Command Center Location Status */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 text-gray-600 mr-2" />
                      <h3 className="font-semibold text-gray-900">Command Center Location</h3>
                    </div>
                    {isLoadingLocation && (
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-blue-600">Locating...</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    {locationError ? (
                      <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                        <div className="flex items-center mb-2">
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          <span className="font-medium">Location Error</span>
                        </div>
                        <p className="text-sm">{locationError}</p>
                        <p className="text-xs mt-1 text-red-500">
                          Please enable location services for accurate monitoring
                        </p>
                      </div>
                    ) : !location.lat ? (
                      <div className="text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                          <span>Getting command center location...</span>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="text-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Latitude:</span>
                            <span className="font-mono text-foreground">{formatCoordinate(location.lat)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Longitude:</span>
                            <span className="font-mono text-foreground">{formatCoordinate(location.lng)}</span>
                          </div>
                          {location.accuracy && (
                            <div className="flex justify-between items-center">
                              <span className="text-muted-foreground">Accuracy:</span>
                              <span className="text-sm text-muted-foreground">±{location.accuracy}m</span>
                            </div>
                          )}
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">Last Update:</span>
                            <span className="text-sm text-muted-foreground">{getTimeAgo(location.lastUpdated)}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Live Heatmap */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Live Crowd Heatmap</h3>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span>Updated {getTimeAgo(lastHeatmapUpdate)}</span>
                    </div>
                  </div>
                  
                  {/* Interactive Heatmap */}
                  <div className="bg-gray-100 rounded-lg h-80 mb-4 relative overflow-hidden">
                    {locationError ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center text-muted-foreground">
                          <MapPin className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                          <p className="font-medium">Location Access Required</p>
                          <p className="text-sm">Please enable GPS for heatmap</p>
                        </div>
                      </div>
                    ) : !location.lat ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center text-muted-foreground">
                          <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                          <p className="font-medium">Loading Heatmap...</p>
                          <p className="text-sm">Analyzing crowd density</p>
                        </div>
                      </div>
                    ) : (
                      <div className="relative w-full h-full bg-gradient-to-br from-blue-50 to-green-50">
                        {/* Base Map Background */}
                        <div className="absolute inset-0 opacity-30">
                          <iframe
                            src={`https://www.openstreetmap.org/export/embed.html?bbox=${location.lng-0.015}%2C${location.lat-0.015}%2C${location.lng+0.015}%2C${location.lat+0.015}&layer=mapnik`}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            className="rounded-lg"
                            title="Command Center Heatmap"
                          />
                        </div>
                        
                        {/* Heatmap Overlay */}
                        <div className="absolute inset-0 rounded-lg">
                          <svg width="100%" height="100%" className="rounded-lg">
                            {/* Command Center location */}
                            <circle
                              cx="50%"
                              cy="50%"
                              r="8"
                              fill="#1d4ed8"
                              stroke="white"
                              strokeWidth="3"
                              className="animate-pulse"
                            />
                            <text
                              x="50%"
                              y="44%"
                              textAnchor="middle"
                              className="text-xs font-bold fill-white"
                              style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}
                            >
                              COMMAND
                            </text>
                            
                            {/* Crowd density points */}
                            {heatmapData.map((point, index) => {
                              const xPercent = 50 + ((point.lng - location.lng) / 0.03) * 100;
                              const yPercent = 50 - ((point.lat - location.lat) / 0.03) * 100;
                              
                              if (xPercent >= 0 && xPercent <= 100 && yPercent >= 0 && yPercent <= 100) {
                                return (
                                  <g key={point.id}>
                                    {point.intensity === 'high' && (
                                      <circle
                                        cx={`${xPercent}%`}
                                        cy={`${yPercent}%`}
                                        r={getIntensitySize(point.intensity) + 10}
                                        fill={getIntensityColor(point.intensity)}
                                        opacity="0.2"
                                        className="animate-pulse"
                                      />
                                    )}
                                    
                                    <circle
                                      cx={`${xPercent}%`}
                                      cy={`${yPercent}%`}
                                      r={getIntensitySize(point.intensity)}
                                      fill={getIntensityColor(point.intensity)}
                                      opacity="0.7"
                                      stroke="white"
                                      strokeWidth="1"
                                    />
                                    
                                    {(point.intensity === 'medium' || point.intensity === 'high') && (
                                      <text
                                        x={`${xPercent}%`}
                                        y={`${yPercent + 1}%`}
                                        textAnchor="middle"
                                        className="text-xs font-bold fill-white"
                                        style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}
                                      >
                                        {point.population}
                                      </text>
                                    )}
                                  </g>
                                );
                              }
                              return null;
                            })}
                          </svg>
                        </div>
                        
                        <div className="absolute top-3 left-3 bg-white rounded-lg px-3 py-1 shadow-md">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-xs font-medium">Live Monitoring</span>
                          </div>
                        </div>
                        
                        <div className="absolute top-3 right-3 bg-white rounded-lg px-3 py-2 shadow-md">
                          <div className="text-xs">
                            <div className="font-medium text-gray-900">
                              {heatmapData.filter(p => p.intensity === 'high').length} High Risk Areas
                            </div>
                            <div className="text-gray-600">
                              {heatmapData.filter(p => p.intensity === 'medium').length} Medium • {heatmapData.filter(p => p.intensity === 'low').length} Low
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                          <span>Low (15-75)</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                          <span>Medium (75-200)</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                          <span>High (200+)</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 rounded-lg p-3">
                      <div className="flex items-center justify-between text-sm">
                        <div>
                          <span className="font-medium text-blue-900">Total Monitored Population:</span>
                          <span className="ml-2 text-blue-700">
                            {heatmapData.reduce((sum, point) => sum + point.population, 0).toLocaleString()}
                          </span>
                        </div>
                        <div className="text-blue-600 text-xs">
                          Next update: {getSecondsUntilUpdate()}s
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <CommunicationFeed />
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <Card>
              <CardContent className="p-0">
                <div className="px-6 py-4 border-b border-border">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Active Emergency Alerts</h3>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span>{currentAlerts?.length || 3} Active</span>
                    </div>
                  </div>
                </div>
                
                <div className="divide-y divide-border">
                  {currentAlerts?.map((alert) => (
                    <div key={alert.id} className="px-6 py-4 hover:bg-accent/50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className={`w-10 h-10 ${getPriorityColor(alert.priority)} rounded-lg flex items-center justify-center`}>
                            {getAlertIcon(alert.type)}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-foreground capitalize">
                              {alert.type.replace('_', ' ')} Alert
                            </h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {alert.description}
                            </p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                              <span>
                                Location: {alert.location.lat}°N, {alert.location.lng}°E
                              </span>
                              <span>•</span>
                              <span>
                                Reported: {new Date(alert.timestamp).toLocaleTimeString()}
                              </span>
                            </div>
                            {responses[alert.id] && (
                              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                                <div className="flex items-center space-x-2 mb-1">
                                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                  <span className="text-xs text-green-700 font-medium">Response Sent</span>
                                </div>
                                <p className="text-sm text-green-800">{responses[alert.id].message}</p>
                                <p className="text-xs text-green-600 mt-1">
                                  By {responses[alert.id].responderName} at {new Date(responses[alert.id].timestamp).toLocaleTimeString()}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge 
                            className={`${
                              alert.priority === 'critical' || alert.priority === 'high' 
                                ? 'bg-red-100 text-red-800' 
                                : alert.priority === 'medium'
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {alert.priority} Priority
                          </Badge>
                          <Button 
                            size="sm"
                            onClick={() => handleRespond(alert)}
                            disabled={!!responses[alert.id]}
                          >
                            {responses[alert.id] ? 'Responded' : 'Respond'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="heatmap" className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Real-time Crowd Density Monitoring</h3>
                                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span>Live Updates</span>
                    </div>
                    <span>Coverage: ±1.5km radius</span>
                  </div>
                </div>
                
                <div className="bg-gray-100 rounded-lg h-[600px] mb-4 relative overflow-hidden">
                  {locationError ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center text-muted-foreground">
                        <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <p className="font-medium">Location Access Required</p>
                        <p className="text-sm">Please enable GPS for comprehensive area monitoring</p>
                      </div>
                    </div>
                  ) : !location.lat ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center text-muted-foreground">
                        <div className="w-12 h-12 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="font-medium">Initializing Monitoring System...</p>
                        <p className="text-sm">Establishing command center coordinates</p>
                      </div>
                    </div>
                  ) : (
                    <div className="relative w-full h-full bg-gradient-to-br from-blue-50 to-green-50">
                      <div className="absolute inset-0 opacity-30">
                        <iframe
                          src={`https://www.openstreetmap.org/export/embed.html?bbox=${location.lng-0.015}%2C${location.lat-0.015}%2C${location.lng+0.015}%2C${location.lat+0.015}&layer=mapnik`}
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          className="rounded-lg"
                          title="Full Screen Command Heatmap"
                        />
                      </div>
                      
                      <div className="absolute inset-0 rounded-lg">
                        <svg width="100%" height="100%" className="rounded-lg">
                          <circle
                            cx="50%"
                            cy="50%"
                            r="12"
                            fill="#1d4ed8"
                            stroke="white"
                            strokeWidth="4"
                            className="animate-pulse"
                          />
                          <text
                            x="50%"
                            y="46%"
                            textAnchor="middle"
                            className="text-sm font-bold fill-white"
                            style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}
                          >
                            COMMAND
                          </text>
                          <text
                            x="50%"
                            y="58%"
                            textAnchor="middle"
                            className="text-xs font-bold fill-white"
                            style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}
                          >
                            CENTER
                          </text>
                          
                          {heatmapData.map((point, index) => {
                            const xPercent = 50 + ((point.lng - location.lng) / 0.03) * 100;
                            const yPercent = 50 - ((point.lat - location.lat) / 0.03) * 100;
                            
                            if (xPercent >= 0 && xPercent <= 100 && yPercent >= 0 && yPercent <= 100) {
                              return (
                                <g key={point.id}>
                                  {point.intensity === 'high' && (
                                    <>
                                      <circle
                                        cx={`${xPercent}%`}
                                        cy={`${yPercent}%`}
                                        r={getIntensitySize(point.intensity) + 15}
                                        fill={getIntensityColor(point.intensity)}
                                        opacity="0.1"
                                        className="animate-pulse"
                                      />
                                      <circle
                                        cx={`${xPercent}%`}
                                        cy={`${yPercent}%`}
                                        r={getIntensitySize(point.intensity) + 8}
                                        fill={getIntensityColor(point.intensity)}
                                        opacity="0.3"
                                        className="animate-pulse"
                                      />
                                    </>
                                  )}
                                  
                                  {point.intensity === 'medium' && (
                                    <circle
                                      cx={`${xPercent}%`}
                                      cy={`${yPercent}%`}
                                      r={getIntensitySize(point.intensity) + 6}
                                      fill={getIntensityColor(point.intensity)}
                                      opacity="0.2"
                                    />
                                  )}
                                  
                                  <circle
                                    cx={`${xPercent}%`}
                                    cy={`${yPercent}%`}
                                    r={getIntensitySize(point.intensity) + 2}
                                    fill={getIntensityColor(point.intensity)}
                                    opacity="0.8"
                                    stroke="white"
                                    strokeWidth="2"
                                  />
                                  
                                  <text
                                    x={`${xPercent}%`}
                                    y={`${yPercent + 1}%`}
                                    textAnchor="middle"
                                    className="text-sm font-bold fill-white"
                                    style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.8)' }}
                                  >
                                    {point.population}
                                  </text>
                                  
                                  {point.intensity === 'high' && (
                                    <text
                                      x={`${xPercent}%`}
                                      y={`${yPercent + 8}%`}
                                      textAnchor="middle"
                                      className="text-xs font-medium fill-white"
                                      style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}
                                    >
                                      {point.sector}
                                    </text>
                                  )}
                                </g>
                              );
                            }
                            return null;
                          })}
                        </svg>
                      </div>
                      
                      <div className="absolute top-4 left-4 bg-white rounded-xl px-4 py-3 shadow-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                          <div>
                            <div className="text-sm font-semibold">Live Monitoring Active</div>
                            <div className="text-xs text-muted-foreground">15s refresh • {heatmapData.length} points</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="absolute top-4 right-4 bg-white rounded-xl px-4 py-3 shadow-lg min-w-48">
                        <div className="space-y-2">
                          <div className="text-sm font-semibold text-gray-900">Area Statistics</div>
                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div>
                              <div className="text-red-600 font-medium">
                                {heatmapData.filter(p => p.intensity === 'high').length} High Risk
                              </div>
                              <div className="text-orange-600 font-medium">
                                {heatmapData.filter(p => p.intensity === 'medium').length} Medium Risk
                              </div>
                              <div className="text-green-600 font-medium">
                                {heatmapData.filter(p => p.intensity === 'low').length} Low Risk
                              </div>
                            </div>
                            <div>
                              <div className="text-gray-600">
                                Total: {heatmapData.reduce((sum, p) => sum + p.population, 0).toLocaleString()}
                              </div>
                              <div className="text-gray-600">
                                Avg: {Math.round(heatmapData.reduce((sum, p) => sum + p.population, 0) / heatmapData.length)}
                              </div>
                              <div className="text-blue-600">
                                Next: {getSecondsUntilUpdate()}s
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="absolute bottom-4 left-4 bg-white rounded-xl px-4 py-3 shadow-lg">
                        <div className="text-xs space-y-1">
                          <div className="font-semibold text-gray-900">Command Center Coordinates</div>
                          <div className="font-mono text-gray-700">
                            {formatCoordinate(location.lat)}°N, {formatCoordinate(location.lng)}°E
                          </div>
                          <div className="text-gray-500">
                            Accuracy: ±{location.accuracy || 0}m | Updated: {getTimeAgo(location.lastUpdated)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="absolute bottom-4 right-4 bg-white rounded-xl px-4 py-3 shadow-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded-full ${
                            dynamicOverallCrowdLevel === 'Critical' ? 'bg-red-500' :
                            dynamicOverallCrowdLevel === 'High' ? 'bg-orange-500' :
                            dynamicOverallCrowdLevel === 'Medium' ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}></div>
                          <div>
                            <div className="text-sm font-semibold">Overall Status</div>
                            <div className={`text-xs font-medium ${
                              dynamicOverallCrowdLevel === 'Critical' ? 'text-red-600' :
                              dynamicOverallCrowdLevel === 'High' ? 'text-orange-600' :
                              dynamicOverallCrowdLevel === 'Medium' ? 'text-yellow-600' :
                              'text-green-600'
                            }`}>
                              {dynamicOverallCrowdLevel} Crowd Level
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">Density Legend</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 bg-green-500 rounded-full"></div>
                          <span className="font-medium text-green-800">Low Density (15-75)</span>
                        </div>
                        <span className="text-sm text-green-600">
                          {heatmapData.filter(p => p.intensity === 'low').length} areas
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 bg-yellow-500 rounded-full"></div>
                          <span className="font-medium text-yellow-800">Medium Density (75-200)</span>
                        </div>
                        <span className="text-sm text-yellow-600">
                          {heatmapData.filter(p => p.intensity === 'medium').length} areas
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 bg-red-500 rounded-full"></div>
                          <span className="font-medium text-red-800">High Density (200+)</span>
                        </div>
                        <span className="text-sm text-red-600">
                          {heatmapData.filter(p => p.intensity === 'high').length} areas
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">Monitoring Stats</h4>
                    <div className="bg-blue-50 rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-blue-900">Total Monitored</span>
                        <span className="text-lg font-bold text-blue-800">
                          {heatmapData.reduce((sum, point) => sum + point.population, 0).toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-blue-900">Coverage Radius</span>
                        <span className="text-sm text-blue-700">1.5 km</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-blue-900">Update Frequency</span>
                        <span className="text-sm text-blue-700">Every 15 seconds</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-blue-900">Last Updated</span>
                        <span className="text-sm text-blue-700">{getTimeAgo(lastHeatmapUpdate)}</span>
                      </div>
                      
                      <div className="pt-2 border-t border-blue-200">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-blue-900">System Status</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-sm text-green-600">Operational</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="drones" className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">AeroRover-X Drone Status</h3>
                <div className="text-center text-muted-foreground py-8">
                  Drone monitoring interface will be implemented here
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lostfound" className="space-y-6">
            <LostFoundManagement />
          </TabsContent>
        </Tabs>
      </div>

      {/* Response Modal */}
      {responseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-lg font-semibold">Respond to Alert</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setResponseModal(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium capitalize mb-2">
                  {responseModal.type.replace('_', ' ')} Alert
                </h4>
                <p className="text-sm text-muted-foreground">
                  {responseModal.description}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Location: {responseModal.location.lat}°N, {responseModal.location.lng}°E
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Response Message</label>
                <textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder={getResponseTemplate(responseModal.type)}
                  className="w-full p-3 border border-border rounded-lg resize-none h-32 text-sm"
                />
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setResponseText(getResponseTemplate(responseModal.type))}
                  className="flex-1"
                >
                  Use Template
                </Button>
                <Button
                  onClick={handleSubmitResponse}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Response
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}