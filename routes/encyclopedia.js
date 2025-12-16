var express = require('express');
var router = express.Router();
const fs = require('fs');


// get encyclopedia
router.get('/', function(req, res, next) {
  // first we get the data
  const encyclopediaData = fs.readFileSync('public/databases/encyclopedia.json', 'utf8');
  const encyclopedia = JSON.parse(encyclopediaData);
  // return the data to the request
  req.encyclopedia = encyclopedia;
  next();
}, (req, res) => {  
  // then we render the page
  res.render('encyclopedia', { encyclopedia: req.encyclopedia });
});

// get encyclopedia with anchor
router.get('/:name', function(req, res, next) {
  // first we get the data
  const encyclopediaData = fs.readFileSync('public/databases/encyclopedia.json', 'utf8');
  const encyclopedia = JSON.parse(encyclopediaData);
  // return the data to the request
  req.encyclopedia = encyclopedia;
//   req.anchor = encyclopedia.diseases[req.params.id].anchor;
//   console.log("anchor", req.anchor);
  next();
}, (req, res) => {  
  // then we render the page
  res.render(`encyclopedia`, { encyclopedia: req.encyclopedia, anchor: req.params.name });
    // res.redirect(`/encyclopedia#${req.anchor}`);
});

module.exports = router;