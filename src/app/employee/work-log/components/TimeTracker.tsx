// src/app/employee/work-log/components/TimeTracker.tsx
"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Play, Pause, Square, Clock } from 'lucide-react';

export default function TimeTracker() {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentTask, setCurrentTask] = useState('');

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, isPaused]);

  // read query params to prefill task and optionally auto-start
  const searchParams = useSearchParams();
  useEffect(() => {
    if (!searchParams) return;
    const title = searchParams.get('title');
    const description = searchParams.get('description');
    const autoStart = searchParams.get('autoStart');
    if (title) {
      const combined = description ? `${title} - ${description}` : title;
      setCurrentTask(combined);
    }
    if (autoStart === 'true' || autoStart === '1') {
      if ((title || description) && !isRunning) {
        setIsRunning(true);
        setIsPaused(false);
      }
    }
    // we intentionally don't add isRunning to deps to avoid restarting interval unexpectedly
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleStart = () => {
    if (!currentTask.trim()) {
      alert('Please enter a task description');
      return;
    }
    setIsRunning(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleStop = () => {
    setIsRunning(false);
    setIsPaused(false);
    setElapsedTime(0);
    setCurrentTask('');
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
          <Clock className="w-5 h-5 text-orange-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Time Tracker</h3>
          <p className="text-gray-400 text-sm">Track your work hours in real-time</p>
        </div>
      </div>

      {/* Timer Display */}
      <div className="mb-6">
        <div className="bg-gray-800/50 rounded-xl p-8 text-center border border-gray-700">
          <div className="text-6xl font-bold text-white mb-2 font-mono tracking-wider">
            {formatTime(elapsedTime)}
          </div>
          {isRunning && (
            <div className="flex items-center justify-center space-x-2 text-sm">
              <div className={`w-2 h-2 rounded-full ${isPaused ? 'bg-yellow-500' : 'bg-green-500'} animate-pulse`}></div>
              <span className={isPaused ? 'text-yellow-400' : 'text-green-400'}>
                {isPaused ? 'Paused' : 'In Progress'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Task Input */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-300 mb-2">
          Current Task
        </label>
        <input
          type="text"
          value={currentTask}
          onChange={(e) => setCurrentTask(e.target.value)}
          placeholder="e.g., Oil Change - Toyota Camry"
          disabled={isRunning}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-3">
        {!isRunning ? (
          <button
            onClick={handleStart}
            className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all font-medium shadow-lg shadow-orange-500/30"
          >
            <Play className="w-5 h-5" />
            <span>Start Timer</span>
          </button>
        ) : (
          <>
            <button
              onClick={handlePause}
              className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium border border-gray-700"
            >
              <Pause className="w-5 h-5" />
              <span>{isPaused ? 'Resume' : 'Pause'}</span>
            </button>
            <button
              onClick={handleStop}
              className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors font-medium border border-red-500/30"
            >
              <Square className="w-5 h-5" />
              <span>Stop</span>
            </button>
          </>
        )}
      </div>

      {/* Quick Stats */}
      {isRunning && (
        <div className="mt-6 pt-6 border-t border-gray-800">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800/50 rounded-lg p-3">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">
                Task Started
              </p>
              <p className="text-white font-medium">
                {new Date(Date.now() - elapsedTime * 1000).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">
                Est. Earnings
              </p>
              <p className="text-green-400 font-bold">
                ${((elapsedTime / 3600) * 30).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}