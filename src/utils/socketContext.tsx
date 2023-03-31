import { createContext, useContext } from 'react';
import { Socket } from 'socket.io';
import io from 'socket.io-client';
import { DefaultEventsMap } from 'socket.io/dist/typed-events';

interface CustomSocket extends Socket<DefaultEventsMap, DefaultEventsMap> {
    join(roomName: string): void;
    connected: boolean;
}
const SocketContext = createContext<CustomSocket | null>(null);
let socket: CustomSocket;

async function socketConnection() {
    try {
        await fetch(`/api/socket`);
        socket = io() as unknown as CustomSocket; // Cast to CustomSocket to avoid type errors
        socket.on('connect', () => {
            console.log(`connection:` + socket.connected);
        });
    } catch (err) {
        console.log(err);
    }
}

socketConnection();

type SocketProviderProps = {
    children: React.ReactNode;
};

export const SocketProvider = ({ children }: SocketProviderProps) => {
    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    return useContext(SocketContext);
};
