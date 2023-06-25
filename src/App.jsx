import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import DexieDataPage from './DexieDataPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dexie-data" element={<DexieDataPage />} />
      </Routes>
    </Router>
  );
}

export default App;
