import React from 'react';
import { Link } from 'wouter';
import { Shield, Plane, MapPin, Ambulance, Smartphone, Monitor } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/10">
      {/* Header */}
      <header className="border-b border-border bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <Shield className="text-primary-foreground text-xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground" data-testid="app-title">
                  SafeYatra
                </h1>
                <p className="text-sm text-muted-foreground">AI-Powered Safety System</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">Simhastha 2028</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-foreground">System Active</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            AI-Powered Safety System<br />
            <span className="text-primary">for Simhastha 2028</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Advanced emergency response and real-time crowd monitoring to ensure pilgrim safety during the sacred gathering.
          </p>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="shadow-sm">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Plane className="text-white text-xl" />
                </div>
                <h3 className="text-lg font-semibold mb-2">AeroRover-X Monitoring</h3>
                <p className="text-muted-foreground">Advanced drone surveillance for real-time area monitoring</p>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <MapPin className="text-white text-xl" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Real-time Heatmaps</h3>
                <p className="text-muted-foreground">Live crowd density visualization and safe route guidance</p>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Ambulance className="text-white text-xl" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Emergency Response</h3>
                <p className="text-muted-foreground">Sub-5 minute response time for all emergency situations</p>
              </CardContent>
            </Card>
          </div>

          {/* Portal Selection */}
          <Card className="shadow-lg max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-8">Choose Your Portal</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <Link href="/pilgrim/login">
                  <Button
                    className="w-full h-auto p-8 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white transition-all duration-300 transform hover:scale-105"
                    data-testid="pilgrim-portal-button"
                  >
                    <div className="text-center">
                      <Smartphone className="mx-auto text-4xl mb-4" />
                      <h4 className="text-xl font-bold mb-2">Pilgrim App</h4>
                      <p className="text-blue-100 mb-4">For pilgrims and visitors</p>
                      <div className="text-sm bg-blue-600/30 rounded-lg p-2">
                        SOS • Safe Routes • Crowd Updates
                      </div>
                    </div>
                  </Button>
                </Link>
                
                <Link href="/command/login">
                  <Button
                    className="w-full h-auto p-8 bg-gradient-to-br from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white transition-all duration-300 transform hover:scale-105"
                    data-testid="command-portal-button"
                  >
                    <div className="text-center">
                      <Monitor className="mx-auto text-4xl mb-4" />
                      <h4 className="text-xl font-bold mb-2">Command Center</h4>
                      <p className="text-gray-300 mb-4">For authorized personnel</p>
                      <div className="text-sm bg-gray-600/30 rounded-lg p-2">
                        Admin • Police • Medical • Coordinator
                      </div>
                    </div>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
