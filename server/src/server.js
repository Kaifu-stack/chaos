import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

import { handleSocket } from "./sockets/roomHandler.js";

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

app.get("/", (req, res) => {
    res.send("Server running..");
});

io.on("connection", (socket) => {
    handleSocket(io, socket);
});

server.listen(5000, () => {
    console.log("Server running on port 5000");
});