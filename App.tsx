import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from './views/Home';
import AmslerTest from './views/AmslerTest';
import PhpTest from './views/PhpTest';
import SdhTest from './views/SdhTest';
import MChartTest from './views/MChartTest';
import CentralFieldTest from './views/CentralFieldTest';
import ReadingTest from './views/ReadingTest';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/amsler" element={<AmslerTest />} />
        <Route path="/php" element={<PhpTest />} />
        <Route path="/sdh" element={<SdhTest />} />
        <Route path="/mchart" element={<MChartTest />} />
        <Route path="/central-field" element={<CentralFieldTest />} />
        <Route path="/reading" element={<ReadingTest />} />
      </Routes>
    </HashRouter>
  );
};

export default App;