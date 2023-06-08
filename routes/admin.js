var express = require('express');
var router = express.Router();

router.use('/', function(req, res, next) {
  if (!('admin' in req.session)) {
    res.redirect('/');
  } else {
    next();
  }
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render("./SystemAdmin/admin.html");
});

let types = ['clubs', 'users', 'admins'];

router.get('/:type', function(req, res, next) {
  if (types.includes(req.params.type)) res.render("./SystemAdmin/manage.html");
});

router.get('/:type/add', function(req, res, next) {
  if (req.params.type === 'clubs') res.render("./SystemAdmin/form.html");
});

router.get('/:type/:id', function(req, res, next) {
  if (req.params.type === 'admin') return;
  if (types.includes(req.params.type)) res.render("./SystemAdmin/form.html");
});

module.exports = router;
