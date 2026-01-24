import { io } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_DEVELOPMENT_URL || 'http://localhost:8000';

export const socket = io(SOCKET_URL, {
    autoConnect: true,
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
});

export const joinRoom = (room: string) => {
    if (socket.connected) {
        socket.emit("join_room", room);
    } else {
        socket.on("connect", () => {
            socket.emit("join_room", room);
        });
    }
};
