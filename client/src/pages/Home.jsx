import { useState } from "react";

export default function VynqoLandingPage({
    joinRoom,
    createRoom,
    joinByCode
}) {

    const [timer, setTimer] = useState(300);
    const [code, setCode] = useState("");

    return (
        <div className="min-h-screen bg-[#111125] text-white overflow-x-hidden relative">

            {/* NAVBAR */}
            <nav className="flex items-center justify-between px-8 py-6 border-b border-white/10 backdrop-blur-lg sticky top-0 z-50 bg-black/20">
                <button onClick={() => window.scrollTo({ top: 10, behavior: "smooth" })}
                    className="text-4xl font-bold flex items-center gap-2 hover:scale-105 transition duration-300 cursor-pointer"><span className="animate-pulse">🔥</span> Chaos</button>

                <div className="flex gap-4">

                    <button
                        onClick={() => {
                            document
                                .getElementById("features")
                                ?.scrollIntoView({
                                    behavior: "smooth"
                                });
                        }}
                        className="
                                px-4 py-2
                                rounded-xl
                                bg-white/10
                                hover:bg-white/20
                                transition
                            "
                    >
                        Features
                    </button>

                    <button
                        onClick={joinRoom}
                        className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 transition shadow-lg shadow-blue-500/30"
                    >
                        Launch App
                    </button>

                </div>
            </nav>

            {/* HERO */}
            <section className="relative flex flex-col items-center justify-center text-center px-6 py-12">

                {/* Glow */}
                <div className="absolute w-96 h-96 rounded-full bg-blue-500/30 blur-[140px] -z-10" />

                <div className="relative z-10 max-w-4xl">

                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 mb-6">
                        <span className="animate-pulse">🟢</span>
                        Realtime Voice + Chaos Rooms
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tight">
                        Where Random
                        <span className="text-blue-400"> Voices </span>
                        Collide.
                    </h1>

                    <p className="mt-6 text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
                        Join random debate rooms, talk with strangers using live voice chat,
                        react with insane emojis, and experience realtime internet chaos.
                    </p>

                    {/* MAIN BUTTONS */}
                    <div className="mt-10 flex flex-wrap justify-center gap-4">

                        <button
                            onClick={joinRoom}
                            className="px-6 py-4 rounded-xl bg-blue-500 hover:bg-blue-600 transition text-lg font-semibold shadow-2xl shadow-blue-500/30 hover:scale-105 duration-200"
                        >
                            🚀 Enter Chaos
                        </button>

                        <button
                            onClick={() => createRoom(timer)}
                            className="px-6 py-4 rounded-xl bg-white/10 hover:bg-white/20 transition text-lg font-semibold border border-white/10 hover:scale-105 duration-200"
                        >
                            🎤 Create Voice Room
                        </button>

                    </div>

                    {/* TIMER */}
                    <div className="mt-6 flex justify-center">

                        <select
                            value={timer}
                            onChange={(e) =>
                                setTimer(Number(e.target.value))
                            }
                            className="
                                    bg-[#1a1a2e]
                                    border border-white/10
                                    text-white
                                    px-4 py-3
                                    rounded-xl
                                    outline-none
                                    hover:border-blue-400
                                    focus:border-blue-500
                                    transition
                                "
                        >
                            <option value={60}>1 Minute</option>
                            <option value={120}>2 Minutes</option>
                            <option value={300}>5 Minutes</option>
                            <option value={600}>10 Minutes</option>
                        </select>

                    </div>

                    {/* JOIN BY CODE */}
                    <div className="mt-6 flex flex-wrap justify-center gap-3">

                        <input
                            placeholder="Enter Room Code"
                            value={code}
                            onChange={(e) =>
                                setCode(
                                    e.target.value.toUpperCase()
                                )
                            }
                            className="px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white outline-none w-62.5"
                        />

                        <button
                            onClick={() => {
                                if (!code.trim()) return;
                                joinByCode(code);
                            }}
                            className="px-6 py-3 rounded-xl bg-purple-500 hover:bg-purple-600 transition font-semibold hover:scale-105 duration-200 text-lg shadow-lg shadow-purple-500/30  "
                        >
                            🔑 Join Room
                        </button>

                    </div>

                    {/* FEATURES */}
                    <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-gray-400">

                        <div>⚡ Realtime Chat</div>

                        <div>🎤 WebRTC Voice</div>

                        <div>🔥 Emoji Reactions</div>

                        <div>🔑 Private Rooms</div>

                    </div>

                </div>
            </section>

            {/* FEATURES SECTION */}
            <section
                id="features"
                className="px-6 py-20 max-w-7xl mx-auto"
            >

                <div className="text-center mb-16">

                    <h2 className="text-4xl font-bold">
                        Built for internet chaos.
                    </h2>

                    <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
                        Vynqo Chaos combines anonymous social interaction,
                        live voice, realtime messaging, and reaction systems.
                    </p>

                </div>

                <div className="grid md:grid-cols-3 gap-8">

                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:-translate-y-2 transition duration-300 backdrop-blur-lg">
                        <div className="text-5xl mb-6">🎲</div>

                        <h3 className="text-2xl font-bold mb-4">
                            Random Chaos Rooms
                        </h3>

                        <p className="text-gray-400 leading-relaxed">
                            Instantly join random debate rooms.
                        </p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:-translate-y-2 transition duration-300 backdrop-blur-lg">
                        <div className="text-5xl mb-6">🎤</div>

                        <h3 className="text-2xl font-bold mb-4">
                            Live Voice Chat
                        </h3>

                        <p className="text-gray-400 leading-relaxed">
                            Talk in realtime using WebRTC voice.
                        </p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:-translate-y-2 transition duration-300 backdrop-blur-lg">
                        <div className="text-5xl mb-6">🔥</div>

                        <h3 className="text-2xl font-bold mb-4">
                            Emoji Reactions
                        </h3>

                        <p className="text-gray-400 leading-relaxed">
                            Send animated reactions across the screen.
                        </p>
                    </div>

                </div>

            </section>

            {/* FOOTER */}
            <footer className="border-t border-white/10 py-8 text-center text-gray-500 text-sm">
                Made with ❤️ by Md Kaif Alam • Vynqo Chaos © 2026
            </footer>

        </div>
    );
}