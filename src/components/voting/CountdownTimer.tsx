"use client";

import { useState, useEffect } from "react";

export default function CountdownTimer({ initialSeconds }: { initialSeconds: number }) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    setSeconds(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (seconds <= 0) return;
    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [seconds > 0]);

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const pad = (n: number) => n.toString().padStart(2, "0");

  if (seconds <= 0) {
    return (
      <div className="text-center text-3xl font-mono font-bold text-light-pink animate-pulse">
        VOTING ENDED
      </div>
    );
  }

  return (
    <div className="text-center">
      <p className="text-xs uppercase tracking-widest text-muted-blue mb-1">
        Time Remaining
      </p>
      <div className="flex items-center justify-center gap-3">
        {seconds > 3600 && (
          <>
            <div className="text-center">
              <span className="text-3xl font-mono font-bold text-white">
                {pad(hours)}
              </span>
              <div className="text-xs text-muted-blue">hrs</div>
            </div>
            <span className="text-2xl font-bold text-soft-purple">:</span>
          </>
        )}
        <div className="text-center">
          <span className="text-3xl font-mono font-bold text-white">
            {pad(minutes)}
          </span>
          <div className="text-xs text-muted-blue">min</div>
        </div>
        <span className="text-2xl font-bold text-soft-purple">:</span>
        <div className="text-center">
          <span className="text-3xl font-mono font-bold text-white">
            {pad(secs)}
          </span>
          <div className="text-xs text-muted-blue">sec</div>
        </div>
      </div>
    </div>
  );
}
