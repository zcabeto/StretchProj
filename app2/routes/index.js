'use strict';

var express = require('express');
var router = express.Router();
var InputSanitizer = require('./inputsanitizer');

/* start page to view data */
router.get('/', async function(req, res) {
  // frontend render on index.jade
  res.render('index', { title: 'Databases Coursework', ACCEPT: false });
});

router.get('/login/:username/:password', async function(req, res) {
  // frontend render on index.jade
  let ACCEPT = false;
  let username = req.params.username;
  let password = req.params.password;
  if (username && password) {
    username = InputSanitizer.sanitizeString(username);
    password = InputSanitizer.sanitizeString(password);
    ACCEPT = true;
  }
  res.render('index', { title: 'Databases Coursework', ACCEPT: ACCEPT });
});

module.exports = router;
