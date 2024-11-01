import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Cadastro from './pages/Cadastro';
import Sobre from './pages/Sobre';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/cadastro/*" element={<Cadastro />} />
        <Route path="/sobre" element={<Sobre />} />
      </Routes>
    </Router>
  );
}

export default App;
