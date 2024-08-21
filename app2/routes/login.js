var InputSanitizer = require('./inputsanitizer');
var pool = require('./db');     // retrieve pool from db.js

class LoginProcessor {
    static ACCEPT = false;
    static user = null;
    LoginProcessor(){
        this.ACCEPT = false;
        this.user = null;
    }
    // ideally there would be an ACCEPT var for each user, with them decided by cookies
    static async login(username, password, isHashed) {
        try {
            let connection = await pool.getConnection();
            let getUsers;
            if (isHashed) {
                getUsers = `SELECT * FROM UsersHashed WHERE user='${username}' AND pass='${password}' LIMIT 1;`;
            } else {
                getUsers = `SELECT * FROM Users WHERE user='${username}' AND pass='${password}' LIMIT 1;`;
            }
            console.log(username, password);
            let [users, fields] = await connection.execute(getUsers);
            if (users.length > 0) {
                this.ACCEPT = true;
                this.user = users[0].user;
            } else {
                this.ACCEPT = false;
                this.user = null;
            }
        } catch (err) { this.ACCEPT = false; this.user = null; return err; }
    }

    static logout() {
        this.ACCEPT = false;
        this.user = null;
    }
}

module.exports = LoginProcessor;

