import React, { useState, useEffect, useCallback } from 'react';
import { Timer, Pause, Play, RotateCcw, Flag } from 'lucide-react';

interface LapTime {
  id: number;
  time: string;
  duration: string;
}

export function Stopwatch() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<LapTime[]>([]);
  const [lastLapTime, setLastLapTime] = useState(0);

  const formatTime = useCallback((ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  }, []);

  useEffect(() => {
    let interval: number | undefined;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
    setLastLapTime(0);
  };

  const handleLap = () => {
    if (!isRunning) return;
    
    const lapTime = time - lastLapTime;
    const newLap: LapTime = {
      id: laps.length + 1,
      time: formatTime(time),
      duration: formatTime(lapTime),
    };
    
    setLaps((prevLaps) => [newLap, ...prevLaps]);
    setLastLapTime(time);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block p-4 rounded-full bg-gray-800 shadow-xl mb-6">
            <Timer className="w-12 h-12 text-blue-400" />
          </div>
          <div className="text-6xl font-mono font-bold tracking-wider mb-8">
            {formatTime(time)}
          </div>
          
          <div className="flex justify-center gap-4 mb-8">
            <button
              onClick={handleStartStop}
              className="p-4 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg"
            >
              {isRunning ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6" />
              )}
            </button>
            
            <button
              onClick={handleLap}
              className="p-4 rounded-full bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 transition-all shadow-lg"
              disabled={!isRunning}
            >
              <Flag className="w-6 h-6" />
            </button>
            
            <button
              onClick={handleReset}
              className="p-4 rounded-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all shadow-lg"
            >
              <RotateCcw className="w-6 h-6" />
            </button>
          </div>
        </div>

        {laps.length > 0 && (
          <div className="bg-gray-800 rounded-xl p-4 shadow-xl">
            <h2 className="text-xl font-semibold mb-4">Lap Times</h2>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {laps.map((lap) => (
                <div
                  key={lap.id}
                  className="flex justify-between items-center p-3 bg-gray-700 rounded-lg"
                >
                  <span className="text-gray-400">Lap {lap.id}</span>
                  <div className="space-x-4">
                    <span className="text-blue-400">{lap.duration}</span>
                    <span className="text-gray-400">{lap.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}