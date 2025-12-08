var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('Rendering index page');
  res.render('index', { title: 'Express', message: 'Welcome to Sprouty!' });
});

module.exports = router;
