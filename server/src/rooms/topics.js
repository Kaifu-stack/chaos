export function getRandomTopic() {
    const topics = [
        "🔥 Android vs iPhone",
        "💔 Love or Career?",
        "🤖 AI replacing jobs?",
        "🎬 Best movie ever?",
        "💰 Money vs Happiness?",
        "🎮 PUBG vs BGMI",
        "📱 Instagram vs YouTube",
        "🚀 Startup vs Job"
    ];

    return topics[Math.floor(Math.random() * topics.length)];
}