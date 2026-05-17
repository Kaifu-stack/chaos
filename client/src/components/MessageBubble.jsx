export default function MessageBubble({ msg }) {
    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-xl">

            <div className="flex items-center gap-3 mb-2">

                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center font-bold">
                    {msg.user?.charAt(0)}
                </div>

                {/* Username */}
                <div>
                    <p className="font-semibold">
                        {msg.user}
                    </p>

                    <p className="text-xs text-gray-400">
                        Live message
                    </p>
                </div>

            </div>

            {/* Message */}
            <p className="text-gray-200 leading-relaxed">
                {msg.text}
            </p>

        </div>
    );
}