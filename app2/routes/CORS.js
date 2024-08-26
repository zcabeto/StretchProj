'use strict'

var express = require('express');
var router = express.Router();
var UrlSafeHolder = require('./urlSafety');

router.get('/', async function(req, res) {
  UrlSafeHolder.setCORS(parseInt(req.cookies['Protections'].charAt(2))>=1); 
  UrlSafeHolder.setHTTPS(parseInt(req.cookies['Protections'].charAt(0))>=2);
  res.render('CORS', { title: 'CORS Link Page' });
});

module.exports = router;
