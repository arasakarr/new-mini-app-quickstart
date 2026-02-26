import React, { useState, useEffect } from 'react';

// Mock blockchain functions for demonstration
const mockBlockchain = {
  // Simulate sending a transaction
  sendTransaction: async (from, to, amount) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          hash: `0x${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
          from,
          to,
          amount,
          timestamp: Date.now(),
        });
      }, 1000); // Simulate network delay
    });
  },

  // Simulate getting wallet balance
  getBalance: async (address) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(Math.floor(Math.random() * 10000) / 100); // Random balance between 0-100
      }, 500);
    });
  },
};

// Mock wallet connection
const mockWallet = {
  connect: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          address: `0x${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
          chainId: 8453, // Base mainnet chain ID
        });
      }, 500);
    });
  },

  disconnect: () => {
    // Mock disconnection
  },
};

// Custom hook for wallet connection
export const useWallet = () => {
  const [wallet, setWallet] = useState(null);
  const [balance, setBalance] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      const connectedWallet = await mockWallet.connect();
      setWallet(connectedWallet);
      const userBalance = await mockBlockchain.getBalance(connectedWallet.address);
      setBalance(userBalance);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    mockWallet.disconnect();
    setWallet(null);
    setBalance(null);
  };

  const fetchBalance = async () => {
    if (wallet?.address) {
      try {
        const userBalance = await mockBlockchain.getBalance(wallet.address);
        setBalance(userBalance);
      } catch (error) {
        console.error("Failed to fetch balance:", error);
      }
    }
  };

  return {
    wallet,
    balance,
    isConnecting,
    connectWallet,
    disconnectWallet,
    fetchBalance,
  };
};

// Custom hook for transactions
export const useTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendSimpleTransaction = async (toAddress, amount) => {
    setIsLoading(true);
    try {
      const result = await mockBlockchain.sendTransaction(
        '0xYourMockAddress', 
        toAddress, 
        amount
      );
      
      setTransactions(prev => [result, ...prev]);
      return result;
    } catch (error) {
      console.error("Transaction failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    transactions,
    isLoading,
    sendSimpleTransaction,
  };
};

// Custom hook for game data persistence
export const useGamePersistence = () => {
  const saveData = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const loadData = (key, defaultValue = null) => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  };

  const clearData = (key) => {
    localStorage.removeItem(key);
  };

  return {
    saveData,
    loadData,
    clearData,
  };
};