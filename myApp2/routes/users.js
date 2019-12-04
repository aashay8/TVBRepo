var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log(req.cookies);
  res.send('respond with a resource');
});

router.get('/add',function(req, res, next){
  //Enter req data into JSON
});

router.get('/games', function(req, res, next) {
  res.send('List of games');
});

router.get('/likes', function(req, res, next) {
  res.send('List of likes');
});

module.exports = router;
