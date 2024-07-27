var InputSanitizer = require('./inputsanitizer');

class LoginProcessor {
    static ACCEPT = false;
    // ideally there would be an ACCEPT var for each user, with them decided by cookies
    static login(username, password) {
        if (username && password) {
            username = InputSanitizer.sanitizeString(username);
            password = InputSanitizer.sanitizeString(password);
            this.ACCEPT = true;
        }
    }
    static logout() {
        this.ACCEPT = false;
    }
}

module.exports = LoginProcessor;

