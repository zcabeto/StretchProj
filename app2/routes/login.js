'use strict'

var express = require('express');
var router = express.Router();
var InputSanitizer = require('./inputsanitizer');
var LoginProcessor = require('./loginProc');
var UrlSafeHolder = require('./urlSafety');

router.get('/', async function(req, res) {
  let UrlSafeLv = parseInt((req.query.p || '000').charAt(2));
  if (req.cookies['User'] != '' && req.cookies['User'] != null && UrlSafeLv>=1) {
    let EncryptLv = parseInt((req.query.p || '000').charAt(0));
    UrlSafeHolder.setCORS(UrlSafeLv>=2); UrlSafeHolder.setHTTPS(EncryptLv>=2);
    let InSafeLv = parseInt((req.query.p || '000').charAt(1));
    let acceptedCookie = req.cookies['User'].split('::');
    
    let username = InputSanitizer.sanitizeString(acceptedCookie[0], InSafeLv);
    let password = InputSanitizer.sanitizeString(acceptedCookie[1], InSafeLv);
    const loginPromise = LoginProcessor.login(username, password, EncryptLv >= 1, InSafeLv >= 2);
    const timeoutPromise = new Promise(resolve => { setTimeout(resolve, 5000); });
    const err = await Promise.race([loginPromise, timeoutPromise]);
    if (err != null) { res.render('error', { message: 'from login/', error: err}); }
    res.render('login', { title: 'Login Page', ACCEPT: LoginProcessor.ACCEPT, p: req.query.p || '000', h: req.query.h || '000', setUser: LoginProcessor.user || username });
  } else {
    UrlSafeHolder.setCORS(UrlSafeLv>=1);
    res.render('login', { title: 'Login Page', ACCEPT: LoginProcessor.ACCEPT, p: req.query.p || '000', h: req.query.h || '000', setUser: LoginProcessor.user });
  }
});

router.get('/:username/:password', async function(req, res) {
  let UrlSafeLv = parseInt((req.query.p || '000').charAt(2));
  if (UrlSafeLv >= 1) { res.render('error', { message: 'from login/', error: 'URL safety mismatch'}); return; }
  let EncryptLv = parseInt((req.query.p || '000').charAt(0));
  UrlSafeHolder.setCORS(UrlSafeLv>=2); UrlSafeHolder.setHTTPS(EncryptLv>=2);
  let InSafeLv = parseInt((req.query.p || '000').charAt(1));

  let username = InputSanitizer.sanitizeString(req.params.username, InSafeLv);
  let password = InputSanitizer.sanitizeString(req.params.password, InSafeLv);
  const loginPromise = LoginProcessor.login(username, password, EncryptLv >= 1, InSafeLv >= 2);
  const timeoutPromise = new Promise(resolve => { setTimeout(resolve, 5000); });
  const err = await Promise.race([loginPromise, timeoutPromise]);
  if (err != null) { res.render('error', { message: 'from login/', error: err}); }
  res.render('login', { title: 'Login Page', ACCEPT: LoginProcessor.ACCEPT, p: req.query.p || '000', h: req.query.h || '000', setUser: LoginProcessor.user || username });
});

router.get('/out', async function(req, res) {
  LoginProcessor.logout();
  res.render('login', { title: 'Login Page', ACCEPT: false, p: req.query.p || '000', h: req.query.h || '000', setUser: '' });
});

module.exports = router;
