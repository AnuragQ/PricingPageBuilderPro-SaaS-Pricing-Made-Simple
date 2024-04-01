import React, { useState, useRef, useEffect } from "react";
import NavBar from "../components/NavBar"; // Adjust the import path as needed
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaTimes } from "react-icons/fa"; // Ensure react-icons is installed
import { useQuery } from "@tanstack/react-query";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const CreateWidget = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const contentRef = useRef(null);

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

  const updateElementText = (uniqueKey, newText) => {
    // Find the element by its unique key
    // Add unique class of parent so it will become ".newClass [data-unique-key="${uniqueKey}"]"
    // It will help trigger correct element 
    const element = document.querySelector(`#widget-wrapper [data-unique-key="${uniqueKey}"]`);
  
    if (!element) return; // Element not found
  
    // Preserve child elements (like <span>) by only updating the text nodes directly
    Array.from(element.childNodes).forEach((node) => {
      // Node type 3 is a text node
      if (node.nodeType === 3) { // Text node
        node.nodeValue = newText;
      }
    });
  };

  document.querySelectorAll("input[data-unique-key]").forEach((input) => {
    input.addEventListener("input", (event) => {
      console.log("Input changed");
      const inputField = event.target;
      const uniqueKey = inputField.getAttribute("data-unique-key");
      console.log("Unique key:", uniqueKey);

      // Find the corresponding element in the content area
      const correspondingElement = document.querySelector(
        `#widget-wrapper [data-unique-key="${uniqueKey}"]`
      );
      console.log("Corresponding element:", correspondingElement);


      if (correspondingElement) {
        // Update the text of the corresponding element
        updateElementText(uniqueKey, inputField.value);
        console.log("Updated corresponding element");
      }
    });
  });

  useEffect(() => {
    if (templateData && contentRef.current) {
      try {
        const parsedTemplateCode = JSON.parse(templateData.template_code);
        const domElement = createDomFromJson(parsedTemplateCode);
        contentRef.current.innerHTML = ""; // Clear existing content
        contentRef.current.appendChild(domElement);
      } catch (error) {
        console.error("Error parsing template code:", error);
      }
    }
  }, [templateData]);

  function createDomFromJson(json) {
    function createElementFromOpeningTag(openingTag) {
      // Remove HTML comments and replace 'classname' with 'class'
      let cleanedOpeningTag = openingTag
        .replace(/\{\/\*.*?\*\/\}/gs, "")
        .replace(/<!--.*?-->/gs, "")
        .replace(/classname=/g, "class=");

      // Add unique key to each element just before >
      cleanedOpeningTag = cleanedOpeningTag.replace(
        /(?<=[^ ])(>)/,
        ` data-unique-key="${json.unique_key}"$1`
      );
      const template = document.createElement("template");
      template.innerHTML = cleanedOpeningTag.trim();
      return template.content.firstChild;
    }

    if (json.value) {
      // Also clean the value in case it contains HTML comments
      const cleanedValue = json.value
        .replace(/\{\/\*.*?\*\/\}/gs, "")
        .replace(/<!--.*?-->/gs, "");
      return document.createTextNode(cleanedValue);
    }

    // Create an element from the potentially cleaned opening tag
    const element = createElementFromOpeningTag(json.opening_tag);

    if (json.children && json.children.length > 0) {
      json.children.forEach((childJson, index) => {
        // Add unique key to each child element
        let childElement = createDomFromJson(childJson);
        element.appendChild(childElement);
      });
    }

    return element;
  }

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

  const handleInputChange = (event) => {
    const uniqueKey = event.target.dataset.uniqueKey;
    const newValue = event.target.value;

    // Update the corresponding field in the reviewFormData
    setReviewFormData((prevData) => ({
      ...prevData,
      [uniqueKey]: {
        ...prevData[uniqueKey],
        value: newValue,
      },
    }));
  };

  useEffect(() => {
    if (reviewFormData) {
      Object.values(reviewFormData).forEach((item) => {
        const inputElement = contentRef.current.querySelector(
          `input[data-unique-key="${item.unique_key}"]`
        );
        if (inputElement) {
          inputElement.value = item.value || ""; // Update the input value
        }
      });
    }
  }, [reviewFormData]);

  const renderMenu = () => {
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    if (!reviewFormData) return <div>No data available.</div>;

    let accordions = [];
    let currentFields = [];
    let currentHeading = "";
    let currentHeadingKey = "";

    Object.values(reviewFormData).forEach((item) => {
      // Check if the item should start a new accordion
      if (item.isHeadingAbove) {
        // If there are accumulated fields, create an accordion for them
        if (currentFields.length > 0) {
          accordions.push(
            <Accordion
              key={currentHeadingKey}
              data-unique_key={currentHeadingKey}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>{currentHeading}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {currentFields.map((field) => (
                  <div key={field.unique_key}>
                    <label>{field.label}</label>
                    {/* Include the unique_key attribute for each input */}
                    <input
                      type="text"
                      defaultValue={field.value || ""}
                      data-unique-key={field.unique_key}
                      onChange={handleInputChange}
                    />
                  </div>
                ))}
              </AccordionDetails>
            </Accordion>
          );
          currentFields = [];
        }
        // Update the current heading and its unique key for the next accordion
        currentHeading = item.headingText;
        currentHeadingKey = item.unique_key;
      } 
      // else {
        // Otherwise, accumulate this item as a field in the current accordion
        currentFields.push(item);
      // }
    });

    // After the loop, if there are remaining fields, create an accordion for them
    if (currentFields.length > 0) {
      accordions.push(
        <Accordion key={currentHeadingKey + "-last"}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{currentHeading}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {currentFields.map((field) => (
              <div key={field.unique_key}>
                <label>{field.label}</label>
                {/* Include the unique_key attribute for each input */}
                <input
                  type="text"
                  defaultValue={field.value || ""}
                  data-unique-key={field.unique_key}
                />
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
            className="flex flex-col items-center bg-white shadow-xl overflow-scroll"
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
        <div
          className="flex-1 flex flex-col items-center  p-4"
          id="widget-wrapper"
        >
          {isLoading ? (
            <div>Loading...</div>
          ) : error ? (
            <div>Error: {error.message}</div>
          ) : (
            <div ref={contentRef}>Content goes here...</div>
          )}
        </div>
      </div>
    </>
  );
};

export default CreateWidget;
