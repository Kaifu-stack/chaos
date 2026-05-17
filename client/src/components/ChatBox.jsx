import MessageBubble from "./MessageBubble";

export default function ChatBox({ chat, chatRef }) {
    return (
        <div
            ref={chatRef}
            className="flex-1 overflow-y-auto p-6 space-y-4"
        >
            {chat.map((msg, i) => (
                <MessageBubble key={i} msg={msg} />
            ))}
        </div>
    );
}