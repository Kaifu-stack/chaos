export default function Timer({ timer }) {

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;

        return `${mins}:${secs
            .toString()
            .padStart(2, "0")}`;
    };

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-2 text-sm text-gray-300">
            ⏳ {formatTime(timer)}
        </div>
    );
}