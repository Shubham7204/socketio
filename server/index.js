import express from 'express';
import { Server } from "socket.io";
import {createServer} from "http";

const port = 3000;
const app = express();
const server = createServer(app);

const io = new Server(server);

io.on("Connection", (socket)=>{
    console.log("User connected");
    console.log("ID", socket.id);
})

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
