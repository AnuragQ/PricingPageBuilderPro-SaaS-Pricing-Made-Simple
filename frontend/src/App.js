// App.js
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { ThreeDots } from 'react-loader-spinner';

// Print if user is Logged in or not using firebase
import { auth } from './config/firebase';
import { onAuthStateChanged } from 'firebase/auth';

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log('Logged in');
  } else {
    console.log('Logged out');
  }
});


// Lazy-loaded components
const Home = lazy(() => import('./routes/Home'));
const About = lazy(() => import('./routes/About'));
const SignUp = lazy(() => import('./routes/SignUp'));
const LogIn = lazy(() => import('./routes/LogIn'));
const CreateWidget = lazy(() => import('./routes/CreateWidget'));

// Themed Loader Component
const ThemedLoader = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <ThreeDots color="#3B82F6" height={80} width={80} />
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Suspense fallback={<ThemedLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<LogIn />} />
            <Route 
              path="/create-widget" 
              element={
                <ProtectedRoute>
                  <CreateWidget />
                </ProtectedRoute>
              } 
            />
            {/* Add more routes as needed */}
          </Routes>
        </Suspense>
      </AuthProvider>
    </Router>
  );
};

export default App;
