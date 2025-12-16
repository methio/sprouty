var express = require('express');
var router = express.Router();
const fs = require('fs');


// get question
router.get('/', function(req, res, next) {
  // first we get the data
  const data = fs.readFileSync('public/databases/ladySprout.json', 'utf8');
  const questions = JSON.parse(data);
  const question1 = questions.questions[1]; 
  const question2 = questions.questions[1]; 
  const question3 = questions.questions[2];
  
  console.log("First question:", question1);
  // then we render the page
  res.render('ladySprout', { question: question1 });
});

module.exports = router;
