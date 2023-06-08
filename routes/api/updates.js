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

// get all updates of a club
router.get('/:clubId', function (req, res, next) {
    req.pool.getConnection(function (cerr, connection) {
        if (cerr) {
            res.status(500);
            return;
        }
        // get number of rows
        let query = 'SELECT COUNT(*) AS count FROM club_update WHERE club_id = ?;';
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

            if (!res.locals.isMember) {
                query = 'SELECT * FROM club_update WHERE club_id = ? AND is_public=TRUE ORDER BY published_timestamp DESC LIMIT ?, ?;';
            }
            query = 'SELECT * FROM club_update WHERE club_id = ? ORDER BY published_timestamp DESC LIMIT ?, ?;';
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

// add update - MANAGERS ONLY
router.post('/:clubId/add', function (req, res, next) {
    if (!res.locals.isManager) {
        res.status(400).send("You are not a club manager");
        return;
    }
    req.pool.getConnection(function (cerr, connection) {
        if (cerr) {
            console.log(cerr);
            res.status(500);
            return;
        }
        let query = `INSERT INTO club_update (title, content, club_id, user_id, is_public) VALUES (?, ?, ?, ?, ?);`;
        let params = [
            req.body.title, req.body.content, req.params.clubId,
            req.session.user_id, req.body.is_public
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

// check if public user can access update
router.param('updateId', function (req, res, next) {
    req.pool.getConnection(function (cerr, connection) {
        if (cerr) {
            res.status(500);
            return;
        }
        let query = `SELECT is_public FROM club_update WHERE update_id=?`;
        connection.query(query, [req.params.updateId], function (err, results, field) {
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

// get an update of a club
router.get('/:clubId/:updateId', function (req, res, next) {
    req.pool.getConnection(function (cerr, connection) {
        if (cerr) {
            res.status(500);
            return;
        }
        let query;
        if (!res.locals.isMember && !res.locals.isPublic) query = 'SELECT * FROM club_update WHERE club_id = ? AND update_id = ? AND is_public=TRUE;';
        else query = 'SELECT * FROM club_update WHERE club_id = ? AND update_id = ?;';
        let params = [req.params.clubId, req.params.updateId];
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

// edit update - MANAGERS ONLY
router.post('/:clubId/:updateId/edit', function (req, res, next) {
    if (!res.locals.isManager) {
        res.status(400).send("You are not a club manager");
        return;
    }
    req.pool.getConnection(function (cerr, connection) {
        if (cerr) {
            res.status(500);
            return;
        }

        let query = 'UPDATE club_update SET title = ?, content = ?, is_public = ? WHERE club_id = ? AND update_id = ?;';
        let params = [
            req.body.title, req.body.content, req.body.is_public,
            req.params.clubId, req.params.updateId
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

// archive update - MANAGERS ONLY
router.post('/:clubId/:updateId/archive', function (req, res, next) {
    if (!res.locals.isManager) {
        res.status(400).send("You are not a club manager");
        return;
    }
    req.pool.getConnection(function (cerr, connection) {
        if (cerr) {
            res.status(500);
            return;
        }
        let query = 'UPDATE club_update SET archived=TRUE WHERE club_id=? AND update_id=?';
        let params = [req.params.clubId, req.params.updateId];
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
