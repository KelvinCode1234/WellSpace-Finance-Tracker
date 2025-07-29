"use client";

import { useState, useEffect } from 'react';
import useLocalStorage from '@/hooks/use-local-storage';
import PinScreen from '@/components/auth/PinScreen';
import Dashboard from '@/components/dashboard/Dashboard';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [storedPin, setStoredPin] = useLocalStorage<string | null>('wellspace_pin', null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handlePinSet = (pin: string) => {
    setStoredPin(pin);
    setIsAuthenticated(true);
  };

  const handlePinEnter = () => {
    setIsAuthenticated(true);
  };
  
  const handleLogout = () => {
    setIsAuthenticated(false);
  }

  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-full max-w-sm space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Dashboard onLogout={handleLogout} />;
  }

  return (
    <PinScreen
      mode={storedPin ? 'enter' : 'create'}
      onPinSet={handlePinSet}
      onPinEnter={handlePinEnter}
      storedPin={storedPin}
    />
  );
}
