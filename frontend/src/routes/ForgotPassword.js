import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions";
import { auth } from "../config/firebase"; 
import { ThreeDots } from "react-loader-spinner";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async (email) => {
    setIsLoading(true);
    const functions = getFunctions(); 
    const checkEmailRegistered = httpsCallable(
      functions,
      "checkEmailRegistered"
    );

    checkEmailRegistered({ email })
      .then((result) => {
        if (result.data.registered) {
          sendPasswordResetEmail(auth, email)
            .then(() => {
              setMessage("Password reset email sent. Please check your inbox.");
            })
            .catch((error) => {
              setMessage(
                "Failed to send password reset email. Please try again later."
              );
            });
        } else {
          setMessage("Email address is not registered.");
        }
      })
      .catch((error) => {
        setMessage(
          "Error checking email registration. Please try again later."
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleResetPassword(email);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-6">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Reset Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email address and we'll send you a link to reset your
            password.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div>
            {isLoading ? (
              <div className="flex justify-center items-center">
                <ThreeDots color="#4F46E5" height={50} width={50} />
              </div>
            ) : (
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Send Reset Email
              </button>
            )}
          </div>
          {message && (
            <div className="text-center text-sm text-gray-600 mt-4">
              {message}
            </div>
          )}
        </form>
      </div>
                  {/* Return to Home Link */}
                  <p className="mt-2 text-center text-sm text-gray-600">
              <a href="/" className="font-medium text-indigo-600 hover:text-indigo-500">
                Return to Home
              </a>
            </p>
    </div>
  );
};

export default ForgotPassword;
