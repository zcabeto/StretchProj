var InputSanitizer = require('./inputsanitizer');
var pool = require('./db');     // retrieve pool from db.js

class LoginProcessor {
    static ACCEPT = false;
    LoginProcessor(){
        this.ACCEPT = false;
    }
    // ideally there would be an ACCEPT var for each user, with them decided by cookies
    static async login(username, password) {
        try {
            let connection = await pool.getConnection();
            let getUsers = `SELECT * FROM Users WHERE user=? LIMIT 1;`;
            let [users, fields] = await connection.execute(getUsers, [`${username}`]);
            if (users.length == 1) {
                if (users[0].user == username && users[0].pass == password) {
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

