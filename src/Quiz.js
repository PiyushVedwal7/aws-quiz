import React, { useState, useEffect } from 'react';
import quizData from './quizData';
import './Quiz.css';

function Quiz({ onSubmitScore }) { // ✅ Accepting a prop
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [highScores, setHighScores] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('highScores')) || [];
    setHighScores(saved);
  }, []);

  useEffect(() => {
    if (showScore) {
      const updated = [...highScores, score].sort((a, b) => b - a).slice(0, 5);
      setHighScores(updated);
      localStorage.setItem('highScores', JSON.stringify(updated));
      
      if (onSubmitScore) {
        onSubmitScore(score); // ✅ Notify App.js when quiz ends
      }
    }
  }, [showScore]);

  const handleAnswerOptionClick = (option) => {
    const correctAnswer = quizData[currentQuestion].answer;
    setSelectedAnswer(option);
    if (option === correctAnswer) {
      setScore(score + 1);
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }

    setTimeout(() => {
      const next = currentQuestion + 1;
      if (next < quizData.length) {
        setCurrentQuestion(next);
        setSelectedAnswer('');
        setIsCorrect(null);
      } else {
        setShowScore(true); // ✅ Triggers score update
      }
    }, 900);
  };

  return (
    <div className="quiz-body">
      <div className="quiz-container">
        {showScore ? (
          <div className="score-section">
            <h1>🎉 Your Final Score</h1>
            <p>{score} / {quizData.length}</p>

            <h2>🏆 Top Scores</h2>
            <ul>
              {highScores.map((s, idx) => (
                <li key={idx}>#{idx + 1} — {s}</li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="question-card">
            <div className="question-header">
              <h2>Question {currentQuestion + 1} of {quizData.length}</h2>
              <p className="question-text">{quizData[currentQuestion].question}</p>
            </div>
            <div className="options-list">
              {quizData[currentQuestion].options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswerOptionClick(option)}
                  className={`option-btn ${
                    selectedAnswer === option
                      ? isCorrect
                        ? 'correct'
                        : 'wrong'
                      : ''
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            {selectedAnswer && (
              <p className={`feedback ${isCorrect ? 'correct' : 'wrong'}`}>
                {isCorrect ? '✅ Correct!' : '❌ Oops! Try the next one!'}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Quiz;
