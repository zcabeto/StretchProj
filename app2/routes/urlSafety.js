class UrlSafety {
    static configCORS = false;
    static secureHTTP = false;
    UrlSafety(){
        this.configCORS = false;
        this.secureHTTP = false;
    }
    static setCORS(setting) {
        this.configCORS = setting;
    }
    static setHTTPS(setting) {
        this.secureHTTP = setting;
    }
}

module.exports = UrlSafety;

