const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000; 

const quizQuestions = require('./quiz-questions.json');


app.use(express.json());
app.use(cors());

// Serve HTML file for quiz
app.get('/quiz', (req, res) => {
    res.sendFile(path.join(__dirname, 'quiz.html'));
});

//To fetch quiz questions
app.get('/quiz-questions', (req, res) => {
  res.json(quizQuestions);
});

//Handle user submissions
app.post('/submit-answers', (req, res) => {
  const userAnswers = req.body.answers;
  let score = 0;
  const feedback = [];

  quizQuestions.forEach((question, index) => {
    if (userAnswers[index] === question.correctOption) {
      score++;
      feedback.push(`Question ${index + 1}: Correct!`);
    } else {
      feedback.push(`Question ${index + 1}: Incorrect. Correct answer: ${question.options[question.correctOption]}`);
    }
  });
  console.log("Score", score);
  const message = `Your Final Score is ${score}/${quizQuestions.length}`;
  res.json({ score, feedback, message });
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
