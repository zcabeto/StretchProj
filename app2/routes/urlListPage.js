'use strict'

module.exports = function(urlLogger) {
  var express = require('express');
  var router = express.Router();

  router.get('/', async function(req, res) {
      res.render('urlListPage', { title: 'Network Listener', urls: urlLogger.urls, p: req.query.p || '000', h: req.query.h || '000' });
  });

  return router;
};
