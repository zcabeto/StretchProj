'use strict'

var express = require('express');
var router = express.Router();
var InputSanitizer = require('./inputsanitizer');
var UrlSafeHolder = require('./urlSafety');
var pool = require('./db');     // retrieve pool from db.js

router.get('/', async function(req, res) {
  let EncryptLv = parseInt((req.query.p || '000').charAt(0));
  let InSafeLv = parseInt((req.query.p || '000').charAt(1));
  let UrlSafeLv = parseInt((req.query.p || '000').charAt(2));
  UrlSafeHolder.setCORS(UrlSafeLv>=2); UrlSafeHolder.setHTTPS(EncryptLv>=2);

  let connection;
  try {
    connection = await pool.getConnection();
    if (req.query.c && req.cookies['User'] && req.cookies['User']!='') {
      let name = InputSanitizer.sanitizeString(req.cookies['User'], InSafeLv);
      let comment = InputSanitizer.sanitizeString(req.query.c, InSafeLv);

      const timeoutPromise1 = new Promise(resolve => { setTimeout(resolve, 1000); });
      if (InSafeLv >= 2) {
        let setComment = `INSERT INTO Comments(writer, comment) VALUES (?, ?);`;
        await Promise.race([connection.execute(setComment, [`${name}`, `${comment}`]), timeoutPromise1]);
      } else {
        let setComment = `INSERT INTO Comments(writer, comment) VALUES ('${name}', '${comment}');`;
        await Promise.race([connection.execute(setComment), timeoutPromise1]);
      }
    }

    const timeoutPromise2 = new Promise(resolve => { setTimeout(resolve, 1000); });
    let getComments = `SELECT * FROM Comments LIMIT 20;`;
    let [comments, fields] = await Promise.race([connection.execute(getComments), timeoutPromise2]);
    res.render('commentPage', { title: 'Comments', p: req.query.p || '000', h: req.query.h || '000', comments: comments });
  } catch (err) { console.log(err); res.render('error', { message: 'from commentPage/', error: err}); }
  finally { if (connection) connection.release(); }
});

module.exports = router;
