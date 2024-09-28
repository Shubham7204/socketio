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
    
    // Emit the user ID to the client
    socket.emit('user-id', socket.id);

    socket.on('message', (data) => {
        console.log(`Message from ${socket.id}: ${data.message} to ${data.to}`);
        // Send message to a specific user by their socket ID
        io.to(data.to).emit('receive-message', data.message); 
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
