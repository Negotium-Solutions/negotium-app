export { FunctionsHelper };
class FunctionsHelper {
    /**
     * Replace specific placeholders wrapped in curly braces with corresponding replacement text.
     * Example usage
     * const originalText = "This is a {placeholder} and here is another {example}.";
     * const replacements = {
     *      placeholder: "`placeholder replaced text`",
     *      example: "`example replaced text`"
     * };
     * const newText = replacePlaceholders(originalText, replacements);
     * Output: This is a `placeholder replaced text` and here is another `example replaced text`
     *
     * @param {string} text - The input string containing placeholders wrapped in curly braces.
     * @param {Object} replacements - An object mapping placeholders to their replacement texts.
     * @returns {string} - The modified string with placeholders replaced.
     */
    static replaceTextVariables(text, replacements) {
        // Regular expression to match placeholders within curly braces
        const regex = /\{(\w+)\}/g;

        // Replace placeholders with corresponding replacement text
        return text.replace(regex, (match, p1) => {
            // p1 is the captured placeholder without curly braces
            return replacements.hasOwnProperty(p1) ? replacements[p1] : match;
        });
    }

    /**
     * Static method to format a date string.
     *
     * @param {string} dateStr - The date string to format.
     * @returns {string} - The formatted date string.
     */
    static DateTime(dateStr) {
        const dateObject = new Date(dateStr);

        const year = dateObject.getFullYear();
        const month = String(dateObject.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const day = String(dateObject.getDate()).padStart(2, '0');
        const hours = String(dateObject.getHours()).padStart(2, '0');
        const minutes = String(dateObject.getMinutes()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}`;
    }

}