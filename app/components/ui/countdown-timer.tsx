import React, { useState, useEffect } from "react";
import { cn } from "../../lib/utils";

interface CountdownTimerProps {
  targetTime: number; // Unix timestamp in seconds
  onExpire?: () => void;
  className?: string;
  size?: "sm" | "md" | "lg";
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
}

export function CountdownTimer({ 
  targetTime, 
  onExpire, 
  className,
  size = "md" 
}: CountdownTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>(() => 
    calculateTimeRemaining(targetTime)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = calculateTimeRemaining(targetTime);
      setTimeRemaining(remaining);
      
      if (remaining.expired && onExpire) {
        onExpire();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetTime, onExpire]);

  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  };

  if (timeRemaining.expired) {
    return (
      <div className={cn("text-red-600 font-semibold", sizeClasses[size], className)}>
        ⏰ Waktu habis
      </div>
    );
  }

  return (
    <div className={cn("font-mono", sizeClasses[size], className)}>
      <div className="flex gap-2">
        <div className="text-center">
          <div className="font-bold">{timeRemaining.days}</div>
          <div className="text-xs text-muted-foreground">hari</div>
        </div>
        <div className="text-center">
          <div className="font-bold">{timeRemaining.hours.toString().padStart(2, '0')}</div>
          <div className="text-xs text-muted-foreground">jam</div>
        </div>
        <div className="text-center">
          <div className="font-bold">{timeRemaining.minutes.toString().padStart(2, '0')}</div>
          <div className="text-xs text-muted-foreground">menit</div>
        </div>
        <div className="text-center">
          <div className="font-bold">{timeRemaining.seconds.toString().padStart(2, '0')}</div>
          <div className="text-xs text-muted-foreground">detik</div>
        </div>
      </div>
    </div>
  );
}

function calculateTimeRemaining(targetTime: number): TimeRemaining {
  const now = Math.floor(Date.now() / 1000);
  const difference = targetTime - now;

  if (difference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      expired: true
    };
  }

  const days = Math.floor(difference / (24 * 60 * 60));
  const hours = Math.floor((difference % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((difference % (60 * 60)) / 60);
  const seconds = difference % 60;

  return {
    days,
    hours,
    minutes,
    seconds,
    expired: false
  };
}

// Convenience component for heartbeat countdown
export function HeartbeatCountdown({ 
  lastHeartbeat, 
  heartbeatPeriod, 
  className 
}: { 
  lastHeartbeat: number; // Unix timestamp in seconds
  heartbeatPeriod: number; // in seconds
  className?: string;
}) {
  const targetTime = lastHeartbeat + heartbeatPeriod;
  
  return (
    <div className={className}>
      <div className="text-sm text-muted-foreground mb-1">Heartbeat expires in:</div>
      <CountdownTimer targetTime={targetTime} />
    </div>
  );
}
