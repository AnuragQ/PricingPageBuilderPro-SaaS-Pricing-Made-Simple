import React, { useState } from "react";
import NavBar from "../components/NavBar"; // Adjust the import path as needed
import PriceComponent from "../components/PriceComponent";
import TitleComponent from "../components/TitleComponent";
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

        <div className="w-full overflow-x-auto p-4">
        <table className="min-w-full table-fixed border-collapse">
          <thead>
            <tr>
              {Object.keys(colors).map((colorKey, index) => (
                <th key={index} className="p-4 text-left font-medium bg-gray-100">
                  {index !== 0 ? `Plan ${index}` : `Features`}
                  <TitleComponent title="Our Pricing Plans"subtitle="Select the best plan that suits your needs."/>
                  
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-4 border-b">Price</td>
              {Object.keys(colors).map((colorKey, index) => (
                <td key={index} className="p-4 border-b" style={{ backgroundColor: colors[colorKey] }}>
                  <PriceComponent
            prefix="from"
            amount="29.99"
            postfix="/mo"
            currency="$"
            discount="$19.99/month"
            className="my-4"
          />

                </td>
              ))}
            </tr>
{/** */}
            {/* Data Storage Row */}
            <tr>
              <td className="p-4 border-b">Data Storage</td>
              {Object.keys(colors).map((colorKey, index) => (
                <td key={index} className="p-4 border-b" style={{ backgroundColor: colors[colorKey] }}>
                  {/* Ternary operator */}
                  <div className="tooltip-container">
                  {index === 0 ? 
                  (
                    <>
                      <FontAwesomeIcon icon={faCheckCircle} color="green" />
                      <span > More Data</span>
                      <span className="tooltip-text"> More Data - 2 GB</span>
                    </>
                  ) 
                   : 
                   (
                    <>
                      <FontAwesomeIcon icon={faTimesCircle} color="red" />
                      <span > Less Data</span>
                      <span className="tooltip-text"> Less Data - 1 GB</span>
                    </>
                  )
                   }
                   </div>
                </td>
              ))}
            </tr>
            {/* Data Speed Row */}
            <tr>
              <td className="p-4 border-b">Data Speed</td>
              {Object.keys(colors).map((colorKey, index) => (
                <td key={index} className="p-4 border-b" style={{ backgroundColor: colors[colorKey] }}>
                  {/* Ternary operator */}
                  <div className="tooltip-container">

                  {index === 0 ? 
                  (
                    <>
                      <FontAwesomeIcon icon={faCheckCircle} color="green" />
                      <span > High Speed</span>
                      <span className="tooltip-text"> High Speed - 10 Mbps</span>
                    </>
                  ) 
                   : 
                   (
                    <>
                      <FontAwesomeIcon icon={faTimesCircle} color="red" />
                      <span > Low Speed</span>
                      <span className="tooltip-text"> Low Speed - 5 Mbps</span>
                    </>
                  )
                   }
                   </div>
                </td>
              ))}
            </tr>
            {/* Email Support Row */}
            <tr>
              <td className="p-4 border-b">Email Support</td>
              {Object.keys(colors).map((colorKey, index) => (
                <td key={index} className="p-4 border-b" style={{ backgroundColor: colors[colorKey] }}>
                  {/* Ternary operator */}
                  {index === 1 ? 
                  (
                    <>
                      <FontAwesomeIcon icon={faCheckCircle} color="green" />
                      <span> 24/7</span>
                    </>
                  ) 
                   : 
                   (
                    <>
                      <FontAwesomeIcon icon={faTimesCircle} color="red" />
                      
                      <span> Business hours</span>
                    </>
                  )
                   }
                  
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4">Action</td>
              {Object.keys(colors).map((colorKey, index) => (
                <td key={index} className="p-4" style={{ backgroundColor: colors[colorKey] }}>
                  <button className="plan-button">Get Started</button>
                </td>
              ))}
            </tr>
{/** */}
<div className="tooltip-container">
  Have addes tool tip for data storage and data speed
  <span className="tooltip-text">Just like in here</span>
</div>



          </tbody>
        </table>
      </div>
        



        {/* below this is outside of main content*/}

    
      </div>
    </>
  );
};

export default CreateWidget;
