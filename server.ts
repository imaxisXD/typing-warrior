const next = require('next');
const http = require('http');
import { Server, Socket } from 'socket.io';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const server = http.createServer(app.getRequestHandler());

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000"
    }
});

io.on('connection', (socket: Socket) => {
    console.log(`Socket ${socket.id} connected`);

    socket.on('disconnect', () => {
        console.log(`Socket ${socket.id} disconnected`);
    });
});

const PORT = process.env.PORT || 3500;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
