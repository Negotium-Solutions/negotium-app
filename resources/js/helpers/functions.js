export { functionsHelper };
class functionsHelper {
    getRandomHexColor() {
        // Generate a random number between 0 and 255 for each color component
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);

        // Convert each component to a two-digit hexadecimal string
        const rHex = r.toString(16).padStart(2, '0');
        const gHex = g.toString(16).padStart(2, '0');
        const bHex = b.toString(16).padStart(2, '0');

        // Combine the components into a single hexadecimal color code
        return `#${rHex}${gHex}${bHex}`;
    }
}