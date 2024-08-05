export { FunctionsHelper };
class FunctionsHelper {
    /**
     * Replace specific placeholders wrapped in curly braces with corresponding replacement text.
     *
     * @param {string} text - The input string containing placeholders wrapped in curly braces.
     * @param {Object} replacements - An object mapping placeholders to their replacement texts.
     * @returns {string} - The modified string with placeholders replaced.
     */
    replaceTextVariables(text, replacements) {
        // Regular expression to match placeholders within curly braces
        const regex = /\{(\w+)\}/g;

        // Replace placeholders with corresponding replacement text
        return text.replace(regex, (match, p1) => {
            // p1 is the captured placeholder without curly braces
            return replacements.hasOwnProperty(p1) ? replacements[p1] : match;
        });
    }

    /*
    // Example usage
    const originalText = "This is a {placeholder} and here is another {example}.";
    const replacements = {
        placeholder: "`placeholder replaced text`",
        example: "`example replaced text`"
    };

    const newText = replacePlaceholders(originalText, replacements);
    console.log(newText);
    Output: This is a `placeholder replaced text` and here is another `example replaced text`.
    **/
}