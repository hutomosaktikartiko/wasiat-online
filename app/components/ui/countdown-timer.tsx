import React, { useState, useEffect } from "react";
import { cn } from "../../lib/utils";

interface CountdownTimerProps {
  targetDate: Date;
  onExpired?: () => void;
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
  targetDate, 
  onExpired, 
  className,
  size = "md" 
}: CountdownTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>(() => 
    calculateTimeRemaining(targetDate)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = calculateTimeRemaining(targetDate);
      setTimeRemaining(remaining);
      
      if (remaining.expired && onExpired) {
        onExpired();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate, onExpired]);

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

function calculateTimeRemaining(targetDate: Date): TimeRemaining {
  const now = new Date().getTime();
  const target = targetDate.getTime();
  const difference = target - now;

  if (difference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      expired: true
    };
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

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
  lastHeartbeat: Date; 
  heartbeatPeriod: number; // in days
  className?: string;
}) {
  const targetDate = new Date(lastHeartbeat.getTime() + heartbeatPeriod * 24 * 60 * 60 * 1000);
  
  return (
    <div className={className}>
      <div className="text-sm text-muted-foreground mb-1">Heartbeat expires in:</div>
      <CountdownTimer targetDate={targetDate} />
    </div>
  );
}
