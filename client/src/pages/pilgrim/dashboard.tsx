import React, { useState, useEffect } from 'react';
import { Shield, LogOut, AlertTriangle, MapPin, Search, Route, Users, Navigation, X, User, Phone, Mail, MessageSquare } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { navigate } from 'wouter/use-browser-location';

const LostFoundForm = ({ onClose, location, user }) => {
  const [formData, setFormData] = useState({
    type: 'missing_person',
    name: '',
    age: '',
    description: '',
    lastSeenLocation: '',
    contactInfo: '',
    reporterName: user?.name || '',
    reporterPhone: '',
    additionalInfo: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.description) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const reportData = {
        ...formData,
        userId: user?.id || 'anonymous',
        location: location.lat ? {
          lat: location.lat,
          lng: location.lng
        } : null
      };

      const response = await fetch('/api/pilgrim/lost-found', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData)
      });

      if (response.ok) {
        const result = await response.json();
        alert('Report submitted successfully! Our team has been notified.');
        onClose();
      } else {
        throw new Error('Failed to submit report');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Report Lost & Found</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Report Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Report Type *</label>
            <div className="grid grid-cols-2 gap-2">
              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="type"
                  value="missing_person"
                  checked={formData.type === 'missing_person'}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="mr-2"
                />
                <span className="text-sm">Missing Person</span>
              </label>
              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="type"
                  value="found_item"
                  checked={formData.type === 'found_item'}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="mr-2"
                />
                <span className="text-sm">Found Item</span>
              </label>
            </div>
          </div>

          {/* Name/Item */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              {formData.type === 'missing_person' ? 'Person Name' : 'Item Name'} *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder={formData.type === 'missing_person' ? 'Enter person\'s name' : 'Enter item description'}
              className="w-full p-3 border rounded-lg text-sm"
              required
            />
          </div>

          {/* Age (only for missing person) */}
          {formData.type === 'missing_person' && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Age</label>
              <input
                type="text"
                value={formData.age}
                onChange={(e) => setFormData({...formData, age: e.target.value})}
                placeholder="Enter age"
                className="w-full p-3 border rounded-lg text-sm"
              />
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              {formData.type === 'missing_person' ? 'Physical Description' : 'Item Details'} *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder={formData.type === 'missing_person' ? 'Physical appearance, clothing, etc.' : 'Item details, color, brand, etc.'}
              className="w-full p-3 border rounded-lg text-sm h-20 resize-none"
              required
            />
          </div>

          {/* Last Seen Location */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              {formData.type === 'missing_person' ? 'Last Seen Location' : 'Found Location'}
            </label>
            <input
              type="text"
              value={formData.lastSeenLocation}
              onChange={(e) => setFormData({...formData, lastSeenLocation: e.target.value})}
              placeholder="Specific area or landmark"
              className="w-full p-3 border rounded-lg text-sm"
            />
          </div>

          {/* Contact Info (for missing person) */}
          {formData.type === 'missing_person' && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Contact Information</label>
              <input
                type="text"
                value={formData.contactInfo}
                onChange={(e) => setFormData({...formData, contactInfo: e.target.value})}
                placeholder="Phone or email"
                className="w-full p-3 border rounded-lg text-sm"
              />
            </div>
          )}

          {/* Reporter Details */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Your Name</label>
            <input
              type="text"
              value={formData.reporterName}
              onChange={(e) => setFormData({...formData, reporterName: e.target.value})}
              placeholder="Your full name"
              className="w-full p-3 border rounded-lg text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Your Phone Number</label>
            <input
              type="tel"
              value={formData.reporterPhone}
              onChange={(e) => setFormData({...formData, reporterPhone: e.target.value})}
              placeholder="Your contact number"
              className="w-full p-3 border rounded-lg text-sm"
            />
          </div>

          {/* Additional Info */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Additional Information</label>
            <textarea
              value={formData.additionalInfo}
              onChange={(e) => setFormData({...formData, additionalInfo: e.target.value})}
              placeholder="Any other relevant details..."
              className="w-full p-3 border rounded-lg text-sm h-16 resize-none"
            />
          </div>

          {/* Current Location Info */}
          {location.lat && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-sm text-blue-800">
                <div className="font-medium mb-1">Your Current Location:</div>
                <div className="text-xs">
                  {location.lat.toFixed(6)}°N, {location.lng.toFixed(6)}°E
                </div>
                <div className="text-xs">Accuracy: ±{location.accuracy}m</div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Submitting...
                </>
              ) : (
                'Submit Report'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function SafeYatraDashboard() {
  const [isOnline, setIsOnline] = useState(true);
  const [crowdLevel, setCrowdLevel] = useState('Low');
  const [showLostFoundForm, setShowLostFoundForm] = useState(false);
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

  // Mock user data - in real app this would come from auth context
  const user = {
    id: 'pilgrim_123',
    name: 'Pilgrim User',
    role: 'pilgrim'
  };

  // Get user's current location
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
            console.log('Location found:', position.coords.latitude, position.coords.longitude);
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

  // Generate realistic heatmap data around user's location
  useEffect(() => {
    if (location.lat && location.lng) {
      const generateHeatmapData = () => {
        const points = [];
        const baseRadius = 0.01;
        const numPoints = 15 + Math.floor(Math.random() * 10);
        
        for (let i = 0; i < numPoints; i++) {
          const angle = Math.random() * 2 * Math.PI;
          const distance = Math.random() * baseRadius;
          
          const lat = location.lat + (distance * Math.cos(angle));
          const lng = location.lng + (distance * Math.sin(angle));
          
          let intensity;
          const distanceFromCenter = Math.sqrt(Math.pow(lat - location.lat, 2) + Math.pow(lng - location.lng, 2));
          
          if (distanceFromCenter < baseRadius * 0.3) {
            intensity = Math.random() < 0.6 ? 'high' : 'medium';
          } else if (distanceFromCenter < baseRadius * 0.7) {
            intensity = Math.random() < 0.5 ? 'medium' : 'low';
          } else {
            intensity = Math.random() < 0.7 ? 'low' : 'medium';
          }
          
          points.push({
            id: `point_${i}`,
            lat,
            lng,
            intensity,
            population: intensity === 'high' ? 150 + Math.floor(Math.random() * 300) : 
                       intensity === 'medium' ? 50 + Math.floor(Math.random() * 100) : 
                       10 + Math.floor(Math.random() * 40),
            lastUpdated: new Date()
          });
        }
        
        setHeatmapData(points);
        setLastHeatmapUpdate(new Date());
      };

      generateHeatmapData();
      
      const heatmapInterval = setInterval(() => {
        setHeatmapData(prevData => 
          prevData.map(point => {
            if (Math.random() < 0.3) {
              const newPopulation = point.intensity === 'high' ? 150 + Math.floor(Math.random() * 300) : 
                                  point.intensity === 'medium' ? 50 + Math.floor(Math.random() * 100) : 
                                  10 + Math.floor(Math.random() * 40);
              
              let newIntensity = point.intensity;
              if (newPopulation > 200) newIntensity = 'high';
              else if (newPopulation > 75) newIntensity = 'medium';
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
      }, 30000);

      return () => clearInterval(heatmapInterval);
    }
  }, [location.lat, location.lng]);

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

  const getCurrentCrowdLevel = () => {
    if (!heatmapData.length || !location.lat) return 'Low';
    
    const nearbyPoints = heatmapData.filter(point => {
      const distance = Math.sqrt(
        Math.pow(point.lat - location.lat, 2) + Math.pow(point.lng - location.lng, 2)
      );
      return distance < 0.003;
    });
    
    const highIntensity = nearbyPoints.filter(p => p.intensity === 'high').length;
    const mediumIntensity = nearbyPoints.filter(p => p.intensity === 'medium').length;
    
    if (highIntensity > 2) return 'High';
    if (highIntensity > 0 || mediumIntensity > 3) return 'Medium';
    return 'Low';
  };

  const dynamicCrowdLevel = getCurrentCrowdLevel();

  const handleSOS = () => {
    const locationInfo = (locationError || !location.lat) 
      ? 'Location unavailable - Please enable GPS' 
      : `Lat: ${formatCoordinate(location.lat)}, Lng: ${formatCoordinate(location.lng)}`;
    alert(`🚨 EMERGENCY SOS ACTIVATED! 🚨\nHelp is on the way.\n\nLocation: ${locationInfo}\nAccuracy: ${location.accuracy ? `±${location.accuracy}m` : 'Unknown'}`);
  };

  const handleLogout = () => {
    navigate('/');
  };

  const getSecondsUntilUpdate = () => {
    if (!lastHeatmapUpdate) return 30;
    const elapsed = Math.floor((new Date() - lastHeatmapUpdate) / 1000);
    return Math.max(0, 30 - elapsed);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="text-center">
            <h1 className="text-xl font-bold text-gray-900">SafeYatra</h1>
            <p className="text-sm text-gray-500">Simhastha 2028</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm text-gray-600">{isOnline ? 'Online' : 'Offline'}</span>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleLogout}
              className="text-sm"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto p-6 space-y-6">
        
        {/* Emergency SOS Button */}
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-6 text-center">
            <Button
              onClick={handleSOS}
              className="w-full h-12 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg mb-3 flex items-center justify-center"
            >
              <AlertTriangle className="w-5 h-5 mr-2" />
              EMERGENCY SOS
            </Button>
            <p className="text-sm text-red-700">Press for immediate emergency assistance</p>
          </CardContent>
        </Card>

        {/* Current Location Status */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-gray-600 mr-2" />
                <h3 className="font-semibold text-gray-900">Current Location Status</h3>
              </div>
              {isLoadingLocation && (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-blue-600">Locating...</span>
                </div>
              )}
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Crowd Level:</span>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 text-sm rounded-full font-medium ${
                    dynamicCrowdLevel === 'High' ? 'bg-red-100 text-red-800' :
                    dynamicCrowdLevel === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {dynamicCrowdLevel}
                  </span>
                </div>
              </div>
              
              {locationError ? (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                  <div className="flex items-center mb-2">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    <span className="font-medium">Location Error</span>
                  </div>
                  <p className="text-sm">{locationError}</p>
                  <p className="text-xs mt-1 text-red-500">
                    Please enable location services and refresh the page
                  </p>
                </div>
              ) : !location.lat ? (
                <div className="text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                    <span>Getting your precise location...</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Latitude:</span>
                      <span className="font-mono text-gray-900">{formatCoordinate(location.lat)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Longitude:</span>
                      <span className="font-mono text-gray-900">{formatCoordinate(location.lng)}</span>
                    </div>
                    {location.accuracy && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Accuracy:</span>
                        <span className="text-sm text-gray-500">±{location.accuracy}m</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Last Update:</span>
                      <span className="text-sm text-gray-500">{getTimeAgo(location.lastUpdated)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Card 
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setShowLostFoundForm(true)}
          >
            <CardContent className="p-8 text-center">
              <Search className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">Lost & Found</h4>
              <p className="text-sm text-gray-500">Report missing person or found item</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-8 text-center">
              <Route className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h4 className="font-semibold text-gray-900 mb-2">Safe Route</h4>
              <p className="text-sm text-gray-500">Navigate safely</p>
            </CardContent>
          </Card>
        </div>

        {/* Crowd Heatmap */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Users className="w-5 h-5 text-gray-600 mr-2" />
              <h3 className="font-semibold text-gray-900">Live Crowd Heatmap</h3>
              <div className="ml-auto flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-500">
                  Updated {getTimeAgo(lastHeatmapUpdate)}
                </span>
              </div>
            </div>
            
            {/* Interactive Heatmap */}
            <div className="bg-gray-100 rounded-lg h-80 mb-4 relative overflow-hidden">
              {locationError ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-gray-500">
                    <MapPin className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p className="font-medium">Location Access Required</p>
                    <p className="text-sm">Please enable GPS for heatmap</p>
                  </div>
                </div>
              ) : !location.lat ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-gray-500">
                    <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="font-medium">Loading Heatmap...</p>
                    <p className="text-sm">Analyzing crowd density</p>
                  </div>
                </div>
              ) : (
                <div className="relative w-full h-full bg-gradient-to-br from-blue-50 to-green-50">
                  <div className="absolute inset-0 opacity-30">
                    <iframe
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${location.lng-0.01}%2C${location.lat-0.01}%2C${location.lng+0.01}%2C${location.lat+0.01}&layer=mapnik`}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      className="rounded-lg"
                      title="Heatmap Base"
                    />
                  </div>
                  
                  <div className="absolute inset-0 rounded-lg">
                    <svg width="100%" height="100%" className="rounded-lg">
                      <circle
                        cx="50%"
                        cy="50%"
                        r="6"
                        fill="#2563eb"
                        stroke="white"
                        strokeWidth="3"
                        className="animate-pulse"
                      />
                      <text
                        x="50%"
                        y="45%"
                        textAnchor="middle"
                        className="text-xs font-bold fill-white"
                        style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}
                      >
                        YOU
                      </text>
                      
                      {heatmapData.map((point, index) => {
                        const xPercent = 50 + ((point.lng - location.lng) / 0.02) * 100;
                        const yPercent = 50 - ((point.lat - location.lat) / 0.02) * 100;
                        
                        if (xPercent >= 0 && xPercent <= 100 && yPercent >= 0 && yPercent <= 100) {
                          return (
                            <g key={point.id}>
                              {point.intensity === 'high' && (
                                <circle
                                  cx={`${xPercent}%`}
                                  cy={`${yPercent}%`}
                                  r={getIntensitySize(point.intensity) + 8}
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
                      <span className="text-xs font-medium">Live Crowd Data</span>
                    </div>
                  </div>
                  
                  <div className="absolute top-3 right-3 bg-white rounded-lg px-3 py-2 shadow-md">
                    <div className="text-xs">
                      <div className="font-medium text-gray-900">
                        {heatmapData.filter(p => p.intensity === 'high').length} High Density
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
                    <span>Low (10-50)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                    <span>Medium (50-150)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <span>High (150+)</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <span className="font-medium text-blue-900">Total People in Area:</span>
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

        {/* Safety Reminder */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <h4 className="font-medium text-blue-900 mb-2">Safety Reminder</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Stay hydrated and avoid overcrowded areas</li>
              <li>• Keep emergency contacts ready</li>
              <li>• Follow official announcements</li>
            </ul>
          </CardContent>
        </Card>

      </main>

      {/* Lost & Found Form Modal */}
      {showLostFoundForm && (
        <LostFoundForm 
          onClose={() => setShowLostFoundForm(false)}
          location={location}
          user={user}
        />
      )}
    </div>
  );
}