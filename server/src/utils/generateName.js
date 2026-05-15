const names = ["Shadow", "Blaze", "Ghost", "Viper", "Nova"];
const animals = ["Tiger", "Fox", "Wolf", "Eagle", "Dragon"];

export function generateName() {
    const n = names[Math.floor(Math.random() * names.length)];
    const a = animals[Math.floor(Math.random() * animals.length)];
    return n + a;
}