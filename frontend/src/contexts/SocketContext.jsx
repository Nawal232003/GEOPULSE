import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [articles, setArticles] = useState([]);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // Attempt connection
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
        const newSocket = io(backendUrl);
        setSocket(newSocket);

        newSocket.on('connect', () => {
            setIsConnected(true);
        });

        newSocket.on('disconnect', () => {
            setIsConnected(false);
        });

        newSocket.on('initial_articles', (data) => {
            setArticles(data);
        });

        newSocket.on('new_article', (article) => {
            setArticles(prev => [article, ...prev].slice(0, 50)); // Keep max 50 in state
        });

        return () => newSocket.close();
    }, []);

    return (
        <SocketContext.Provider value={{ socket, articles, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);
