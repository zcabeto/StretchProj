'use strict'

var express = require('express');
var router = express.Router();
var InputSanitizer = require('./inputsanitizer');
var LoginProcessor = require('./login');

router.get('/', async function(req, res) {
  let help = parseInt((req.query.p || '0000').charAt(0));
  let isHashed = parseInt((req.query.p || '0000').charAt(1));
  let SQLI = parseInt((req.query.p || '0000').charAt(2));
  let XSS = parseInt((req.query.p || '0000').charAt(3));
  res.render('index', { title: 'Stretch Project', ACCEPT: LoginProcessor.ACCEPT, p: help.toString()+isHashed.toString()+SQLI.toString()+XSS.toString() });
});

router.get('/:username/:password', async function(req, res) {
  let help = parseInt((req.query.p || '0000').charAt(0));
  let isHashed = parseInt((req.query.p || '0000').charAt(1));
  let SQLI = parseInt((req.query.p || '0000').charAt(2));
  let XSS = parseInt((req.query.p || '0000').charAt(3));
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
  res.render('index', { title: 'Stretch Project', ACCEPT: LoginProcessor.ACCEPT, p: help.toString()+isHashed.toString()+SQLI.toString()+XSS.toString() });
});

router.get('/out', async function(req, res) {
  let help = parseInt((req.query.p || '0000').charAt(0));
  let isHashed = parseInt((req.query.p || '0000').charAt(1));
  let SQLI = parseInt((req.query.p || '0000').charAt(2));
  let XSS = parseInt((req.query.p || '0000').charAt(3));
  LoginProcessor.logout();
  res.render('index', { title: 'Stretch Project', ACCEPT: false, p: help.toString()+isHashed.toString()+SQLI.toString()+XSS.toString() });
});

module.exports = router;
