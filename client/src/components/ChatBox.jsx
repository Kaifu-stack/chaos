import MessageBubble from "./MessageBubble";

export default function ChatBox({ chat }) {
    return (
        <div>
            {chat.map((msg, i) => (
                <MessageBubble key={i} msg={msg} />
            ))}
        </div>
    );
}