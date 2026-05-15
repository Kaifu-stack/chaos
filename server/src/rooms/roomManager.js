import { getRandomTopic } from "./topics.js";

const rooms = {};
const MAX_USERS = 5;
function generateCode() {
    return Math.random().toString(36).substring(2, 7).toUpperCase();
}
export function findOrCreateRoom() {
    let room = Object.values(rooms).find(
        (r) => r.users.length < MAX_USERS && !r.isCustom
    );

    if (!room) {
        const id = "room_" + Date.now();

        room = {
            id,
            code: null,
            users: [],
            topic: getRandomTopic(),
            timer: 300,
            isCustom: false
        };

        rooms[id] = room;
    }

    return room;
}


export function createRoom(timer) {
    const id = "room_" + Date.now();

    const room = {
        id,
        code: generateCode(),
        users: [],
        topic: getRandomTopic(),
        timer: timer || 60,
        isCustom: true
    };

    rooms[id] = room;

    return room;
}

export function addUserToRoom(roomId, user) {
    rooms[roomId].users.push(user);
}

export function removeUser(socketId) {
    for (let roomId in rooms) {
        const room = rooms[roomId];

        room.users = room.users.filter((u) => u.id !== socketId);

        if (room.users.length === 0) {
            delete rooms[roomId];
        }
    }
}

export function getUserRoom(socketId) {
    for (let roomId in rooms) {
        const room = rooms[roomId];
        if (room.users.find((u) => u.id === socketId)) {
            return room;
        }
    }
}

export { rooms };