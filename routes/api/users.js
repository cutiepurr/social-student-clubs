var express = require('express');
var bcrypt = require('bcryptjs'); // authentication
var router = express.Router();
const CLIENT_ID = process.env.CLIENT_ID;
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

// get all users
router.get('/', function (req, res, next) {
    req.pool.getConnection(function (cerr, connection) {
        if (cerr) {
            res.status(500);
            return;
        }

        let query = 'SELECT * FROM user;';
        let params = [];
        if ("email" in req.query) {
            query = 'SELECT * FROM user WHERE email=?;';
            params = [req.query.email];
        }
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

// session only
router.get('/auth', function (req, res, next) {
    let result = {
        isLoggedIn: false,
        isAdmin: false
    };
    if ('user_id' in req.session) result.isLoggedIn = true;
    if ('admin' in req.session) result.isAdmin = true;
    res.json(result);
});

router.get('/current', function (req, res, next) {
    if (!('user_id' in req.session)) {
        res.status(400);
        return;
    }
    req.pool.getConnection(function (cerr, connection) {
        if (cerr) {
            res.status(500);
            return;
        }

        let query = 'SELECT * FROM user WHERE user_id = ?;';
        connection.query(query, [req.session.user_id], function (err, results, field) {
            connection.release();
            if (err) {
                res.status(500);
                return;
            }
            res.json(results[0]);
        });
    });
});

// change current user's info
router.post('/current', function (req, res, next) {
    if (!('user_id' in req.session)) {
        res.status(400);
        return;
    }
    req.pool.getConnection(function (cerr, connection) {
        if (cerr) {
            res.status(500);
            return;
        }

        let query = 'UPDATE user SET first_name=?, last_name=? WHERE user_id=?';
        let params = [req.body.first_name, req.body.last_name, req.session.user_id];
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

// get all clubs user is in
router.get('/clubs', function (req, res, next) {
    if (!('user_id' in req.session)) {
        res.status(400);
        return;
    }
    req.pool.getConnection(function (cerr, connection) {
        if (cerr) {
            res.status(500);
            return;
        }

        let query = `SELECT * FROM club LEFT JOIN club_member
    ON club.club_id = club_member.club_id
    WHERE user_id=?;`;
        connection.query(query, [req.session.user_id], function (err, results, field) {
            connection.release();
            if (err) {
                res.status(500);
                return;
            }
            res.json(results);
        });
    });
});

router.get('/rsvp', function (req, res, next) {
    if (!('user_id' in req.session)) {
        res.status(400);
        return;
    }
    req.pool.getConnection(function (cerr, connection) {
        if (cerr) {
            res.status(500);
            return;
        }

        let query = `SELECT * FROM event_rsvp RIGHT JOIN club_event
        ON event_rsvp.event_id = club_event.event_id AND event_rsvp.club_id = club_event.club_id
        WHERE event_rsvp.user_id=?`;
        connection.query(query, [req.session.user_id], function (err, results, field) {
            connection.release();
            if (err) {
                res.status(500);
                return;
            }
            res.json(results);
        });
    });
});

// remove admin
router.post('/admin/remove', function (req, res, next) {
    req.pool.getConnection(function (cerr, connection) {
        if (cerr) {
            res.status(500);
            return;
        }

        let query = `UPDATE user SET admin=FALSE WHERE user_id=?`;
        connection.query(query, [req.body.user_id], function (err, results, field) {
            connection.release();
            if (err) {
                res.status(500);
                return;
            }
            res.sendStatus(200);
        });
    });
});

// add admin
router.post('/admin/add', function (req, res, next) {
    req.pool.getConnection(function (cerr, connection) {
        if (cerr) {
            res.status(500);
            return;
        }

        let query = `UPDATE user SET admin=TRUE WHERE email=?`;
        connection.query(query, [req.body.email], function (err, results, field) {
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

// delete user
router.post('/delete', function (req, res, next) {
    req.pool.getConnection(function (cerr, connection) {
        if (cerr) {
            res.status(500);
            return;
        }
        // can't delete 1st admin account
        if (req.body.userId == 1) {
            res.status(500);
            return;
        }

        let query;
        query = `UPDATE club_event SET user_id=1 WHERE user_id=?`;
        connection.query(query, [req.body.user_id], function (err, results, field) {
            if (err) {
                console.log(err);
                res.status(500);
                return;
            }
        });
        query = `UPDATE club_update SET user_id=1 WHERE user_id=?`;
        connection.query(query, [req.body.user_id], function (err, results, field) {
            if (err) {
                console.log(err);
                res.status(500);
                return;
            }
        });
        query = `DELETE FROM event_rsvp WHERE user_id=?`;
        connection.query(query, [req.body.user_id], function (err, results, field) {
            if (err) {
                console.log(err);
                res.status(500);
                return;
            }
        });
        query = `DELETE FROM club_member WHERE user_id=?`;
        connection.query(query, [req.body.user_id], function (err, results, field) {
            if (err) {
                console.log(err);
                res.status(500);
                return;
            }
        });
        query = `DELETE FROM club_notification WHERE user_id=?`;
        connection.query(query, [req.body.user_id], function (err, results, field) {
            if (err) {
                console.log(err);
                res.status(500);
                return;
            }
        });
        query = `DELETE FROM user WHERE user_id=?`;
        connection.query(query, [req.body.user_id], function (err, results, field) {
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

// users log in
router.post('/login', function (req, res, next) {
    req.pool.getConnection(function (cerr, connection) {
        if (cerr) {
            console.log(cerr);
            res.status(500);
            return;
        }
        let query = 'SELECT * FROM user WHERE email=?;';
        connection.query(query, [req.body.email], function (err, results, field) {
            if (err) {
                console.log(err);
                res.status(500);
                return;
            }
            // check if user exists
            if (!results[0]) {
                res.status(400).send("Email not found!");
                return;
            }
            let hash = results[0].password;
            bcrypt.compare(req.body.password, hash, function (e, result) {
                if (e) {
                    console.log(e);
                    res.status(500);
                    return;
                }
                if (!result) {
                    res.status(400).send("Incorrect password");
                    return;
                }
                req.session.user_id = results[0].user_id;
                if (results[0].admin) req.session.admin = true;
                res.sendStatus(200);
            });
        });
    });
});

// users sign up
router.post('/signup', function (req, res, next) {
    // username, password, email
    req.pool.getConnection(function (cerr, connection) {
        if (cerr) {
            res.status(500);
            return;
        }
        // check if email in database
        let query = 'SELECT email FROM user WHERE email=?';
        connection.query(query, [req.body.email], function (err, results, field) {
            if (err) {
                console.log(err);
                res.status(500);
                return;
            }
            if (results[0]) {
                res.status(400).send("Existing email");
                return;
            }
        });

        // hash password
        bcrypt.hash(req.body.password, 10, function (e, hash) {
            query = 'INSERT INTO user (first_name, last_name, email, password) VALUES (?, ?, ?, ?);';
            let params = [req.body.first_name, req.body.last_name, req.body.email, hash];
            connection.query(query, params, function (err, results, field) {
                if (err) {
                    console.log(err);
                    res.status(500);
                    return;
                }
            });
            // store user_id in session
            query = 'SELECT user_id FROM user WHERE email=?';
            connection.query(query, [req.body.email], function (err, results, field) {
                connection.release();
                if (err) {
                    console.log(err);
                    res.status(500);
                    return;
                }
                if (!('user_id' in req.session)) req.session.user_id = results[0].user_id;
                res.sendStatus(200);
            });
        });

    });
});

router.post('/change-password', function (req, res, next) {
    req.pool.getConnection(function (cerr, connection) {
        if (cerr) {
            res.status(500);
            return;
        }
        // get old hash password
        let query = 'SELECT password FROM user WHERE user_id=?';
        connection.query(query, [req.session.user_id], function (err, results, field) {
            if (err) {
                console.log(err);
                res.status(500);
                return;
            }
            let hash = results[0].password;

            // check old password
            bcrypt.compare(req.body.old, hash, function (e, result) {
                if (e) {
                    console.log(e);
                    res.status(500);
                    return;
                }
                if (!result) {
                    res.status(400).send("Incorrect old password");
                    return;
                }
                // hash new password
                bcrypt.hash(req.body.new, 10, function (e2, h) {
                    query = 'UPDATE user SET password=? WHERE user_id=?';
                    let params = [h, req.session.user_id];
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

    });
});

router.post('/glogin', async function (req, res, next) {
    if ('client_id' in req.body) {
        const ticket = await client.verifyIdToken({
            idToken: req.body.credential,
            audience: CLIENT_ID // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        const payload = ticket.getPayload();
        req.pool.getConnection(function (cerr, connection) {
            if (cerr) {
                console.log(cerr);
                res.status(500);
                return;
            }
            let query = 'SELECT * FROM user WHERE email=?;';
            connection.query(query, [payload.email], function (err, results, field) {
                if (err) {
                    console.log(err);
                    res.status(500);
                    return;
                }
                // sign up
                if (!results[0]) {
                    query = 'INSERT INTO user (first_name, last_name, email, pictureUrl) VALUES (?, ?, ?, ?);';
                    let params = [
                        payload.given_name, payload.family_name,
                        payload.email, payload.picture
                    ];
                    connection.query(query, params, function (err2, results2, field2) {
                        if (err2) {
                            console.log(err2);
                            res.status(500);
                            return;
                        }
                        // store user_id in session
                        query = 'SELECT user_id FROM user WHERE email=?';
                        connection.query(query, [payload.email], function (err3, results3, field3) {
                            connection.release();
                            if (err3) {
                                console.log(err3);
                                res.status(500);
                                return;
                            }
                            if (!('user_id' in req.session)) req.session.user_id = results3[0].user_id;
                            res.sendStatus(200);
                        });
                    });
                } else {
                    req.session.user_id = results[0].user_id;
                    if (results[0].admin) req.session.admin = true;
                    res.sendStatus(200);
                }
            });
        });
    }
});


/*
* :userID
*/
// get user info - no password
router.get('/:userID', function (req, res, next) {
    req.pool.getConnection(function (cerr, connection) {
        if (cerr) {
            res.status(500);
            return;
        }

        let query = 'SELECT * FROM user WHERE user_id = ?;';
        connection.query(query, [req.params.userID], function (err, results, field) {
            connection.release();
            if (err) {
                res.status(500);
                return;
            }
            let data = results[0];
            res.json({
                user_id: data.user_id,
                email: data.email,
                first_name: data.first_name,
                last_name: data.last_name,
                pictureUrl: data.pictureUrl
            });
        });
    });
});

// change user's info - ADMIN ONLY
router.post('/:userId', function (req, res, next) {
    if (!('admin' in req.session)) {
        res.status(400).send("Unauthorised");
        return;
    }
    req.pool.getConnection(function (cerr, connection) {
        if (cerr) {
            res.status(500);
            return;
        }
        let query;
        let param;
        query = `SELECT * FROM user WHERE user_id != ? AND email=?;`;
        param = [req.params.userId, req.body.email];
        connection.query(query, param, function (err, results, field) {
            if (err) {
                res.status(500);
                return;
            }
            if (results[0]) {
                res.status(500).send("Email exists in database");
                return;
            }
            query = `UPDATE club_notification SET email = ? WHERE user_id = ?;`;
            param = [req.body.email, req.params.userId];
            connection.query(query, param, function (err2, results2, field2) {
                if (err2) {
                    res.status(500);
                    return;
                }
            });
            query = `UPDATE user SET first_name = ?, last_name = ?, email = ? WHERE user_id = ?;`;
            param = [req.body.first_name, req.body.last_name, req.body.email, req.params.userId];
            connection.query(query, param, function (err2, results2, field2) {
                connection.release();
                if (err2) {
                    res.status(500);
                    return;
                }
                res.status(200).send();
            });
        });
    });
});

// change password in ADMIN portal
router.post('/:userId/change-password', function (req, res, next) {
    if (!('admin' in req.session)) {
        res.status(400).send("Unauthorised");
        return;
    }
    req.pool.getConnection(function (cerr, connection) {
        if (cerr) {
            res.status(500);
            return;
        }
        bcrypt.hash(req.body.password, 10, function (e, h) {
            let query = 'UPDATE user SET password=? WHERE user_id=?';
            let params = [h, req.params.userId];
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
});

module.exports = router;
