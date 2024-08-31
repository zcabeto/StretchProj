'use strict'

var express = require('express');
var router = express.Router();
var UrlSafeHolder = require('./urlSafety');


router.get('/', async function(req, res) {
  let EncryptLv = parseInt((req.query.p || '000').charAt(0));
  let UrlSafeLv = parseInt((req.query.p || '000').charAt(2));
  UrlSafeHolder.setCORS(UrlSafeLv>=1); UrlSafeHolder.setHTTPS(EncryptLv>=2);
  res.render('index', { title: 'Stretch Project', p: req.query.p || '000', h: req.query.h || '000' });
});

module.exports = router;
