import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { ShieldCheck, Key } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OTPInput } from '@/components/ui/otp-input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { apiRequest } from '@/lib/queryClient';

export default function CommandLogin() {
  const [step, setStep] = useState<'login' | 'otp'>('login');
  const [role, setRole] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSendOTP = async () => {
    if (!role || !employeeId || !phone) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      await apiRequest('POST', '/api/auth/send-otp', {
        identifier: phone,
        type: 'phone',
        role,
        employeeId
      });
      
      setStep('otp');
      toast({
        title: "OTP Sent",
        description: "Verification code sent to your registered device",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid credentials or failed to send OTP",
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
        identifier: phone,
        otp,
        role,
        employeeId
      });
      
      const userData = await response.json();
      login(userData.user);
      setLocation('/command/dashboard');
      
      toast({
        title: "Access Granted",
        description: "Welcome to SafeYatra Command Center",
      });
    } catch (error) {
      toast({
        title: "Access Denied",
        description: "Invalid OTP or unauthorized access",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'otp') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Key className="text-white text-2xl" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Verify Access</h2>
                <p className="text-muted-foreground mt-2">
                  Enter the OTP sent to your registered device
                </p>
              </div>

              <div className="space-y-6">
                <OTPInput
                  length={6}
                  value={otp}
                  onChange={setOtp}
                  data-testid="command-otp-verification"
                />

                <Button
                  onClick={handleVerifyOTP}
                  disabled={isLoading || otp.length !== 6}
                  className="w-full bg-gray-700 hover:bg-gray-800"
                  data-testid="verify-command-otp-button"
                >
                  {isLoading ? 'Verifying...' : 'Access Command Center'}
                </Button>

                <div className="text-center">
                  <Button
                    variant="link"
                    onClick={() => setStep('login')}
                    className="text-primary hover:text-primary/80 text-sm"
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gray-700 rounded-xl flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="text-white text-2xl" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Command Center</h2>
              <p className="text-muted-foreground mt-2">Authorized Personnel Only</p>
            </div>

            <div className="space-y-6">
              {/* Role Selection */}
              <div className="space-y-2">
                <Label htmlFor="role">Select Role</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger data-testid="role-select">
                    <SelectValue placeholder="Select your role..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="administrator">Administrator</SelectItem>
                    <SelectItem value="police">Police</SelectItem>
                    <SelectItem value="medical">Medical</SelectItem>
                    <SelectItem value="coordinator">Coordinator</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Employee ID */}
              <div className="space-y-2">
                <Label htmlFor="employeeId">Employee ID</Label>
                <Input
                  id="employeeId"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  placeholder="Enter your employee ID"
                  data-testid="employee-id-input"
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  data-testid="command-phone-input"
                />
              </div>

              <Button
                onClick={handleSendOTP}
                disabled={isLoading}
                className="w-full bg-gray-700 hover:bg-gray-800"
                data-testid="send-command-otp-button"
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
