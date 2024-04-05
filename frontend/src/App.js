// App.js
import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { ThreeDots } from "react-loader-spinner";

// Print if user is Logged in or not using firebase
import { auth } from "./config/firebase";
import { onAuthStateChanged } from "firebase/auth";

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("Logged in");
  } else {
    console.log("Logged out");
  }
});

// Lazy-loaded components
const Home = lazy(() => import("./routes/Home"));
const About = lazy(() => import("./routes/About"));
const SignUp = lazy(() => import("./routes/SignUp"));
const LogIn = lazy(() => import("./routes/LogIn"));
const ForgotPassword = lazy(() => import("./routes/ForgotPassword"));
const CreateWidget = lazy(() => import("./routes/CreateWidget"));
const ChooseTemplate = lazy(() => import("./routes/ChooseTemplate"));
const MyApps = lazy(() => import("./routes/MyApps"));
const CreateTemplate = lazy(() => import("./routes/CreateTemplate"));
const Profile = lazy(() => import("./routes/Profile"));
const EditWidget = lazy(() => import("./routes/EditWidget"));
const Pricing = lazy(() => import("./routes/Pricing"));
const NotFound = lazy(() => import("./routes/NotFound"));
const FailedPayment = lazy(() => import("./routes/FailedPayment"));
const SuccessPayment = lazy(() => import("./routes/SuccessPayment"));

// templates
const Template1 = lazy(() => import("./templates/Template1"));
const Template2 = lazy(() => import("./templates/Template2"));
const Template3 = lazy(() => import("./templates/Template3"));
const Template4 = lazy(() => import("./templates/Template4"));
const Template5 = lazy(() => import("./templates/Template5"));
const Template6 = lazy(() => import("./templates/Template6"));

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
            <Route path="/choose-template" element={<ChooseTemplate />} />
            <Route path="/my-apps" element={<MyApps />} />
            <Route path="/pricing" element={<Pricing />} />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-widget"
              element={
                <ProtectedRoute>
                  <CreateWidget />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-widget"
              element={
                <ProtectedRoute>
                  <EditWidget />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-template"
              element={
                <ProtectedRoute>
                  <CreateTemplate />
                </ProtectedRoute>
              }
            />

            <Route
              path="/payment-failed"
              element={
                <ProtectedRoute>
                  <FailedPayment />
                </ProtectedRoute>
              }
            />

            <Route
              path="/payment-success"
              element={
                <ProtectedRoute>
                  <SuccessPayment />
                </ProtectedRoute>
              }
            />

            <Route path="/template1" element={<Template1 />} />
            <Route path="/template2" element={<Template2 />} />
            <Route path="/template3" element={<Template3 />} />
            <Route path="/template4" element={<Template4 />} />
            <Route path="/template5" element={<Template5 />} />
            <Route path="/template6" element={<Template6 />} />
            {/* Add more routes as needed */}

            {/* If any other route show NotFound  */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </Router>
  );
};

export default App;
