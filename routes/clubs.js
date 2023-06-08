var express = require('express');
var router = express.Router();

// for api, refer to apiClubs.js

router.get('/', function (req, res, next) {
  res.render("./Home/clubs.html");
});

// check if a club's member and/or manager
router.param('clubId', function (req, res, next) {
  if (!('user_id' in req.session)) {
    res.locals.isMember = false;
    res.locals.isManager = false;
  }
  req.pool.getConnection(function (cerr, connection) {
    if (cerr) {
      res.status(500);
      return;
    }

    let query = `SELECT is_manager FROM club INNER JOIN club_member
  ON club.club_id = club_member.club_id
  WHERE club.club_id=? AND user_id=?;`;
    let params = [req.params.clubId, req.session.user_id];
    connection.query(query, params, function (err, results, field) {
      connection.release();
      if (err) {
        res.status(500);
        return;
      }
      if (!results[0]) {
        res.locals.isMember = false;
        res.locals.isManager = false;
      } else if (results[0].is_manager) {
        res.locals.isMember = true;
        res.locals.isManager = true;
      } else {
        res.locals.isMember = true;
        res.locals.isManager = false;
      }
      next();
    });
  });
});


router.get('/:clubId', function (req, res, next) {
  res.render("./Club/clubDashboard.html");
});

router.get('/:clubId/members', function (req, res, next) {
  res.render("./Club/clubMembers.html");
});

router.get('/:clubId/events', function (req, res, next) {
  res.render("./Club/Activity/activities.html");
});

router.get('/:clubId/updates', function (req, res, next) {
  res.render("./Club/Activity/activities.html");
});

router.get('/:clubId/settings', function (req, res, next) {
  if (!res.locals.isMember) res.redirect(`/clubs/${req.params.clubId}`);
  else res.render("./Club/clubSettings.html");
});

router.get('/:clubId/events/add', function (req, res, next) {
  if (!res.locals.isManager) res.redirect(`/clubs/${req.params.clubId}/events`);
  else res.render("./Club/Activity/activityForm.html");
});

router.get('/:clubId/updates/add', function (req, res, next) {
  if (!res.locals.isManager) res.redirect(`/clubs/${req.params.clubId}/updates`);
  else res.render("./Club/Activity/activityForm.html");
});

router.get('/:clubId/events/:eventID', function (req, res, next) {
  res.render("./Club/Activity/activityPage.html");
});

router.get('/:clubId/updates/:updateID', function (req, res, next) {
  res.render("./Club/Activity/activityPage.html");
});


router.get('/:clubId/events/:eventID/edit', function (req, res, next) {
  if (!res.locals.isManager) res.redirect(`/clubs/${req.params.clubId}/events`);
  else res.render("./Club/Activity/activityForm.html");
});

router.get('/:clubId/updates/:updateID/edit', function (req, res, next) {
  if (!res.locals.isManager) res.redirect(`/clubs/${req.params.clubId}/updates`);
  else res.render("./Club/Activity/activityForm.html");
});

module.exports = router;
