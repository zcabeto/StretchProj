var InputSanitizer = require('./inputsanitizer');
var pool = require('./db');     // retrieve pool from db.js

class LoginProcessor {
    static ACCEPT = false;
    LoginProcessor(){
        this.ACCEPT = false;
    }
    // ideally there would be an ACCEPT var for each user, with them decided by cookies
    static async login(username, password, isHashed) {
        try {
            let connection = await pool.getConnection();
            let getUsers;
            if (isHashed) {
                getUsers = `SELECT * FROM UsersHashed WHERE user='${username}' LIMIT 1;`;
            } else {
                getUsers = `SELECT * FROM Users WHERE user='${username}' LIMIT 1;`;
            }
            let [users, fields] = await connection.execute(getUsers);
            if (users.length == 1) {
                if (users[0].pass == password) {
                    this.ACCEPT = true;
                } else {
                    this.ACCEPT = false;
                }
            } else {
                this.ACCEPT = false;
            }
        } catch (err) {console.log(err); this.ACCEPT = false;}
    }

    static logout() {
        this.ACCEPT = false;
    }
}

module.exports = LoginProcessor;

