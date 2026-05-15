export default function RoomHeader({ topic, timer, users }) {
    return (
        <div>
            <h2>{topic}</h2>
            <p>⏳ {timer}s | 👥 {users.length}</p>
        </div>
    );
}