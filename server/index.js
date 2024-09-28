import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import cors from 'cors';

const port = 3000;
const app = express();
const server = createServer(app);

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
}));

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
    }
});

io.on('connection', (socket) => {
    console.log('User connected');
    console.log('ID:', socket.id);
    socket.emit('user-id', socket.id);

    socket.on('join-room', (room) => {
        socket.join(room);
        console.log(`User ${socket.id} joined room: ${room}`);
        socket.emit('room-joined', room);
    });

    socket.on('message-to-room', ({ message, room }) => {
        console.log(`Message from ${socket.id} to room: ${room}`);
        io.to(room).emit('receive-message', message);
    });

    socket.on('message-to-socket', ({ message, targetSocketID }) => {
        console.log(`Message from ${socket.id} to ${targetSocketID}: ${message}`);
        io.to(targetSocketID).emit('receive-message', message);
    });

    socket.on('broadcast-message', ({ message }) => {
        console.log(`Broadcast message from ${socket.id}: ${message}`);
        socket.broadcast.emit('receive-message', message);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

app.get('/', (req, res) => {
    res.send('Hello World');
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});