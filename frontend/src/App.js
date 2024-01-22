import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const Home = lazy(() => import('./routes/Home'));
const About = lazy(() => import('./routes/About'));
const CreateWidget = lazy(() => import('./routes/CreateWidget'));

const App = () => (
  <Router>
    <Suspense fallback={<div></div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/create-widget" element={<CreateWidget />} />
      </Routes>
    </Suspense>
  </Router>
);

export default App;