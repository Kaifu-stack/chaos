export default function RoomHeader({
    topic,
    timer,
    users,
    roomCode,
    leaveRoom
}) {

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;

        return `${mins}:${secs
            .toString()
            .padStart(2, "0")}`;
    };

    return (
        <div className="border-b border-white/10 bg-black/20 backdrop-blur-xl px-6 py-5 flex items-center justify-between">

            {/* LEFT */}
            <div>

                <div className="flex items-center gap-3">

                    <h2 className="text-2xl font-bold">
                        {topic}
                    </h2>

                    {roomCode && (
                        <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">
                            🔑 {roomCode}
                        </span>
                    )}

                </div>

                <p className="text-gray-400 mt-1">
                    ⏳ {formatTime(timer)} • 👥 {users.length} users online
                </p>

            </div>

            {/* RIGHT */}
            <button
                onClick={leaveRoom}
                className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-4 py-3 rounded-2xl transition"
            >
                🚪 Leave
            </button>

        </div>
    );
}