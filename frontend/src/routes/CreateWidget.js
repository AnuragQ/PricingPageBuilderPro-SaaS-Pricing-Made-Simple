import React, { useState } from "react";
import NavBar from "../components/NavBar"; // Adjust the import path as needed
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaTimes } from "react-icons/fa"; // Ensure react-icons is 
import './CreateWidget.css';
// Import the library to use icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// Import the icons you need
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

const CreateWidget = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [colors, setColors] = useState({
    color1: "lightgrey", // Example initial color
    color2: "lightblue", // Example initial color
    color3: "lightgreen", // Add more colors as needed
  });

  // Spring animations for smoother sidebar movement
  const sidebarVariants = {
    collapsed: {
      width: "50px",
      transition: {
        duration: 0.5,
        type: "spring",
        stiffness: 100,
      },
      backgroundColor: "#F4F7F6",
      boxShadow: "0 0 0 0 rgba(0, 0, 0, 0)",
    },
    expanded: {
      width: "250px",
      transition: {
        duration: 0.5,
        type: "spring",
        stiffness: 100,
      },
    },
  };

  // Adjust to match your website's theme
  const handleColorChange = (colorKey, colorValue) => {
    setColors((prevColors) => ({
      ...prevColors,
      [colorKey]: colorValue,
    }));
  };

  return (
    <>
      <NavBar />
      <div className="flex h-screen bg-[#F4F7F6]">
        {" "}
        {/* Background color adjusted to a modern palette */}
        <AnimatePresence>
          <motion.aside
            className="flex flex-col items-center bg-white shadow-xl"
            variants={sidebarVariants}
            initial={false}
            animate={isCollapsed ? "collapsed" : "expanded"}
          >
            <div className="p-2 cursor-pointer">
              {isCollapsed ? (
                <FaBars
                  className="text-2xl text-[#333]"
                  onClick={() => setIsCollapsed(false)}
                />
              ) : (
                <FaTimes
                  className="text-2xl text-[#333]"
                  onClick={() => setIsCollapsed(true)}
                />
              )}
            </div>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="px-4 py-2"
              >
                {Object.keys(colors).map((colorKey, index) => (
                  <div key={index} className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">{`Color ${colorKey.slice(
                      -1
                    )}`}</label>
                    <select
                      onChange={(e) =>
                        handleColorChange(colorKey, e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488] focus:border-[#0D9488]" // Ring and border color adjusted
                    >
                      <option value="lightgrey">Light Grey</option>
                      <option value="lightblue">Light Blue</option>
                      <option value="lightgreen">Light Green</option>
                      {/* Add more options as needed */}
                    </select>
                  </div>
                ))}
              </motion.div>
            )}
          </motion.aside>
        </AnimatePresence>
        {/* Here main content starts*/}
        {/* Each Motion div represents a widget */}
        <div className="flex-1 flex flex-row  p-4">
          {Object.keys(colors).map((colorKey, index) => (
            <motion.div
              key={index}
              className="m-2 p-20 py-10 rounded-lg shadow-lg flex flex-col "
              style={{ backgroundColor: colors[colorKey] }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <span>{`${colorKey.toUpperCase()}: ${colors[colorKey]}`}</span>
              <h2 class="plan-title">Basic Plan</h2>
              <p class="plan-description">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              <p class="plan-price">$19.99/month</p>
              <button class="plan-button">Get Started</button>
              <ul class="plan-features">
              <li><FontAwesomeIcon icon={faCheckCircle} size="lg" color="green" className="icon-right-space" /> 1 GB Storage</li>
              <li><FontAwesomeIcon icon={faCheckCircle} size="lg" color="green" className="icon-right-space" /> 10 GB Bandwidth</li>
              <li><FontAwesomeIcon icon={faCheckCircle} size="lg" color="green" className="icon-right-space" /> Email Support</li>
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
};

export default CreateWidget;
