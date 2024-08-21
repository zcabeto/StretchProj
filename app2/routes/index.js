'use strict'

var express = require('express');
var router = express.Router();
var InputSanitizer = require('./inputsanitizer');
var LoginProcessor = require('./login');

router.get('/', async function(req, res) {
  res.render('index', { title: 'Stretch Project', ACCEPT: LoginProcessor.ACCEPT, p: req.query.p || '000', h: req.query.h || '000', user: LoginProcessor.user || req.cookies['User'] });
});

router.get('/:username/:password', async function(req, res) {
  let isHashed = parseInt((req.query.p || '000').charAt(0));
  let SQLI = parseInt((req.query.p || '000').charAt(1));
  if (req.params.username && req.params.password) {
    let username;
    let password;
    if (SQLI) {
      username = InputSanitizer.sanitizeString(req.params.username);
      password = InputSanitizer.sanitizeString(req.params.password);
    } else {
      username = req.params.username;
      password = req.params.password;
    }
    let err = await LoginProcessor.login(username, password, isHashed);
    if (err != null) { res.render('error', { message: 'from login/', error: err}); }
  }
  res.render('index', { title: 'Stretch Project', ACCEPT: LoginProcessor.ACCEPT, p: req.query.p || '000', h: req.query.h || '000', user: LoginProcessor.user || req.cookies['User'] });
});

router.get('/out', async function(req, res) {
  LoginProcessor.logout();
  res.render('index', { title: 'Stretch Project', ACCEPT: false, p: req.query.p || '000', h: req.query.h || '000', user: LoginProcessor.user || req.cookies['User'] });
});

module.exports = router;
