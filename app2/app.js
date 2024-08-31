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

var UrlLogger = require('./routes/urlLogger');
const { time } = require('console');
const urlLog = new UrlLogger();
var NetListenHandler = require('./routes/urlListPage')(urlLog);

var app = express();

const disallowedReferrers = ['/CORS'];

app.use((req, res, next) => {
  if (UrlSaftyHandler.configCORS) {   // if CORS configured then check referer
    const referer = req.get('Referer');
    if (referer && !disallowedReferrers.some(disallowed => !referer.includes(disallowed))) {
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

app.use((req, res, next) => {
  console.log("REQUEST FROM "+req.url);
  let time = new Date();
  let formattedDate = time.getFullYear()+"/"+time.getMonth()+"/"+time.getDate();
  let formattedTime = time.getHours()+":"+time.getMinutes()+":"+time.getSeconds()
  urlLog.addURL("http://localhost:3000"+req.url+" on "+formattedDate+" at "+formattedTime)
  next();
});

// Define routes
app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/data', dataRouter);
app.use('/comments', commentsRouter);
app.use('/CORS', CORSRouter);
app.use('/NetListen', NetListenHandler);

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
