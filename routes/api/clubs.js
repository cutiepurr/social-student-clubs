/*
POST /api/clubs/send-notification
GET /api/clubs/
POST /api/clubs/add
GET /api/clubs/:clubId
POST /api/clubs/:clubId
GET /api/clubs/:clubId/role
POST /api/clubs/:clubId/join
POST /api/clubs/:clubId/delete
POST /api/clubs/:clubId/members
POST /api/clubs/:clubId/members/add
POST /api/clubs/:clubId/members/delete
POST /api/clubs/:clubId/manager/:userId/:promote

GET /api/clubs/:clubId/notifications
GET /api/clubs/:clubId/notification
POST /api/clubs/:clubId/notification
POST /api/clubs/:clubId/notification/add
*/

var express = require('express');
var router = express.Router();
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'hotmail',
  auth: {
    user: 'adobe-flash-lives-on@outlook.com',
    pass: 'AdobeFlash!'
  }
});
// send notifications to user via email
router.post('/send-notification', async function (req, res, next) {
  let mailOptions = {
    from: 'adobe-flash-lives-on@outlook.com',
    to: req.body.email,
    subject: req.body.title,
    text: req.body.content
  };
  await transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      res.status(500);
    } else {
      console.log('Email sent: ' + info.response);
      res.sendStatus(200);
    }
  });
});

// get all clubs
router.get('/', function (req, res, next) {
  req.pool.getConnection(function (cerr, connection) {
    if (cerr) {
      res.status(500);
      return;
    }
    let query = 'SELECT * FROM club;';
    connection.query(query, function (err, results, field) {
      connection.release();
      if (err) {
        res.status(500);
        return;
      }
      res.json(results);
    });
  });
});

// add new club - LOGGED IN ONLY
router.post('/add', function (req, res, next) {
  if (!('user_id' in req.session)) {
    res.status(400).send("Unauthorised");
    return;
  }
  req.pool.getConnection(function (cerr, connection) {
    if (cerr) {
      res.status(500);
      return;
    }

    // insert into club
    let query = `INSERT INTO club (name, about) VALUES (?, ?);`;
    connection.query(query, [req.body.name, req.body.about], function (err, results, field) {
      if (err) {
        res.status(500);
        return;
      }
    });
    // return club data
    query = 'SELECT * FROM club ORDER BY club_id DESC LIMIT 1;';
    connection.query(query, function (err, results, field) {
      connection.release();
      if (err) {
        console.log(err);
        res.status(500);
        return;
      }
      res.json(results[0]);
    });
  });
});

// check if a club's member and/or manager
router.use('/:clubId', function (req, res, next) {
  res.locals.clubId = req.params.clubId;
  if ('admin' in req.session) {
    res.locals.isMember = true;
    res.locals.isManager = true;
    next();
  } else if (!('user_id' in req.session)) {
    res.locals.isMember = false;
    res.locals.isManager = false;
    next();
  } else {
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
  }
});

// if a member and/or manager
router.get('/:clubId/role', function (req, res, next) {
  res.json({
    isMember: res.locals.isMember,
    isManager: res.locals.isManager
  });
});

// get club using ID
router.get('/:clubId', function (req, res, next) {
  req.pool.getConnection(function (cerr, connection) {
    if (cerr) {
      res.status(500);
      return;
    }
    let query = 'SELECT * FROM club WHERE club_id = ?;';
    connection.query(query, [req.params.clubId], function (err, results, field) {
      connection.release();
      if (err) {
        res.status(500);
        return;
      }
      res.json(results[0]);
    });
  });
});

// update club using ID - MANAGERS ONLY
router.post('/:clubId', function (req, res, next) {
  if (!res.locals.isManager) {
    res.status(400).send("Unauthorised");
    return;
  }
  req.pool.getConnection(function (cerr, connection) {
    if (cerr) {
      res.status(500);
      return;
    }
    let query;
    let params;
    if ('name' in req.body && 'about' in req.body && 'active' in req.body) {
      query = 'UPDATE club SET name=?, about=?, active=? WHERE club_id=?';
      params = [req.body.name, req.body.about, req.body.active, req.params.clubId];
    } else {
      query = 'UPDATE club SET about=? WHERE club_id=?';
      params = [req.body.about, req.params.clubId];
    }
    connection.query(query, params, function (err, results, field) {
      connection.release();
      if (err) {
        console.log(err);
        res.status(500);
        return;
      }
      res.sendStatus(200);
    });
  });
});

// join club - MUST SIGN IN
router.post('/:clubId/join', function (req, res, next) {
  if (!('user_id' in req.session)) {
    res.status(400).send("You need to log in");
    return;
  }
  req.pool.getConnection(function (cerr, connection) {
    if (cerr) {
      console.log(cerr);
      res.status(500);
      return;
    }
    let query;
    if (!req.query.manager) query = 'INSERT INTO club_member (user_id, club_id, is_manager) VALUES (?, ?, FALSE);';
    else query = 'INSERT INTO club_member (user_id, club_id, is_manager) VALUES (?, ?, TRUE);';
    let params = [req.session.user_id, req.params.clubId];
    connection.query(query, params, function (err, results, field) {
      connection.release();
      if (err) {
        console.log(err);
        res.status(500);
        return;
      }
      res.status(200).send();
    });
  });
});

// delete club - ADMIN ONLY
router.post('/:clubId/delete', function (req, res, next) {
  if (!('admin' in req.session)) {
    res.status(400).send("Unauthorised");
    return;
  }
  req.pool.getConnection(function (cerr, connection) {
    if (cerr) {
      console.log(cerr);
      res.status(500);
      return;
    }
    let query;
    query = `DELETE FROM club_notification WHERE club_id=?`;
    connection.query(query, [req.params.clubId], function (err, results, field) {
      if (err) {
        res.status(500);
        return;
      }
    });
    query = `DELETE FROM event_rsvp WHERE club_id=?`;
    connection.query(query, [req.params.clubId], function (err, results, field) {
      if (err) {
        res.status(500);
        return;
      }
    });
    query = `DELETE FROM club_update WHERE club_id=?`;
    connection.query(query, [req.params.clubId], function (err, results, field) {
      if (err) {
        console.log(err);
        res.status(500);
        return;
      }
    });
    query = `DELETE FROM club_event WHERE club_id=?`;
    connection.query(query, [req.params.clubId], function (err, results, field) {
      if (err) {
        console.log(err);
        res.status(500);
        return;
      }
    });
    query = `DELETE FROM club_member WHERE club_id=?`;
    connection.query(query, [req.params.clubId], function (err, results, field) {
      if (err) {
        console.log(err);
        res.status(500);
        return;
      }
    });
    query = `DELETE FROM club WHERE club_id=?`;
    connection.query(query, [req.params.clubId], function (err, results, field) {
      connection.release();
      if (err) {
        console.log(err);
        res.status(500);
        return;
      }
      res.status(200).send();
    });
  });
});

// get all members of a club
router.get('/:clubId/members', function (req, res, next) {
  req.pool.getConnection(function (cerr, connection) {
    if (cerr) {
      res.status(500);
      return;
    }
    // get number of rows
    let query = 'SELECT COUNT(*) AS count FROM club_member WHERE club_id = ?;';
    connection.query(query, [req.params.clubId], function (err, results, field) {
      if (err) {
        res.status(500);
        return;
      }
      let numRows = results[0].count;
      let start = req.query.start;
      let end = Math.min(req.query.end, numRows);
      if (!start) start = 0;
      if (!end) end = numRows;

      if ('type' in req.query && req.query.type === "manager") query = 'SELECT * FROM club_member WHERE club_id = ? AND is_manager=TRUE LIMIT ?, ?;';
      else query = 'SELECT * FROM club_member WHERE club_id = ? LIMIT ?, ?;';
      connection.query(query, [req.params.clubId, start, end - start], function (err2, results2, field2) {
        connection.release();
        if (err) {
          res.status(500);
          return;
        }
        res.json(results2);
      });
    });
  });
});

// add member - MANAGERS ONLY
router.post('/:clubId/members/add', function (req, res, next) {
  if (!res.locals.isManager) {
    res.status(400).send("You are not a club manager");
    return;
  }
  req.pool.getConnection(function (cerr, connection) {
    if (cerr) {
      res.status(500);
      return;
    }

    let query = `SELECT user_id FROM user WHERE email=?`;
    connection.query(query, [req.body.email], function (err, results, field) {
      if (err) {
        res.status(500);
        return;
      }
      if (!results[0]) {
        res.status(400).send("User not found");
        return;
      }
      if (!req.query.manager) query = `INSERT INTO club_member (club_id, user_id, is_manager) VALUES (?, ?, FALSE)`;
      else query = `INSERT INTO club_member (club_id, user_id, is_manager) VALUES (?, ?, TRUE)`;
      connection.query(query, [req.params.clubId, results[0].user_id], function (err2, results2, field2) {
        connection.release();
        if (err) {
          res.status(500);
          return;
        }
        res.json({ user_id: results[0].user_id });
      });
    });
  });
});

// promote/demote a member to manager - MANAGERS ONLY
router.post('/:clubId/manager/:userId/:promote', function (req, res, next) {
  if (!res.locals.isManager) {
    res.status(400).send("You are not a club manager");
    return;
  }
  req.pool.getConnection(function (cerr, connection) {
    if (cerr) {
      res.status(500);
      return;
    }

    let query;
    if (req.params.promote == "promote") query = 'UPDATE club_member SET is_manager=TRUE WHERE club_id=? AND user_id=?;';
    else if (req.params.promote == "demote") query = 'UPDATE club_member SET is_manager=FALSE WHERE club_id=? AND user_id=?;';
    connection.query(query, [req.params.clubId, req.params.userId], function (err, results, field) {
      connection.release();
      if (err) {
        res.status(500);
        return;
      }
      res.status(200).send();
    });
  });
});

// delete member - MANAGERS ONLY
router.post('/:clubId/members/delete', function (req, res, next) {
  if (!res.locals.isManager) {
    res.status(400).send("You are not a club manager");
    return;
  }
  req.pool.getConnection(function (cerr, connection) {
    if (cerr) {
      res.status(500);
      return;
    }

    let query;
    query = `DELETE FROM club_notification WHERE club_id=? AND user_id=?`;
    connection.query(query, [req.params.clubId, req.body.user_id], function (err, results, field) {
      if (err) {
        res.status(500);
        return;
      }
    });
    query = `DELETE FROM club_member WHERE club_id=? AND user_id=?`;
    connection.query(query, [req.params.clubId, req.body.user_id], function (err, results, field) {
      connection.release();
      if (err) {
        res.status(500);
        return;
      }
      res.status(200).send();
    });
  });
});

// get notifications
router.get('/:clubId/notifications', function (req, res, next) {
  req.pool.getConnection(function (cerr, connection) {
    if (cerr) {
      res.status(500);
      return;
    }
    let query;
    if (req.query.type === "update") query = `SELECT * FROM club_notification WHERE club_id=? AND subscribed=TRUE AND updates=TRUE`;
    else if (req.query.type === "event") query = `SELECT * FROM club_notification WHERE club_id=? AND subscribed=TRUE AND events=TRUE`;
    else query = `SELECT * FROM club_notification WHERE club_id=? AND subscribed=TRUE`;
    let params = [req.params.clubId];
    connection.query(query, params, function (err, results, field) {
      connection.release();
      if (err) {
        res.status(500);
        return;
      }
      res.json(results);
    });
  });
});

// get notification of session user - MEMBER ONLY
router.get('/:clubId/notification', function (req, res, next) {
  if (!res.locals.isMember) {
    res.status(400).send("Unauthorised");
    return;
  }
  req.pool.getConnection(function (cerr, connection) {
    if (cerr) {
      res.status(500);
      return;
    }

    let query = `SELECT * FROM club_notification WHERE club_id=? AND user_id=?`;
    let params = [req.params.clubId, req.session.user_id];
    connection.query(query, params, function (err, results, field) {
      connection.release();
      if (err) {
        res.status(500);
        return;
      }
      res.json(results[0]);
    });
  });
});

// update notification of session user - MEMBER ONLY
router.post('/:clubId/notification', function (req, res, next) {
  if (!res.locals.isMember) {
    res.status(400).send();
    return;
  }
  req.pool.getConnection(function (cerr, connection) {
    if (cerr) {
      res.status(500);
      return;
    }

    let query = `UPDATE club_notification SET subscribed=?, updates=?, events=? WHERE club_id=? AND user_id=?`;
    let params = [
      req.body.subscribed, req.body.updates, req.body.events,
      req.params.clubId, req.session.user_id
    ];
    connection.query(query, params, function (err, results, field) {
      connection.release();
      if (err) {
        res.status(500);
        return;
      }
      res.sendStatus(200);
    });
  });
});

// insert notification setting - for new members
router.post('/:clubId/notification/add', function (req, res, next) {
  req.pool.getConnection(function (cerr, connection) {
    if (cerr) {
      res.status(500);
      return;
    }
    let userId = req.body.userId;
    if (!userId) {
      if (!('user_id' in req.session)) {
        res.status(400).send();
        return;
      }
      userId = req.session.user_id;
    }

    let query;
    let params;
    query = `SELECT email FROM user WHERE user_id=?`;
    connection.query(query, [userId], function (err, results, field) {
      if (err) {
        console.log(err);
        res.status(500);
        return;
      }
      let email = results[0].email;
      query = `INSERT INTO club_notification (club_id, user_id, email) VALUES (?, ?, ?)`;
      params = [req.params.clubId, userId, email];
      connection.query(query, params, function (err2, results2, field2) {
        connection.release();
        if (err2) {
          console.log(err2);
          res.status(500);
          return;
        }
        res.sendStatus(200);
      });
    });
  });
});

module.exports = router;
