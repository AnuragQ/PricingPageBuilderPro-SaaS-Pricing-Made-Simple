import React, { useState } from "react";
import NavBar from "../components/NavBar"; // Adjust the import path as needed
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaTimes } from "react-icons/fa"; // Ensure react-icons is installed
import { useQuery } from "@tanstack/react-query";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const CreateWidget = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [colors, setColors] = useState({
    color1: "lightgrey", // Example initial color
    color2: "lightblue", // Example initial color
    color3: "lightgreen", // Add more colors as needed
  });

  const [reviewFormData, setReviewFormData] = useState(null);

  const {
    data: templateData,
    error,
    isLoading,
  } = useQuery({
    queryKey: "templateData",
    queryFn: async () => {
      try {
        const templateId = new URLSearchParams(window.location.search).get(
          "templateId"
        );
        const response = await fetch(
          `${process.env.REACT_APP_BASE_URL}/api/templates/${templateId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch template data");
        }
        const data = await response.json();

        // Set the review form data
        setReviewFormData(JSON.parse(data.review_form_data));
        return data;
      } catch (error) {
        console.error("Error fetching template data:", error);
        throw new Error("Failed to fetch template data");
      }
    },
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


  const renderMenu = () => {
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    if (!reviewFormData) return <div>No data available.</div>;

    let accordions = []; // To hold the accordions to be rendered
    let currentFields = []; // To hold fields for the current accordion
    let currentHeading = ""; // To hold the heading text for the current accordion

    Object.values(reviewFormData).forEach((item, index) => {
      // Check if the item should start a new accordion
      if (item.isHeadingAbove) {
        // If there are accumulated fields, create an accordion for them
        if (currentFields.length > 0) {
          accordions.push(
            <Accordion key={`accordion-${index}`}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>{currentHeading}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {currentFields.map((field, fieldIdx) => (
                  <div key={`field-${fieldIdx}`}>
                    {/* Assuming each field has a label and a value */}
                    <label>{field.label}</label>
                    <input type="text" defaultValue={field.value || ""} />
                  </div>
                ))}
              </AccordionDetails>
            </Accordion>
          );
          currentFields = []; // Reset fields for the next accordion
        }
        currentHeading = item.headingText; // Set the new heading text
        // Include the current item as the first field in the new accordion
        currentFields.push(item);
      } else {
        // Otherwise, accumulate this item as a field in the current accordion
        currentFields.push(item);
      }
    });

    // After the loop, if there are remaining fields, create an accordion for them
    if (currentFields.length > 0) {
      accordions.push(
        <Accordion key={`accordion-last`}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{currentHeading}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {currentFields.map((field, fieldIdx) => (
              <div key={`field-last-${fieldIdx}`}>
                <label>{field.label}</label>
                <input type="text" defaultValue={field.value || ""} />
              </div>
            ))}
          </AccordionDetails>
        </Accordion>
      );
    }

    return <div>{accordions}</div>;
  };

  

  return (
    <>
      <NavBar />
      <div className="flex h-screen bg-[#F4F7F6]">
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
                {renderMenu()}
              </motion.div>
            )}
          </motion.aside>
        </AnimatePresence>
        <div className="flex-1 flex flex-col items-center  p-4">
          {isLoading ? (
            <div>Loading...</div>
          ) : error ? (
            <div>Error: {error.message}</div>
          ) : (
            <div>Content goes here...</div>
          )}
        </div>
      </div>
    </>
  );
};

export default CreateWidget;
