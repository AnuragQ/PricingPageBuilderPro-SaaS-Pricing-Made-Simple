import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';
import { ThreeDots } from 'react-loader-spinner';

// Lazy-loaded components
const Home = lazy(() => import('./routes/Home'));
const About = lazy(() => import('./routes/About'));
const SignUp = lazy(() => import('./routes/SignUp'));
const LogIn = lazy(() => import('./routes/LogIn'));
const CreateWidget = lazy(() => import('./routes/CreateWidget'));

// Log login or logout status
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('User is logged in');
  } else {
    console.log('User is logged out');
  }
});

// Themed Loader Component
const ThemedLoader = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <ThreeDots color="#3B82F6" height={80} width={80} />
    </div>
  );
};

const App = () => (
  <Router>
    <AuthProvider> {/* Wrap routes with AuthProvider */}
      <Suspense fallback={<ThemedLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/create-widget" element={<CreateWidget />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  </Router>
);

export default App;
