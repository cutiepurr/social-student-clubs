var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render("./Home/home.html");
});

router.get('/login', function(req, res, next) {
  if ('user_id' in req.session) res.redirect('/profile');
  else res.render("./Home/login.html");
});

router.get('/signup', function(req, res, next) {
  if ('user_id' in req.session) res.redirect('/profile');
  else res.render("./Home/signup.html");
});


router.get('/logout', function(req, res, next) {
  if ('user_id' in req.session) {
    delete req.session.user_id;
    if ('admin' in req.session) delete req.session.admin;
    res.redirect('/');
  } else {
    res.status(403);
  }
});


router.get('/profile', function(req, res, next) {
  if (!('user_id' in req.session)) res.redirect('/login');
  else res.render("./Home/profile.html");
});

router.get('/settings', function(req, res, next) {
  if (!('user_id' in req.session)) res.redirect('/login');
  else res.render("./Home/settings.html");
});

module.exports = router;
