'use strict'

var express = require('express');
var router = express.Router();
var InputSanitizer = require('./inputsanitizer');
var UrlSafeHolder = require('./urlSafety');
var CommentHolder = require('./comments');

router.get('/', async function(req, res) {
  let EncryptLv = parseInt((req.query.p || '000').charAt(0));
  let InSafeLv = parseInt((req.query.p || '000').charAt(1));
  let UrlSafeLv = parseInt((req.query.p || '000').charAt(2));
  UrlSafeHolder.setCORS(UrlSafeLv>=2); UrlSafeHolder.setHTTPS(EncryptLv>=2);
  
  if (req.query.addComment) {
    let commentArr = req.query.addComment.split("::");
    let name = InputSanitizer.sanitizeString(commentArr[0], InSafeLv);
    let comment = InputSanitizer.sanitizeString(commentArr[1], InSafeLv);
    const setCommentPromise = CommentHolder.addComment(name, comment);
    const timeoutPromise1 = new Promise(resolve => { setTimeout(resolve, 1000); });
    await Promise.race([setCommentPromise, timeoutPromise1]);
  }

  const getCommentPromise = CommentHolder.getComments();
  const timeoutPromise2 = new Promise(resolve => { setTimeout(resolve, 1000); });
  const comments = await Promise.race([getCommentPromise, timeoutPromise2]);
  
  res.render('commentPage', { title: 'Comments', p: req.query.p || '000', h: req.query.h || '000', comments: comments });
});

module.exports = router;
