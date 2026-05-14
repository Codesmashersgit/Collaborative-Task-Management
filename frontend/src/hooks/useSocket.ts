import { useEffect, useState } from 'react';
import { getSocket } from '../lib/socket';
import type { Socket } from 'socket.io-client';

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected';

export const useSocket = () => {
  const [status, setStatus] = useState<ConnectionStatus>('connecting');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setStatus('disconnected');
      return;
    }

    const socket: Socket = getSocket(token);

    // Initial check
    if (socket.connected) {
      setStatus('connected');
    }

    const onConnect = () => setStatus('connected');
    const onDisconnect = () => setStatus('disconnected');
    const onConnectError = () => setStatus('disconnected');

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onConnectError);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error', onConnectError);
    };
  }, []);

  return { 
    status, 
    isConnected: status === 'connected',
    isConnecting: status === 'connecting'
  };
};

