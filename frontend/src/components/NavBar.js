import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase"; // Adjust the import path as necessary
import { useAuth } from "../contexts/AuthContext"; // Adjust the import path as necessary

const Navbar = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  const navLinkVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  const buttonVariants = {
    hover: { scale: 1.1 },
    tap: { scale: 0.9 },
  };

  const handleCreateWidget = () => {
    navigate("/choose-template");
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const handleAuthNavigation = () => {
    // Navigate to the dashboard if the user is logged in, or to the login page if not
    navigate(currentUser ? "/dashboard" : "/login");
  };

  return (
    <div className="bg-gray-100 p-8">
      <motion.nav
        className="flex justify-between items-center p-4"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <a className="font-bold text-xl" href="/">
          Bill Brilliance
        </a>
        <div className="space-x-4 flex">
          <div className="flex justify-center items-center space-x-10 mr-5">
            <motion.a
              href="/profile"
              className="text-gray-800"
              variants={navLinkVariants}
              whileHover="hover"
            >
              Profile
            </motion.a>
            <motion.a
              href="/my-apps"
              className="text-gray-800"
              variants={navLinkVariants}
              whileHover="hover"
            >
              My Widgets
            </motion.a>
            <motion.a
              href="/create-template"
              className="text-gray-800"
              variants={navLinkVariants}
              whileHover="hover"
            >
              Create Template
            </motion.a>
          </div>

          <motion.button
            onClick={handleCreateWidget}
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            Templates
          </motion.button>
          {currentUser ? (
            <motion.button
              onClick={handleSignOut}
              className="px-4 py-2 bg-red-500 text-white rounded-md"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Sign Out
            </motion.button>
          ) : (
            <motion.button
              onClick={handleAuthNavigation}
              className="px-4 py-2 bg-green-500 text-white rounded-md"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              Log In
            </motion.button>
          )}
        </div>
      </motion.nav>
    </div>
  );
};

export default Navbar;
