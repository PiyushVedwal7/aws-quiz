import React, { useState, useEffect } from 'react';
import './App.css';
import { Amplify } from 'aws-amplify';
import { Authenticator, withAuthenticator, useAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import awsExports from './aws-exports';
import Quiz from './Quiz';

Amplify.configure(awsExports);

function App() {
  const [view, setView] = useState('quiz');
  const [score, setScore] = useState(null);
  const [scores, setScores] = useState({});
  const { user } = useAuthenticator((context) => [context.user]);

  // Load scores from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('quizScoresDict');
    if (saved) setScores(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('quizScoresDict', JSON.stringify(scores));
  }, [scores]);

  const handleSubmitScore = (newScore) => {
    const email = user?.attributes?.email || user?.username;
    const prev = scores[email] || 0;
    if (newScore > prev) {
      setScores({ ...scores, [email]: newScore });
    }
    setScore(newScore);
    setView('leaderboard');
  };

  const Leaderboard = () => {
    const sorted = Object.entries(scores).sort(([, a], [, b]) => b - a);
    return (
      <div className="section">
        <h2>🏆 Leaderboard</h2>
        {sorted.length === 0 ? (
          <p>No scores yet.</p>
        ) : (
          <ol>
            {sorted.map(([email, scr], i) => (
              <li key={i}><strong>{email}</strong> - {scr}</li>
            ))}
          </ol>
        )}
        {score !== null && <p className="your-score">Your latest score: {score}</p>}
      </div>
    );
  };

  const Profile = () => (
    <div className="section">
      <h2>👤 Profile</h2>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.attributes?.email}</p>
    </div>
  );

  return (
    <div className="App">
      <Authenticator>
        {({ signOut }) => (
          <main>
            <header className="glass-card">
              <h1 className="title">🚀 Quiz Galaxy</h1>

              <nav className="tab-buttons">
                <button className={view === 'quiz' ? 'active' : ''} onClick={() => setView('quiz')}>📝 Quiz</button>
                <button className={view === 'leaderboard' ? 'active' : ''} onClick={() => setView('leaderboard')}>🏆 Leaderboard</button>
                <button className={view === 'profile' ? 'active' : ''} onClick={() => setView('profile')}>👤 Profile</button>
              </nav>

              <div className="quiz-container">
                {view === 'quiz' && <Quiz onSubmitScore={handleSubmitScore} />}
                {view === 'leaderboard' && <Leaderboard />}
                {view === 'profile' && <Profile />}
              </div>

              <button className="sign-out-button" onClick={signOut}>
                <span>Sign Out</span>
              </button>
            </header>
          </main>
        )}
      </Authenticator>
    </div>
  );
}

export default withAuthenticator(App);
