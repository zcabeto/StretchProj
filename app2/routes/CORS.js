'use strict'

var express = require('express');
var router = express.Router();
var UrlSafeHolder = require('./urlSafety');

router.get('/', async function(req, res) {
  UrlSafeHolder.setCORS(parseInt(req.cookies['Protections'].charAt(2))>=2); 
  UrlSafeHolder.setHTTPS(parseInt(req.cookies['Protections'].charAt(0))>=2);
  res.render('CORS', { title: 'External Page w/CORS Button', p: req.query.p || '000', h: req.query.h || '000' });
});

module.exports = router;
