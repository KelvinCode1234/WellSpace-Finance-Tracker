"use client";

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LockKeyhole } from 'lucide-react';

interface PinScreenProps {
  mode: 'create' | 'enter';
  onPinSet: (pin: string) => void;
  onPinEnter: (pin: string) => void;
  storedPin: string | null;
}

export default function PinScreen({ mode, onPinSet, onPinEnter, storedPin }: PinScreenProps) {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');

  const handleSetPin = () => {
    if (pin.length !== 4) {
      setError('PIN must be 4 digits.');
      return;
    }
    if (pin !== confirmPin) {
      setError('PINs do not match.');
      return;
    }
    setError('');
    onPinSet(pin);
  };

  const handleEnterPin = () => {
    if (pin === storedPin) {
      setError('');
      onPinEnter(pin);
    } else {
      setError('Incorrect PIN. Please try again.');
      setPin('');
    }
  };
  
  const handleInputChange = (setter: (value: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && value.length <= 4) {
      setter(value);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-sm mx-4">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit">
            <LockKeyhole className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="mt-4 text-2xl font-bold">
            {mode === 'create' ? 'Create Your PIN' : 'Welcome Back!'}
          </CardTitle>
          <CardDescription>
            {mode === 'create' ? 'Create a 4-digit PIN to secure your financial data.' : 'Enter your 4-digit PIN to access your dashboard.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Enter 4-digit PIN"
              value={pin}
              onChange={handleInputChange(setPin)}
              maxLength={4}
              className="text-center text-lg tracking-[0.5em]"
              aria-label="PIN"
            />
          </div>
          {mode === 'create' && (
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Confirm PIN"
                value={confirmPin}
                onChange={handleInputChange(setConfirmPin)}
                maxLength={4}
                className="text-center text-lg tracking-[0.5em]"
                aria-label="Confirm PIN"
              />
            </div>
          )}
          {error && <p className="text-sm text-destructive text-center">{error}</p>}
        </CardContent>
        <CardFooter>
          <Button onClick={mode === 'create' ? handleSetPin : handleEnterPin} className="w-full">
            {mode === 'create' ? 'Set PIN' : 'Unlock'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
