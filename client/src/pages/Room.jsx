import { useEffect, useRef } from "react";

export default function Room({
    room,
    users,
    timer,
    chat,
    message,
    setMessage,
    sendMessage,
    joinVoice,
    leaveVoice,
    toggleMute,
    inVoice,
    muted,
    speaking,
    socketId,
    sendEmoji,
    leaveRoom,
}) {

    const emojis = [
        "🔥", "😂", "💀", "❤️",
        "😎", "😭", "🤯", "😈",
        "👍", "👎", "👏", "🙌",
        "💯", "🥶", "😡", "🥳",
        "🤔", "😴", "👀", "🚀"
    ];

    const chatRef = useRef(null);

    useEffect(() => {
        chatRef.current?.scrollTo({
            top: chatRef.current.scrollHeight,
            behavior: "smooth"
        });
    }, [chat]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;

        return `${mins}:${secs
            .toString()
            .padStart(2, "0")}`;
    };

    return (
        <div className="min-h-screen bg-[#070b14] text-white flex overflow-hidden">

            {/* 👥 SIDEBAR */}
            <div className="w-[75] border-r border-white/10 bg-white/5 backdrop-blur-xl p-5 hidden md:flex flex-col">

                {/* LOGO */}
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-black tracking-wide">
                        🔥 Vynqo
                    </h1>

                    <button
                        onClick={leaveRoom}
                        className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-3 py-2 rounded-xl transition"
                    >
                        🚪
                    </button>
                </div>

                {/* ROOM */}
                <div className="bg-white/5 rounded-2xl p-4 border border-white/10 mb-5">
                    <p className="text-sm text-gray-400">
                        Topic
                    </p>

                    <h2 className="text-xl font-bold mt-2">
                        {room.topic}
                    </h2>

                    {room.code && (
                        <div className="mt-4 flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-400">
                                    Room Code
                                </p>

                                <p className="font-bold tracking-widest">
                                    {room.code}
                                </p>
                            </div>

                            <button
                                onClick={() =>
                                    navigator.clipboard.writeText(room.code)
                                }
                                className="bg-blue-500/20 hover:bg-blue-500/30 px-3 py-2 rounded-xl text-sm"
                            >
                                Copy
                            </button>
                        </div>
                    )}
                </div>

                {/* INFO */}
                <div className="flex justify-between text-sm bg-white/5 rounded-2xl p-4 border border-white/10">
                    <div>
                        ⏳ {formatTime(timer)}
                    </div>

                    <div>
                        👥 {users.length}
                    </div>
                </div>

                {/* USERS */}
                <div className="mt-6 flex-1 overflow-y-auto">
                    <h3 className="text-sm text-gray-400 mb-4">
                        Active Users
                    </h3>

                    <div className="space-y-3">
                        {users.map((u) => (
                            <div
                                key={u.id}
                                className={`flex items-center gap-3 p-3 rounded-2xl border transition
                                
                                ${u.id === socketId
                                        ? "bg-blue-500/10 border-blue-500/30"
                                        : "bg-white/5 border-white/10"
                                    }

                                ${u.id === socketId && speaking
                                        ? "shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                                        : ""
                                    }
                                `}
                            >

                                {/* AVATAR */}
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold
                                    
                                    ${u.id === socketId
                                            ? "bg-blue-500"
                                            : "bg-purple-500"
                                        }
                                    `}
                                >
                                    {u.name?.charAt(0)}
                                </div>

                                {/* INFO */}
                                <div className="flex-1">
                                    <p className="font-semibold">
                                        {u.id === socketId
                                            ? "You"
                                            : u.name}
                                    </p>

                                    <p className="text-xs text-gray-400">
                                        {u.id === socketId && speaking
                                            ? "🎤 Speaking..."
                                            : "Online"}
                                    </p>
                                </div>

                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* 💬 MAIN */}
            <div className="flex-1 flex flex-col">

                {/* TOPBAR */}
                <div className="border-b border-white/10 bg-black/20 backdrop-blur-xl px-6 py-4 flex items-center justify-between">

                    <div>
                        <h2 className="text-xl font-bold">
                            {room.topic}
                        </h2>

                        <p className="text-sm text-gray-400">
                            Realtime chaos room
                        </p>
                    </div>

                    {/* VOICE */}
                    <div className="flex items-center gap-3">

                        {!inVoice ? (
                            <button
                                onClick={joinVoice}
                                className="bg-green-500 hover:bg-green-600 px-5 py-3 rounded-2xl font-semibold transition shadow-lg shadow-green-500/20"
                            >
                                🎤 Join Voice
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={leaveVoice}
                                    className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-5 py-3 rounded-2xl font-semibold transition"
                                >
                                    Disconnect
                                </button>

                                <button
                                    onClick={toggleMute}
                                    className={`px-5 py-3 rounded-2xl font-semibold transition

                                    ${muted
                                            ? "bg-yellow-500/20 text-yellow-300"
                                            : "bg-blue-500 text-white"
                                        }
                                    `}
                                >
                                    {muted
                                        ? "🔇 Unmute"
                                        : "🎙️ Mute"}
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* CHAT */}
                <div
                    ref={chatRef}
                    className="flex-1 overflow-y-auto p-6 space-y-4"
                >
                    {chat.map((msg, i) => (
                        <div
                            key={i}
                            className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-xl"
                        >
                            <div className="flex items-center gap-2 mb-2">

                                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold">
                                    {msg.user?.charAt(0)}
                                </div>

                                <p className="font-semibold">
                                    {msg.user}
                                </p>
                            </div>

                            <p className="text-gray-200 leading-relaxed">
                                {msg.text}
                            </p>
                        </div>
                    ))}
                </div>

                {/* INPUT */}
                <div className="border-t border-white/10 p-5 bg-black/20 backdrop-blur-xl">

                    <div className="flex gap-3">

                        <input
                            value={message}
                            onChange={(e) =>
                                setMessage(e.target.value)
                            }
                            placeholder="Type something chaotic..."
                            className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-blue-500 transition"
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    sendMessage();
                                }
                            }}
                        />

                        <button
                            onClick={sendMessage}
                            disabled={!message.trim()}
                            className="bg-blue-500 hover:bg-blue-600 disabled:opacity-40 px-6 py-4 rounded-2xl font-bold transition shadow-lg shadow-blue-500/20"
                        >
                            Send
                        </button>

                    </div>

                    {/* EMOJIS */}
                    <div className="flex gap-2 overflow-x-auto mt-5 pb-2">

                        {emojis.map((e, i) => (
                            <button
                                key={i}
                                onClick={() => sendEmoji(e)}
                                className="min-w-[12.5] h-[12.5] text-2xl bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition hover:scale-110"
                            >
                                {e}
                            </button>
                        ))}

                    </div>

                </div>

            </div>
        </div>
    );
}