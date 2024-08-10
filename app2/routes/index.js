'use strict'

var express = require('express');
var router = express.Router();
var InputSanitizer = require('./inputsanitizer');
var LoginProcessor = require('./login');

router.get('/', async function(req, res) {
  let isHashed = parseInt((req.query.p || '00').charAt(0));
  let SQLI = parseInt((req.query.p || '00').charAt(1));
  res.render('index', { title: 'Stretch Project', ACCEPT: LoginProcessor.ACCEPT, p: isHashed.toString()+SQLI.toString() });
});

router.get('/:username/:password', async function(req, res) {
  let isHashed = parseInt((req.query.p || '00').charAt(0));
  let SQLI = parseInt((req.query.p || '00').charAt(1));
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
    await LoginProcessor.login(username, password, isHashed);
  }
  res.render('index', { title: 'Stretch Project', ACCEPT: LoginProcessor.ACCEPT, p: isHashed.toString()+SQLI.toString() });
});

router.get('/out', async function(req, res) {
  let isHashed = parseInt((req.query.p || '00').charAt(0));
  let SQLI = parseInt((req.query.p || '00').charAt(1));
  LoginProcessor.logout();
  res.render('index', { title: 'Stretch Project', ACCEPT: false, p: isHashed.toString()+SQLI.toString() });
});

module.exports = router;
