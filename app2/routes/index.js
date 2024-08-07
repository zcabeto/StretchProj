'use strict'

var express = require('express');
var router = express.Router();
var InputSanitizer = require('./inputsanitizer');
var LoginProcessor = require('./login');

router.get('/', async function(req, res) {
  let SQLI = req.query.SQLI || false;
  res.render('index', { title: 'Stretch Project', ACCEPT: LoginProcessor.ACCEPT, SQLI: SQLI });
});

router.get('/:username/:password', async function(req, res) {
  let SQLI = req.query.SQLI || false;
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
    await LoginProcessor.login(username, password);
  }
  res.render('index', { title: 'Stretch Project', ACCEPT: LoginProcessor.ACCEPT, SQLI: SQLI });
});

router.get('/out', async function(req, res) {
  let SQLI = req.query.SQLI || false;
  LoginProcessor.logout();
  res.render('index', { title: 'Stretch Project', ACCEPT: false, SQLI: SQLI });
});

module.exports = router;
