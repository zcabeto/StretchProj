'use strict';

var express = require('express');
var router = express.Router();
var InputSanitizer = require('./inputsanitizer');

/* start page to view data */
router.get('/', async function(req, res) {
  // frontend render on index.jade
  res.render('index', { title: 'Database Website' });
});

module.exports = router;
