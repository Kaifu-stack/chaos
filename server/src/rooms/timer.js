export function startTimer(io, roomId, rooms) {
    let time = rooms[roomId]?.timer || 60;

    const interval = setInterval(() => {
        if (!rooms[roomId]) return clearInterval(interval);

        io.to(roomId).emit("timer", time);

        time--;

        if (time < 0) {
            io.to(roomId).emit("roomEnded");

            delete rooms[roomId];
            clearInterval(interval);
        }
    }, 1000);
}