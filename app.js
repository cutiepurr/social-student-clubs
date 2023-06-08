const compression = require('compression');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql2');
var session = require('express-session');

var indexRouter = require('./routes/index');
var clubsRouter = require('./routes/clubs');
var adminRouter = require('./routes/admin');

var apiRouter = require('./routes/api/api');
var apiUsersRouter = require('./routes/api/users');
var apiClubsRouter = require('./routes/api/clubs');
var apiEventsRouter = require('./routes/api/events');
var apiUpdatesRouter = require('./routes/api/updates');

var app = express();

app.use(compression())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: "Session",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

var dbConnectionPool = mysql.createPool({
    host: process.env.MYSQLHOST,
    port: process.env.MYSQLPORT,
    user: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
});
app.use(function (req, res, next) {
    req.pool = dbConnectionPool;
    next();
});
// to use res.render(html file)
app.use(express.static(path.join(__dirname, 'public'), {
    dotfiles: 'ignore',
    index: 'Home/home.html'
}));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

// routers
app.use('/', indexRouter);
app.use('/clubs', clubsRouter);
app.use('/admin', adminRouter);
app.use('/api', apiRouter);
app.use('/api/clubs', apiClubsRouter);
app.use('/api/users', apiUsersRouter);

app.use('/api/events', apiEventsRouter);
app.use('/api/updates', apiUpdatesRouter);

module.exports = app;
