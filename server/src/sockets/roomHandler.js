import {
    findOrCreateRoom,
    createRoom,
    addUserToRoom,
    removeUser,
    getUserRoom,
    rooms
} from "../rooms/roomManager.js";

import { generateName } from "../utils/generateName.js";
import { startTimer } from "../rooms/timer.js";

export function handleSocket(io, socket) {
    console.log("User connected:", socket.id);

    //  RANDOM JOIN
    socket.on("joinRoom", () => {
        const room = findOrCreateRoom();

        const user = {
            id: socket.id,
            name: generateName()
        };

        addUserToRoom(room.id, user);
        socket.join(room.id);

        if (room.users.length === 1) {
            startTimer(io, room.id, rooms);
        }

        socket.emit("roomData", { ...room, user });
        io.to(room.id).emit("updateUsers", room.users);
    });

    //  CREATE CUSTOM ROOM
    socket.on("createRoom", ({ timer }) => {
        const room = createRoom(timer);

        const user = {
            id: socket.id,
            name: generateName()
        };

        addUserToRoom(room.id, user);
        socket.join(room.id);

        startTimer(io, room.id, rooms);

        socket.emit("roomData", { ...room, user });
        io.to(room.id).emit("updateUsers", room.users);
    });
    socket.on("leaveRoom", () => {
        const room = getUserRoom(socket.id);
        if (!room) return;

        socket.leave(room.id);

        removeUser(socket.id);

        io.to(room.id).emit("updateUsers", room.users);
    });
    socket.on("joinByCode", ({ code }) => {
        const room = Object.values(rooms).find((r) => r.code === code);

        if (!room) {
            socket.emit("errorMsg", "Room not found");
            return;
        }

        const user = {
            id: socket.id,
            name: generateName()
        };

        addUserToRoom(room.id, user);
        socket.join(room.id);

        socket.emit("roomData", { ...room, user });
        io.to(room.id).emit("updateUsers", room.users);
    });
    // 💬 CHAT
    socket.on("sendMessage", (msg) => {
        const room = getUserRoom(socket.id);
        if (!room) return;

        const user = room.users.find((u) => u.id === socket.id);

        io.to(room.id).emit("receiveMessage", {
            user: user.name,
            text: msg
        });
    });

    //  EMOJI
    socket.on("sendEmoji", (emoji) => {
        const room = getUserRoom(socket.id);
        if (!room) return;

        io.to(room.id).emit("receiveEmoji", emoji);
    });

    //  WEBRTC SIGNALING
    socket.on("offer", ({ offer, to }) => {
        socket.to(to).emit("offer", { offer, from: socket.id });
    });

    socket.on("answer", ({ answer, to }) => {
        socket.to(to).emit("answer", { answer, from: socket.id });
    });

    socket.on("ice-candidate", ({ candidate, to }) => {
        socket.to(to).emit("ice-candidate", {
            candidate,
            from: socket.id
        });
    });

    //  DISCONNECT
    socket.on("disconnect", () => {
        const room = getUserRoom(socket.id);

        removeUser(socket.id);

        if (room) {
            io.to(room.id).emit("updateUsers", room.users);
        }

        console.log("User disconnected:", socket.id);
    });
}