// App.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {ThreeDots} from 'react-loader-spinner'; // Import the loader

const Home = () => {
  // State to manage if the content is loading
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate a network request
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  // Variants for Framer Motion to animate elements
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const buttonVariants = {
    hover: { scale: 1.1, transition: { duration: 0.2 } },
    tap: { scale: 0.9 }
  };

  const navLinkVariants = {
    hover: { scale: 1.1, originX: 0, color: '#3B82F6' }
  };

  const handleCreateWidget = () => {
    // Redirect to the create widget page
    window.location.href = '/create-widget';
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <motion.nav
        className="flex justify-between items-center p-4"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <a className="font-bold text-xl" href="#">Dashboard</a>
        <div className="space-x-4">
          <motion.a
            href="#"
            className="text-gray-800"
            variants={navLinkVariants}
            whileHover="hover"
          >
            My Apps
          </motion.a>
          <motion.a
            href="#"
            className="text-gray-800"
            variants={navLinkVariants}
            whileHover="hover"
          >
            Catalog
          </motion.a>
          <motion.a
            href="#"
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            Templates
          </motion.a>
        </div>
      </motion.nav>
      
      {isLoading ? (
        <motion.div
          className="flex justify-center items-center h-64"
          initial="hidden"
          animate="visible"
        >
          {/* Use the ThreeDots loader */}
          <ThreeDots
            type="ThreeDots"
            color="#3B82F6"
            height={100}
            width={100}
          />
        </motion.div>
      ) : (
        <motion.div
          className="max-w-xl mx-auto mt-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 className="text-4xl font-bold mb-6" variants={containerVariants}>
            Create Your First Widget
          </motion.h1>
          <p className="mb-6">To create a widget, select an app in our catalog. Then use one of the ready-made templates or configure your widget from scratch.</p>
          <motion.button
            className="px-6 py-3 bg-green-500 text-white rounded-md hover:bg-green-600"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => handleCreateWidget()}
          >
            + Create Widget
          </motion.button>
        </motion.div>
      )}

      <footer className="p-4 mt-16">
        <div className="text-center text-sm">
          <a href="#" className="text-blue-500 hover:underline">Privacy Policy</a> • <a href="#" className="text-blue-500 hover:underline">Terms of Use</a>
        </div>
      </footer>
    </div>
  );
};

export default Home;
