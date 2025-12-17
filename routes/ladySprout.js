var express = require('express');
var router = express.Router();
const fs = require('fs');

const data = fs.readFileSync('public/databases/data-ladySprout.json', 'utf8');
const allQuestions = JSON.parse(data);

// get question
router.get('/', function(req, res) {
  const questionId = req.query.question;
  const answerText = req.query.answer;
 
  // if no parameter show first question
  if(!questionId){
    const firstQuestion = allQuestions.questions.find(q => q.question_id ===1);
    return res.render('ladySprout',{question:firstQuestion});
  }

// find current question
  const question = allQuestions.questions.find(q => q.question_id == questionId);

  const picked = question.answers.find(a => a.answer === answerText);
  
  if (picked.encyclopedia_id){
    return res.redirect(`/encyclopedia/${picked.encyclopedia_id}`);
  }
  
  if (picked.id_of_next_question){
    const nextQuestion = allQuestions.questions.find(
      q=> q.question_id === picked.id_of_next_question);
      return res.render('ladySprout', {question: nextQuestion});
  }
  

});

module.exports = router;
