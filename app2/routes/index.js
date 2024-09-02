'use strict'

var express = require('express');
var router = express.Router();
var UrlSafeHolder = require('./urlSafety');
var pool = require('./db');


router.get('/', async function(req, res) {
  let EncryptLv = parseInt((req.query.p || '000').charAt(0));
  let UrlSafeLv = parseInt((req.query.p || '000').charAt(2));
  UrlSafeHolder.setCORS(UrlSafeLv>=1); UrlSafeHolder.setHTTPS(EncryptLv>=2);
  res.render('index', { title: 'Stretch Project', p: req.query.p || '000', h: req.query.h || '000' });
});

router.get('/rebuild', async function(req, res) {
  let EncryptLv = parseInt((req.query.p || '000').charAt(0));
  let UrlSafeLv = parseInt((req.query.p || '000').charAt(2));
  UrlSafeHolder.setCORS(UrlSafeLv>=1); UrlSafeHolder.setHTTPS(EncryptLv>=2);
  let connection;
  try {
    /*
    connection = await pool.getConnection();
    const timeoutPromise = new Promise(resolve => { setTimeout(resolve, 5000); });
    const rebuildDBPromise =  connection.execute();
    await Promise.race([rebuildDBPromise, timeoutPromise]);
    */
    res.render('index', { title: 'Stretch Project', p: req.query.p || '000', h: req.query.h || '000' });
  } catch (err) {
    console.error('Error from data/', err);
    res.render('error', { message: 'from data/', error: err});
  } finally {
    if (connection) connection.release();
  }
});

module.exports = router;
