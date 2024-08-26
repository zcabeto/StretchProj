var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var dataRouter = require('./routes/data');
var CORSRouter = require('./routes/CORS');
var commentsRouter = require('./routes/commentPage');
var UrlSaftyHandler = require('./routes/urlSafety');

var app = express();

const disallowedReferrers = ['http://localhost:3000/CORS'];

app.use((req, res, next) => {
  const referer = req.get('Referer');
  console.log("Referer: " + referer + " with CORS allowance: "+UrlSaftyHandler.configCORS)
  if (UrlSaftyHandler.configCORS) {   // if CORS configured then check referer
    if (referer && !disallowedReferrers.some(disallowed => !referer.startsWith(disallowed))) {
      res.status(403).send('ERROR 403: Access Forbidden');
    } else {
      next();
    }
  } else {                            // if CORS not configured then allow all
    next();
  }
});

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('indexFolder'))

// Define routes
app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/data', dataRouter);
app.use('/comments', commentsRouter);
app.use('/CORS', CORSRouter);

app.get('*', (req, res) => {
  res.redirect('/');
});

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
