class UrlLogger {
    constructor() {
        this.urls = [];
    }

    addURL(new_url) {
        this.urls.push(new_url);
    }
}

module.exports = UrlLogger;