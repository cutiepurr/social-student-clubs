/*
GET /:clubId
POST /:clubId/add
GET /:clubId/:eventId
POST /:clubId/:eventId/edit
POST /:clubId/:eventId/rsvp
GET /:clubId/:eventId/rsvp
POST /:clubId/:eventId/archive
*/

var express = require('express');
var router = express.Router();

// check if a club's member and/or manager
router.use('/:clubId', function (req, res, next) {
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
            connection.query(query, [req.params.clubId, req.session.user_id], function (err, results, field) {
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

// get all events of a club
router.get('/:clubId', function (req, res, next) {
    req.pool.getConnection(function (cerr, connection) {
        if (cerr) {
            res.status(500);
            return;
        }
        // get number of rows
        let query = 'SELECT COUNT(*) AS count FROM club_event WHERE club_id = ?;';
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

            let type = "";
            if (!(type in req.query)) type = "";
            else if (req.query.type==="future") type = "AND time>=NOW()";
            else if (req.query.type==="past") type = "AND time<NOW()";
            else type = "";

            if (!res.locals.isMember) {
                query = `SELECT * FROM club_event WHERE club_id = ? AND is_public=TRUE ${type} ORDER BY published_timestamp DESC LIMIT ?, ?;`;
            } else query = `SELECT * FROM club_event WHERE club_id = ? ${type} ORDER BY published_timestamp DESC LIMIT ?, ?;`;
            let params = [req.params.clubId, start, end - start];
            connection.query(query, params, function (err2, results2, field2) {
                connection.release();
                if (err2) {
                    res.status(500);
                    return;
                }
                res.json(results2);
            });
        });
    });
});

// add event - MANAGERS ONLY
router.post('/:clubId/add', function (req, res, next) {
    if (!res.locals.isManager) {
        res.status(400).send("Unauthorised");
        return;
    }
    req.pool.getConnection(function (cerr, connection) {
        if (cerr) {
            res.status(500);
            return;
        }
        let query= 'INSERT INTO club_event (title, time, location, content, club_id, user_id, is_public) VALUES (?, ?, ?, ?, ?, ?, ?);';
        let params = [
            req.body.title, req.body.time, req.body.location, req.body.content,
            req.params.clubId, req.session.user_id, req.body.is_public
        ];
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

// check if public user can access eventId
router.param('eventId', function (req, res, next) {
    req.pool.getConnection(function (cerr, connection) {
        if (cerr) {
            res.status(500);
            return;
        }
        let query = `SELECT is_public FROM club_event WHERE event_id=?`;
        connection.query(query, [req.params.eventId], function (err, results, field) {
            connection.release();
            if (err) {
                res.status(500);
                return;
            }
            res.locals.isPublic = results[0].is_public;
            if (!res.locals.isMember && !res.locals.isPublic) {
                res.status(400).send("Unauthorised");
            } else {
                next();
            }
        });
    });
});

// get an event of a club
router.get('/:clubId/:eventId', function (req, res, next) {
    req.pool.getConnection(function (cerr, connection) {
        if (cerr) {
            res.status(500);
            return;
        }
        let query;
        if (!res.locals.isMember && !res.locals.isPublic) query = 'SELECT * FROM club_event WHERE club_id = ? AND event_id = ? AND is_public=TRUE;';
        else query = 'SELECT * FROM club_event WHERE club_id = ? AND event_id = ?;';
        let params = [req.params.clubId, req.params.eventId];
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


// edit event - MANAGERS ONLY
router.post('/:clubId/:eventId/edit', function (req, res, next) {
    if (!res.locals.isManager) {
        res.status(400).send("Unauthorised");
        return;
    }
    req.pool.getConnection(function (cerr, connection) {
        if (cerr) {
            res.status(500);
            return;
        }
        let p;
        if (req.body.is_public) p = "is_public=TRUE";
        else p = "is_public=FALSE";
        let query = `UPDATE club_event SET title = ?, time = ?, location = ?, content = ?, ${p} WHERE club_id = ? AND event_id = ?;`;
        let params = [
            req.body.title, req.body.time, req.body.location,
            req.body.content, req.params.clubId, req.params.eventId
        ];
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

// rsvp event
router.post('/:clubId/:eventId/rsvp', function (req, res, next) {
    if (!('user_id' in req.session)) {
        res.status(400).send("Unauthorised");
        return;
    }
    if (!res.locals.isMember && !res.locals.isPublic) {
        res.status(400).send("Unauthorised");
        return;
    }
    req.pool.getConnection(function (cerr, connection) {
        if (cerr) {
            res.status(500);
            return;
        }
        let query = 'INSERT INTO event_rsvp (user_id, club_id, event_id) VALUES (?,?,?)';
        let params = [req.session.user_id, req.params.clubId, req.params.eventId];
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

// get rsvp event
router.get('/:clubId/:eventId/rsvp', function (req, res, next) {
    if (!res.locals.isMember && !res.locals.isPublic) {
        res.status(400).send("Unauthorised");
        return;
    }
    req.pool.getConnection(function (cerr, connection) {
        if (cerr) {
            res.status(500);
            return;
        }
        let query = 'SELECT * FROM event_rsvp WHERE club_id = ? AND event_id = ?';
        let params = [req.params.clubId, req.params.eventId];
        connection.query(query, params, function (err, results, field) {
            connection.release();
            if (err) {
                console.log(err);
                res.status(500);
                return;
            }
            let isRsvped = false;
            if (results.find((r) => r.user_id == req.session.user_id)) isRsvped = true;
            res.json({
                rsvp: results,
                isRsvped: isRsvped
            });
        });
    });
});

// archive event - MANAGERS ONLY
router.post('/:clubId/:eventId/archive', function (req, res, next) {
    if (!res.locals.isManager) {
        res.status(400).send("You are not a club manager");
        return;
    }
    req.pool.getConnection(function (cerr, connection) {
        if (cerr) {
            res.status(500);
            return;
        }
        let query = 'UPDATE club_event SET archived=TRUE WHERE club_id=? AND event_id=?';
        let params = [req.params.clubId, req.params.eventId];
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

module.exports = router;
