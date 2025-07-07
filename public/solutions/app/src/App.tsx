import { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import './App.css'; // Ensure this import exists

interface Flashcard {
  question: string;
  answer: string;
}

interface AnswerResult {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

export default function App() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Flashcard | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [results, setResults] = useState<AnswerResult[]>([]);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    fetch('/src/flashcards.json')
      .then(res => res.json())
      .then(data => {
        const cards = data['learn-french'].flashcards;
        setFlashcards(cards);
        setCurrentQuestion(cards[Math.floor(Math.random() * cards.length)]);
      })
      .catch(err => console.error('Failed to load flashcards:', err));
  }, []);

  const checkAnswer = () => {
    if (!currentQuestion) return;

    const correct = userAnswer.trim().toLowerCase() === currentQuestion.answer.toLowerCase();
    const result: AnswerResult = {
      question: currentQuestion.question,
      userAnswer: userAnswer.trim(),
      correctAnswer: currentQuestion.answer,
      isCorrect: correct
    };

    setResults(prev => [...prev, result]);
    setScore(prev => correct ? prev + 1 : prev);
    setFeedback(correct ? 'Correct! 🎉' : `Incorrect! Correct answer: ${currentQuestion.answer}`);
  };

  const nextQuestion = () => {
    const remaining = flashcards.filter(card => 
      !results.some(r => r.question === card.question)
    );
    
    if (remaining.length > 0) {
      setCurrentQuestion(remaining[Math.floor(Math.random() * remaining.length)]);
      setUserAnswer('');
      setFeedback('');
    }
  };

  const generateReport = () => {
    const pdf = new jsPDF();
    
    pdf.setFontSize(18);
    pdf.text('Flashcard Quiz Results', 10, 10);
    pdf.setFontSize(12);
    pdf.text(`Score: ${score}/${flashcards.length} (${Math.round((score/flashcards.length)*100)}%)`, 10, 20);

    let yPos = 30;
    results.forEach((result, index) => {
      if (yPos > 280) {
        pdf.addPage();
        yPos = 10;
      }

      pdf.setTextColor(result.isCorrect ? '#008000' : '#ff0000');
      pdf.text(`${index + 1}. ${result.question}`, 10, yPos);
      pdf.text(`Your answer: ${result.userAnswer}`, 15, yPos + 7);
      pdf.text(`Correct answer: ${result.correctAnswer}`, 15, yPos + 14);
      yPos += 20;
    });

    pdf.save('quiz-results.pdf');
  };

  const generatePartialReport = () => {
    const pdf = new jsPDF();
    
    pdf.setFontSize(18);
    pdf.text('Current Quiz Report', 10, 10);
    pdf.setFontSize(12);
    pdf.text(`Current Score: ${score}/${flashcards.length}`, 10, 20);
  
    let yPos = 30;
    results.forEach((result, index) => {
      if (yPos > 280) {
        pdf.addPage();
        yPos = 10;
      }
  
      pdf.setTextColor(result.isCorrect ? '#008000' : '#ff0000');
      pdf.text(`${index + 1}. ${result.question}`, 10, yPos);
      pdf.text(`Your answer: ${result.userAnswer}`, 15, yPos + 7);
      pdf.text(`Correct answer: ${result.correctAnswer}`, 15, yPos + 14);
      yPos += 20;
    });
  
    if (results.length < flashcards.length) {
      pdf.text(`Remaining questions: ${flashcards.length - results.length}`, 10, yPos + 10);
    }
  
    pdf.save('current-quiz-report.pdf');
  };

  if (!currentQuestion) return <div className="loading">Loading flashcards...</div>;

  return (
    <div className="app">
      <div className="content-wrapper">
        <h1>Alleau Learning Platform</h1>
        
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${(results.length / flashcards.length) * 100}%` }}
          />
        </div>
  
        <div className="question-box">
          <h2>Translate:</h2>
          <p>{currentQuestion.question}</p>
        </div>
  
        <div className="answer-section">
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Enter your answer..."
          />
          
          {feedback && (
            <div className={`feedback ${results[results.length-1]?.isCorrect ? 'correct' : 'incorrect'}`}>
              {feedback}
            </div>
          )}
        </div>
  
        <div className="controls">
          {results.length < flashcards.length ? (
            <>
              <button 
                onClick={checkAnswer} 
                disabled={!userAnswer.trim()}
              >
                Check Answer
              </button>
              <button 
                onClick={nextQuestion} 
                disabled={!feedback}
              >
                Next Question
              </button>
            </>
          ) : (
            <button onClick={generateReport}>
              Final Report
            </button>
          )}
          
          <button 
            onClick={generatePartialReport} 
            disabled={results.length === 0}
            className="report-button"
          >
            Current Report
          </button>
        </div>
  
        <div className="progress">
          Progress: {results.length}/{flashcards.length} | Score: {score}
        </div>
      </div>
    </div>
  );
}