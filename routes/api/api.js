var express = require('express');
var router = express.Router();

router.get('/count/:dbName', function(req, res, next) {
    if (!['club', 'user', 'admin'].includes(req.params.dbName)) {
        res.status(404);
        return;
    }
    req.pool.getConnection(function(cerr, connection) {
        if (cerr) {
          res.status(500);
          return;
        }
        let query = `SELECT COUNT(*) AS count FROM ${req.params.dbName};`;
        if (req.params.dbName==='admin') query = `SELECT COUNT(*) AS count FROM user WHERE admin=TRUE;`;
        connection.query(query, function(err, results, field) {
          connection.release();
          if (err) {
            res.status(500);
            return;
          }
          res.json(results[0].count);
        });
      });
});

// get all admins
router.get('/admins', function(req, res, next){
  req.pool.getConnection(function(cerr, connection) {
      if (cerr) {
          res.status(500);
          return;
      }

      let query = 'SELECT * FROM user WHERE admin=TRUE;';
      connection.query(query, function(err, results, field) {
          connection.release();
          if (err) {
              res.status(500);
              return;
          }
          res.json(results);
      });
    });
});


module.exports = router;
