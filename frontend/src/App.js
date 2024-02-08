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
const ForgotPassword = lazy(() => import('./routes/ForgotPassword'));
const CreateWidget = lazy(() => import('./routes/CreateWidget'));
const ChooseTemplate = lazy(() => import('./routes/ChooseTemplate'));
const MyApps = lazy(() => import('./routes/MyApps'));

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
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path='/choose-template' element={<ChooseTemplate />} />
            <Route path='/my-apps' element={<MyApps />} />
            
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
