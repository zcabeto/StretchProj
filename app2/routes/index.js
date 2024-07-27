'use strict';

var express = require('express');
var router = express.Router();
var InputSanitizer = require('./inputsanitizer');
var LoginProcessor = require('./login');

router.get('/', async function(req, res) {
  res.render('index', { title: 'Stretch Project', ACCEPT: LoginProcessor.ACCEPT });
});

router.get('/:username/:password', async function(req, res) {
  LoginProcessor.login(req.params.username, req.params.password);
  res.render('index', { title: 'Stretch Project', ACCEPT: LoginProcessor.ACCEPT });
});

router.get('/out', async function(req, res) {
  LoginProcessor.logout();
  res.render('index', { title: 'Stretch Project', ACCEPT: false });
});

module.exports = router;
