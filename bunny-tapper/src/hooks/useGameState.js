import React, { useState, useEffect } from 'react';
import { useGamePersistence } from './useBlockchain';

const useGameState = () => {
  const [screen, setScreen] = useState('menu');
  const [score, setScore] = useState(0);
  const [tapValue, setTapValue] = useState(1); // Base tap value
  const [checkins, setCheckins] = useState(0); // Number of consecutive check-ins
  const [lastCheckinDate, setLastCheckinDate] = useState(null); // Last check-in date
  const [multiplier, setMultiplier] = useState(1.0); // Tap multiplier
  const [timeLeft, setTimeLeft] = useState(0); // Time left for next check-in (in seconds)
  const [leaderboard, setLeaderboard] = useState([
    { id: 1, name: 'User 1', score: 1000 },
    { id: 2, name: 'User 2', score: 850 },
    { id: 3, name: 'User 3', score: 720 },
  ]);
  
  const { loadData, saveData } = useGamePersistence();

  // Load game state from localStorage on initialization
  useEffect(() => {
    const savedState = loadData('bunnyTapperGameState');
    if (savedState) {
      setScore(savedState.score || 0);
      setCheckins(savedState.checkins || 0);
      setLastCheckinDate(savedState.lastCheckinDate || null);
      setMultiplier(savedState.multiplier || 1.0);
      setLeaderboard(savedState.leaderboard || [
        { id: 1, name: 'User 1', score: 1000 },
        { id: 2, name: 'User 2', score: 850 },
        { id: 3, name: 'User 3', score: 720 },
      ]);
    }
  }, []);

  // Save game state to localStorage whenever it changes
  useEffect(() => {
    const gameStateToSave = {
      score,
      checkins,
      lastCheckinDate,
      multiplier,
      leaderboard
    };
    saveData('bunnyTapperGameState', gameStateToSave);
  }, [score, checkins, lastCheckinDate, multiplier, leaderboard]);

  // Calculate time until next UTC midnight
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const utcMidnight = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0, 0);
      const diff = Math.floor((utcMidnight.getTime() - now.getTime()) / 1000);
      return diff > 0 ? diff : 0;
    };

    setTimeLeft(calculateTimeLeft());
    
    // Update time left every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Handle tapping the bunny
  const handleTap = () => {
    const points = tapValue * multiplier;
    setScore(prev => prev + points);
  };

  // Handle daily check-in
  const handleCheckin = () => {
    const today = new Date().toDateString();
    const lastCheckin = lastCheckinDate;

    // Check if user already checked in today
    if (lastCheckin === today) {
      return; // Already checked in today
    }

    // Check if it's consecutive day or first check-in
    const now = new Date();
    const currentDay = now.toDateString();
    
    if (!lastCheckin) {
      // First check-in
      setCheckins(1);
      setMultiplier(1.1); // 10% bonus
    } else {
      const lastCheckinDateObj = new Date(lastCheckin);
      const expectedDate = new Date(lastCheckinDateObj);
      expectedDate.setDate(expectedDate.getDate() + 1);
      
      if (currentDay === expectedDate.toDateString()) {
        // Consecutive check-in
        setCheckins(prev => prev + 1);
        setMultiplier(prev => prev * 1.1); // 10% bonus
      } else {
        // Broke the streak
        setCheckins(1);
        setMultiplier(1.1); // Reset to 10% bonus
      }
    }

    setLastCheckinDate(currentDay);
  };

  // Format time for display
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return {
    screen,
    setScreen,
    score,
    tapValue,
    checkins,
    multiplier,
    timeLeft,
    leaderboard,
    handleTap,
    handleCheckin,
    formatTime
  };
};

export default useGameState;