class InputSanitizer {
    static sanitizeString(input, InSafeLv=0) {
        if (typeof input !== 'string') {
            throw new Error('Input must be a string.');
        }
        // replace potentially dangerous characters with empty string
        if (InSafeLv >= 2) {
            input = input.replace(/[^a-zA-Z0-9-_.~]/g, function(match) {
                return encodeURIComponent(match).replace(/'/g, "%27");
            });
        } else if (InSafeLv >= 1) {
            input = input.replace(/[^a-zA-Z0-9-_.~]/g, '');
        }
        
        return input;
    }
    /*
    static removeSqlKeywords(input) {
        const keywords = ['SELECT', 'INSERT', 'DELETE', 'UPDATE', 'DROP', 'EXEC', 'UNION'];
        const regex = new RegExp(keywords.join('|'), 'gi');
        return input.replace(regex, '');
    }
    */
}

module.exports = InputSanitizer;

