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
    static async login(username, password, isHashed, isEncoded) {
        let connection;
        try {
            connection = await pool.getConnection();
            let getUsers; let users; let fields;
            if (isEncoded) {
                getUsers = `SELECT * FROM Users WHERE user=? AND pass=? LIMIT 1;`;
                if (isHashed) { getUsers = getUsers.replace('Users', 'UsersHashed'); }
                [users, fields] = await connection.execute(getUsers, [`${username}`, `${password}`]);
            } else {
                getUsers = `SELECT * FROM Users WHERE user='${username}' AND pass='${password}' LIMIT 1;`;
                if (isHashed) { getUsers = getUsers.replace('Users', 'UsersHashed'); }
                [users, fields] = await connection.execute(getUsers);
            }
            if (users.length > 0) {
                this.ACCEPT = true;
                this.user = users[0].user;
            } else {
                this.ACCEPT = false;
                this.user = null;
            }
        } catch (err) { this.ACCEPT = false; this.user = null; return err; }
        finally { if (connection) connection.release(); }
    }

    static logout() {
        this.ACCEPT = false;
        this.user = null;
    }
}

module.exports = LoginProcessor;

