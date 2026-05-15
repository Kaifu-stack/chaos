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

    // ✅ emoji list (easy to scale)
    const emojis = [
        "🔥", "😂", "💀", "❤️",
        "😎", "😭", "🤯", "😈",
        "👍", "👎", "👏", "🙌",
        "💯", "🥶", "😡", "🥳",
        "🤔", "😴", "👀", "🚀"
    ];

    return (
        <div className="app-container">
            <div className="room-card">

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h2>{room.topic}</h2>
                    <button onClick={leaveRoom}>🚪 Leave</button>
                </div>
                {room.code && (
                    <div style={{ textAlign: "center", marginBottom: "10px" }}>
                        🔑 Code: <b>{room.code}</b>
                    </div>
                )}

                <div className="room-info">
                    ⏳ {timer}s | 👥 {users.length}
                </div>

                {/* USERS */}
                <div>
                    {users.map((u, i) => (
                        <div
                            key={u.id} // ✅ better key
                            className={`user ${u.id === socketId ? "you" : ""}`}
                        >
                            {u.id === socketId && speaking ? "🟢🔊 YOU" : "🟢"} {u.name}
                        </div>
                    ))}
                </div>

                {/* VOICE */}
                <div style={{ textAlign: "center", margin: "10px 0" }}>
                    {!inVoice ? (
                        <button onClick={joinVoice}>🎤 Join Voice</button>
                    ) : (
                        <>
                            <button onClick={leaveVoice}>🚪 Leave</button>
                            <button onClick={toggleMute}>
                                {muted ? "🔇 Unmute" : "🎙️ Mute"}
                            </button>
                        </>
                    )}
                </div>

                {/* CHAT */}
                <div className="chat-box">
                    {chat.map((msg, i) => (
                        <p key={i}>
                            <b>{msg.user}:</b> {msg.text}
                        </p>
                    ))}
                </div>

                {/* INPUT */}
                <div className="input-row">
                    <input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type something..."
                    />
                    <button onClick={sendMessage}>Send</button>
                </div>

                {/* EMOJIS */}
                <div className="emoji-bar">
                    {emojis.map((e, i) => (
                        <button key={i} onClick={() => sendEmoji(e)}>
                            {e}
                        </button>
                    ))}
                </div>

            </div>
        </div>
    );
}