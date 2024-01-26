// AboutUs.js
import React from 'react';
import { motion } from 'framer-motion';

const AboutUs = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Navigation - Similar to Home page */}
      <motion.nav
        className="flex justify-between items-center p-4"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <a className="font-bold text-xl" href="/">
          Home
        </a>
        {/* ... (additional navigation links if needed) */}
      </motion.nav>

      {/* Main Content */}
      <motion.div
        className="max-w-xl mx-auto mt-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 className="text-4xl font-bold mb-6" variants={containerVariants}>
          About Us
        </motion.h1>
        <p className="mb-6">
          We are a team of passionate developers dedicated to creating innovative solutions.
          Our mission is to simplify the complexities of web development and deliver exceptional user experiences.
        </p>
        <p className="mb-6">
          Explore our projects and join us on this exciting journey of turning ideas into reality.
        </p>
        {/* Add more content as needed */}
      </motion.div>

      {/* Footer - Similar to Home page */}
      <footer className="p-4 mt-16">
        <div className="text-center text-sm">
          <a href="#" className="text-blue-500 hover:underline">
            Privacy Policy
          </a>{' '}
          •{' '}
          <a href="#" className="text-blue-500 hover:underline">
            Terms of Use
          </a>
        </div>
      </footer>
    </div>
  );
};

export default AboutUs;
