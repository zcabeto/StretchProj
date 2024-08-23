'use strict'

var express = require('express');
var router = express.Router();
var InputSanitizer = require('./inputsanitizer');
var LoginProcessor = require('./login');

router.get('/', async function(req, res) {
  if (req.cookies['User'] != '' && req.cookies['User'] != null) {
    let isHashed = parseInt((req.query.p || '000').charAt(0));
    let SQLI = parseInt((req.query.p || '000').charAt(1));
    let encode = parseInt((req.query.p || '000').charAt(2));
    let acceptedCookie = req.cookies['User'].split('::');
    let username;
    let password;
    if (SQLI) {
      username = InputSanitizer.sanitizeString(acceptedCookie[0], encode);
      password = InputSanitizer.sanitizeString(acceptedCookie[1], encode);
    } else {
      username = acceptedCookie[0];
      password = acceptedCookie[1];
    }
    const loginPromise = LoginProcessor.login(username, password, isHashed);
    const timeoutPromise = new Promise(resolve => { setTimeout(resolve, 5000); });
    const err = await Promise.race([loginPromise, timeoutPromise]);
    if (err != null) { res.render('error', { message: 'from login/', error: err}); }
    res.render('index', { title: 'Stretch Project', ACCEPT: LoginProcessor.ACCEPT, p: req.query.p || '000', h: req.query.h || '000', user: LoginProcessor.user || username });
  } else {
    res.render('index', { title: 'Stretch Project', ACCEPT: false, p: req.query.p || '000', h: req.query.h || '000', user: '' });
  }
});

router.get('/out', async function(req, res) {
  LoginProcessor.logout();
  res.render('index', { title: 'Stretch Project', ACCEPT: false, p: req.query.p || '000', h: req.query.h || '000', user: '' });
});

module.exports = router;
