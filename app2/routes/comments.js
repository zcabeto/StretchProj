var pool = require('./db');     // retrieve pool from db.js

class CommentHolder {
    static async addComment(name, comment) {
        let connection;
        try {
            connection = await pool.getConnection();
            let setComment = `INSERT INTO Comments(writer, comment) VALUES ('${name}', '${comment}');`;
            await connection.execute(setComment);
        } catch (err) { console.log(err); return err; }
        finally { if (connection) connection.release(); }
    }
    static async getComments() {
        let connection;
        try {
            connection = await pool.getConnection();
            let getComments = `SELECT * FROM Comments LIMIT 20;`;
            let [comments, fields] = await connection.execute(getComments);
            return comments;
        } catch (err) { console.log(err); return err; }
        finally { if (connection) connection.release(); }
    }
}

module.exports = CommentHolder;

