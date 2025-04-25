import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import React from 'react';
import Play from './Pages/Play';
import Search from './Pages/Search';
import Results from "./Pages/Results";
import AddImage from './Pages/AddImage';
import CharacterPage from './Pages/CharacterPage'; 
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/play" element={<Play />} />
        <Route path="/add" element={<AddImage />} />
        <Route path="/results" element={<Results />} />
        <Route path="/search" element={<Search />} />
        <Route path="/character" element={<CharacterPage />} /> 
      </Routes>
    </Router>
  );
}

export default App;