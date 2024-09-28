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

    socket.emit('welcome', `Welcome to the server, ${socket.id}`);
    socket.broadcast.emit('welcome', `${socket.id} Welcome to the server`);

    
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
