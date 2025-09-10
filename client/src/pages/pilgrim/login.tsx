import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Shield, Key } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { OTPInput } from '@/components/ui/otp-input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { apiRequest } from '@/lib/queryClient';

export default function PilgrimLogin() {
  const [step, setStep] = useState<'login' | 'otp'>('login');
  const [contactMethod, setContactMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSendOTP = async () => {
    const identifier = contactMethod === 'email' ? email : phone;
    
    if (!identifier) {
      toast({
        title: "Error",
        description: `Please enter your ${contactMethod}`,
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      await apiRequest('POST', '/api/auth/send-otp', {
        identifier,
        type: contactMethod,
        role: 'pilgrim'
      });
      
      setStep('otp');
      toast({
        title: "OTP Sent",
        description: `Verification code sent to your ${contactMethod}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send OTP. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast({
        title: "Error",
        description: "Please enter the complete 6-digit OTP",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiRequest('POST', '/api/auth/verify-otp', {
        identifier: contactMethod === 'email' ? email : phone,
        otp,
        role: 'pilgrim'
      });
      
      const userData = await response.json();
      login(userData.user);
      setLocation('/pilgrim/dashboard');
      
      toast({
        title: "Success",
        description: "Login successful!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid OTP. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'otp') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/10 p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Key className="text-white text-2xl" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Verify OTP</h2>
                <p className="text-muted-foreground mt-2">
                  Enter the 6-digit code sent to your {contactMethod}
                </p>
              </div>

              <div className="space-y-6">
                <OTPInput
                  length={6}
                  value={otp}
                  onChange={setOtp}
                  data-testid="otp-verification"
                />

                <Button
                  onClick={handleVerifyOTP}
                  disabled={isLoading || otp.length !== 6}
                  className="w-full"
                  data-testid="verify-otp-button"
                >
                  {isLoading ? 'Verifying...' : 'Verify & Login'}
                </Button>

                <div className="text-center">
                  <Button
                    variant="link"
                    onClick={() => setStep('login')}
                    className="text-primary hover:text-primary/80 text-sm"
                    data-testid="back-to-login-button"
                  >
                    ← Back to Login
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/10 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="text-primary-foreground text-2xl" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Pilgrim Login</h2>
              <p className="text-muted-foreground mt-2">Enter your details to access safety features</p>
            </div>

            <div className="space-y-6">
              {/* Contact Method Toggle */}
              <div className="flex bg-muted rounded-lg p-1">
                <Button
                  variant={contactMethod === 'email' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setContactMethod('email')}
                  className="flex-1"
                  data-testid="email-tab"
                >
                  Email
                </Button>
                <Button
                  variant={contactMethod === 'phone' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setContactMethod('phone')}
                  className="flex-1"
                  data-testid="phone-tab"
                >
                  Phone
                </Button>
              </div>

              {/* Email Input */}
              {contactMethod === 'email' && (
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    data-testid="email-input"
                  />
                </div>
              )}

              {/* Phone Input */}
              {contactMethod === 'phone' && (
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    data-testid="phone-input"
                  />
                </div>
              )}

              <Button
                onClick={handleSendOTP}
                disabled={isLoading}
                className="w-full"
                data-testid="send-otp-button"
              >
                {isLoading ? 'Sending...' : 'Send OTP'}
              </Button>
            </div>

            <div className="mt-6 text-center">
              <Link href="/">
                <Button variant="link" className="text-primary hover:text-primary/80 text-sm">
                  ← Back to Portal Selection
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
