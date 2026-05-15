export default function MessageBubble({ msg }) {
    return (
        <p>
            <b>{msg.user}:</b> {msg.text}
        </p>
    );
}