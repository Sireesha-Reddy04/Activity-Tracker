// App.jsx
import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Auth } from './pages/auth/index';
import { ActivityTracker } from './pages/activity--tracker/index';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/activity--tracker" element={<ActivityTracker />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
