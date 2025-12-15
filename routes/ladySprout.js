var express = require('express');
var router = express.Router();
const fs = require('fs');


// get question
router.get('/', function(req, res, next) {
  // first we get the data
  const data = fs.readFileSync('public/databases/ladySprout.json', 'utf8');
  const questions = JSON.parse(data);
  const firstQuestion = questions.questions[0]; 
  console.log("First question:", firstQuestion);
  // then we render the page
  res.render('ladySprout', { question: firstQuestion });
});

module.exports = router;
