import express from 'express';
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";

const port = 3000;
const app = express();
const server = createServer(app);

app.use(cors({
    origin: "http://localhost:5173", 
    methods: ["GET", "POST"],
    credentials: true,
}));

// Create socket.io server
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", 
        methods: ["GET", "POST"],
    }
});

// Socket.io connection event
io.on("connection", (socket) => {
    console.log("User connected");
    console.log("ID", socket.id);

    // Optionally handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// HTTP route for testing
app.get('/', (req, res) => {
    res.send('Hello World');
});

// Start the server
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
