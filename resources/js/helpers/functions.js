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
     * Static method to navigate to a different location.
     *
     * @param {string} location - The url for the intended location.
     */
    static navigateTo(location, parameters = null) {

        window.location = location + (parameters !== null ? parameters : '');
    }

    /**
     * Static method for filtering.
     *
     * @param {array} items
     * @param {array} excludedItems
     */
    static filterByExcludedItems(items, excludedItems) {
        let excludedItemsArray = [];
        excludedItems.forEach((item) => {
            excludedItemsArray.push(item.id);
        });

        return items.filter((item) => !excludedItemsArray.includes(item.id));
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

    static loadPreviousPage() {
        window.history.back();
    }

    static base64ToFile(base64String, filename = 'downloaded-file') {
        // Extract the MIME type and Base64 data
        const mimeTypeRegex = /^data:(.*?);base64,/;
        const matches = base64String.match(mimeTypeRegex);

        if (!matches) {
            console.error('Invalid Base64 string');
            return;
        }

        const mimeType = matches[1];
        const base64Data = base64String.replace(mimeTypeRegex, '');

        // Decode the Base64 string
        const binaryData = atob(base64Data);

        // Create a Blob from the binary data
        const byteArrays = [];
        for (let offset = 0; offset < binaryData.length; offset += 1024) {
            const slice = binaryData.slice(offset, offset + 1024);
            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            byteArrays.push(new Uint8Array(byteNumbers));
        }

        const blob = new Blob(byteArrays, { type: mimeType });

        // Create a URL for the Blob and trigger the download
        const url = URL.createObjectURL(blob);

        // Use a temporary <a> element to trigger download
        const link = document.createElement('a');
        link.href = url;
        link.download = filename; // Optional: specify the filename
        link.click(); // Trigger the click event to download

        // Clean up after the download
        URL.revokeObjectURL(url); // Release the object URL to free memory
    }
}