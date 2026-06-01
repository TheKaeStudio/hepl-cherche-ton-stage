/**
 * Génère une couleur HSL déterministe à partir d'un nom.
 * Même nom → même couleur, partout, sans stockage.
 * Basé sur djb2 hash → hue HSL avec saturation et luminosité fixes pour un résultat agréable.
 */
export function colorFromName(name) {
    if (!name) return "#6b7280";
    let hash = 5381;
    for (let i = 0; i < name.length; i++) {
        hash = ((hash << 5) + hash) ^ name.charCodeAt(i);
    }
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 62%, 42%)`;
}

export function colorBgFromName(name) {
    if (!name) return "rgba(107,114,128,0.12)";
    let hash = 5381;
    for (let i = 0; i < name.length; i++) {
        hash = ((hash << 5) + hash) ^ name.charCodeAt(i);
    }
    const hue = Math.abs(hash) % 360;
    return `hsla(${hue}, 62%, 42%, 0.12)`;
}
