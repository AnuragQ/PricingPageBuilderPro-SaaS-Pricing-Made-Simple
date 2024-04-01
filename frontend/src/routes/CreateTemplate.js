import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/NavBar";
import * as cheerio from "cheerio";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { is } from "cheerio";

const CustomTextField = ({
  defaultValue,
  handleContextMenu,
  uniqueId,
  ...props
}) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.setAttribute("data-unique-id", uniqueId);
    }
  }, [uniqueId]);

  return (
    <TextField
      defaultValue={defaultValue}
      variant="outlined"
      fullWidth
      margin="normal"
      InputProps={{
        inputRef: inputRef,
        onContextMenu: handleContextMenu,
      }}
      {...props}
    />
  );
};

const convertCodeToJSON = (html) => {
  let uniqueIdCounter = 1000;

  const $ = cheerio.load(html);

  function convertElementToJSON(element) {
    const getFullOpeningTag = (elem) => {
      const attributes = Object.keys(elem.attribs)
        .map((key) => `${key}="${elem.attribs[key]}"`)
        .join(" ");
      return `<${elem.tagName}${attributes.length ? " " + attributes : ""}>`;
    };

    const processElement = (elem) => {
      if (elem.type === "text" && $(elem).text().trim()) {
        return {
          value: $(elem).text().trim(),
          unique_key: (++uniqueIdCounter).toString(),
        };
      } else if (elem.type === "tag") {
        const obj = {
          opening_tag: getFullOpeningTag(elem),
          closing_tag: `</${elem.tagName}>`,
          unique_key: (++uniqueIdCounter).toString(),
        };
        const childNodes = $(elem).contents().toArray();
        const children = childNodes
          .map((childElem) => processElement(childElem))
          .filter((child) => child !== null);
        if (children.length > 0) {
          obj.children = children;
        }
        return obj;
      }
      return null;
    };

    return processElement(element);
  }

  const rootElement = $("body")
    .children()
    .toArray()
    .find((el) => el.type === "tag");

  if (rootElement) {
    return JSON.stringify(convertElementToJSON(rootElement), null, 2);
  } else {
    console.log("No root element found.");
    return "{}";
  }
};

const ContextMenu = ({
  mouseX,
  mouseY,
  handleCloseMenu,
  handleRemoveElement,
  handleAddHeadingAbove,
  // handleAddHeadingBelow,
}) => {
  return (
    <Menu
      keepMounted
      open={mouseY !== null}
      onClose={handleCloseMenu}
      anchorReference="anchorPosition"
      anchorPosition={
        mouseY !== null && mouseX !== null
          ? { top: mouseY, left: mouseX }
          : undefined
      }
    >
      <MenuItem onClick={handleAddHeadingAbove}>Add heading above</MenuItem>
      {/* <MenuItem onClick={handleAddHeadingBelow}>Add heading below</MenuItem> */}
      <MenuItem onClick={handleRemoveElement}>Remove current element</MenuItem>
    </Menu>
  );
};

var reviewFormObj = {};

const RecursiveTextFields = ({
  data,
  handleContextMenu,
  handleRemove,
  handleAddHeadingAbove,
  // handleAddHeadingBelow,
}) => {
  const renderChildren = (children, parent) => {
    return children.map((child, index) => {
      const elementKey = `${parent ? parent + "-" : ""}${index}`;
      const uniqueId = child["unique_key"];
      if (child.value) {
        // Add unique_key and value to reviewFormObj
        let obj = {
          unique_key: uniqueId,
          value: child.value,
        };

        reviewFormObj[uniqueId] = obj;

        return (
          <CustomTextField
            key={elementKey}
            defaultValue={child.value}
            handleContextMenu={(e) => handleContextMenu(e, child)}
            uniqueId={uniqueId}
          />
        );
      } else if (child.children) {
        return renderChildren(child.children, uniqueId);
      }
      return null;
    });
  };

  console.log(reviewFormObj);
  return <div>{renderChildren(data.children, "", handleContextMenu)}</div>;
};

const TemplateForm = () => {
  const [formData, setFormData] = useState({
    plan_title: "",
    plan_description: "",
    template_image: "",
    templateCode: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [jsonPreview, setJsonPreview] = useState("");
  const [contextMenu, setContextMenu] = useState(null);
  const [selectedElement, setSelectedElement] = useState(null);
  const [jsonTree, setJsonTree] = useState(null);
  const [reviewFormData, setReviewFormData] = useState(reviewFormObj);

  const handleContextMenu = (event, element) => {
    event.preventDefault();
    event.stopPropagation();
    setSelectedElement(element);
    setContextMenu({
      mouseX: event.clientX,
      mouseY: event.clientY,
    });
  };

  const handleCloseMenu = () => {
    setContextMenu(null);
    setSelectedElement(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleReview = (e) => {
    e.preventDefault();
    const json = convertCodeToJSON(formData.templateCode);
    setJsonPreview(json);
    setModalOpen(true);
    setJsonTree(JSON.parse(json));
  };

  const handleClose = () => setModalOpen(false);

  const generateRandomKey = (length = 8) => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  };

  const removeElement = (json, uniqueId, reviewFormData) => {
    const updatedJsonTree = { ...json };

    // Filter out the element to remove
    const updatedChildren = updatedJsonTree.children.filter(
      (child) => child.unique_key !== uniqueId
    );

    // Update the json tree with the filtered children
    updatedJsonTree.children = updatedChildren;

    // Remove corresponding entry from reviewFormData
    if (reviewFormData[uniqueId]) {
      delete reviewFormData[uniqueId];
    }

    return updatedJsonTree;
  };

  const addHeadingAbove = (uniqueId) => {
    const newHeadingKey = generateRandomKey();
    const headingText = window.prompt(
      "Please enter a heading:",
      "Default Heading"
    );

    console.log("Before adding heading above");
    console.log(reviewFormData);

    // Update the existing element with uniqueId to indicate that a heading is added above
    const updatedReviewFormData = { ...reviewFormData };
    if (updatedReviewFormData[uniqueId]) {
      updatedReviewFormData[uniqueId].isHeadingAbove = true;
      updatedReviewFormData[uniqueId].headingText = headingText;
    }

    // Add the new heading
    // updatedReviewFormData[newHeadingKey] = newHeading;

    setReviewFormData(updatedReviewFormData);

    if (headingText) {
      // Assume each CustomTextField renders an element with a data attribute `data-unique-id`
      const targetElement = document.querySelector(
        `[data-unique-id="${selectedElement.unique_key}"]`
      );
      if (targetElement) {
        const headingElement = document.createElement("h1");
        headingElement.textContent = headingText;

        // Add class to the heading element
        headingElement.classList.add("text-xl", "font-bold", "mb-2", "mt-8");

        // Inserting directly before the parent of target element in the DOM
        targetElement.parentNode.parentNode.parentNode.insertBefore(
          headingElement,
          targetElement.parentNode.parentNode
        );
      }
    }
    console.log("Data below");
    console.log(JSON.stringify(updatedReviewFormData, null, 2));
  };

  // const addHeadingBelow = (json, uniqueId, reviewFormData) => {
  //   const newHeadingKey = generateRandomKey();
  //   const newHeading = { value: "New Heading", unique_key: newHeadingKey };

  //   // Add entry to reviewFormData
  //   reviewFormData[newHeadingKey] = newHeading;

  //   // Find the index of the element with the uniqueId
  //   const index = json.children.findIndex(
  //     (child) => child.unique_key === uniqueId
  //   );

  //   // Insert the new heading after the element with uniqueId
  //   json.children.splice(index + 1, 0, newHeading);

  //   return json;
  // };

  const handleRemoveElement = () => {
    const updatedJsonTree = removeElement(jsonTree, selectedElement.unique_key);
    // setJsonTree(updatedJsonTree);
    console.log(JSON.stringify(updatedJsonTree, null, 2));
    // setJsonPreview(JSON.stringify(updatedJsonTree, null, 2));
    handleCloseMenu();
  };

  const handleAddHeadingAbove = () => {
    addHeadingAbove(selectedElement.unique_key);
    handleCloseMenu();
  };

  // const handleAddHeadingBelow = () => {
  //   const updatedJsonTree = addHeadingBelow(
  //     jsonTree,
  //     selectedElement.unique_key
  //   );
  //   setJsonTree(updatedJsonTree);
  //   console.log(JSON.stringify(updatedJsonTree, null, 2));
  //   setJsonPreview(JSON.stringify(updatedJsonTree, null, 2));
  //   handleCloseMenu();
  // };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setModalOpen(false);

    const postData = {
      ...formData,
      template_code: JSON.stringify(jsonTree),
      review_form_data: JSON.stringify(reviewFormData),
    };

    try {
      const response = await fetch("http://localhost:3000/api/templates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log(data);
      alert("Template submitted successfully!");
    } catch (error) {
      console.error("Error:", error);
      alert("Error submitting template");
    } finally {
      setIsSubmitting(false);
    }
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    maxHeight: "90vh",
    overflow: "auto",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  React.useEffect(() => {
    const handleWindowClick = () => handleCloseMenu();

    window.addEventListener("click", handleWindowClick);

    return () => window.removeEventListener("click", handleWindowClick);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <motion.div
        className="max-w-xl mx-auto mt-16 mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.5 } }}
      >
        <h1 className="text-4xl font-bold mb-6">Submit Your Template</h1>
        <form onSubmit={handleReview}>
          <div className="mb-4">
            <label
              htmlFor="plan_title"
              className="block text-sm font-medium text-gray-700"
            >
              Template Title
            </label>
            <input
              type="text"
              name="plan_title"
              value={formData.plan_title}
              onChange={handleChange}
              required
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="plan_description"
              className="block text-sm font-medium text-gray-700"
            >
              Template Description
            </label>
            <textarea
              name="plan_description"
              value={formData.plan_description}
              onChange={handleChange}
              required
              className="mt-1 p-2 w-full border rounded-md"
            ></textarea>
          </div>
          <div className="mb-4">
            <label
              htmlFor="template_image"
              className="block text-sm font-medium text-gray-700"
            >
              Template Image URL
            </label>
            <input
              type="text"
              name="template_image"
              value={formData.template_image}
              onChange={handleChange}
              required
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="templateCode"
              className="block text-sm font-medium text-gray-700"
            >
              Template Code
            </label>
            <textarea
              id="templateCode"
              name="templateCode"
              value={formData.templateCode}
              onChange={handleChange}
              required
              className="mt-1 p-2 w-full border rounded-md"
              rows="4"
            ></textarea>
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            disabled={isSubmitting}
          >
            Review Template
          </button>
        </form>
      </motion.div>
      <Modal
        open={modalOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Review Your Template
          </Typography>
          {jsonPreview && (
            <RecursiveTextFields
              data={JSON.parse(jsonPreview)}
              handleContextMenu={handleContextMenu}
              handleRemove={handleRemoveElement}
              handleAddHeadingAbove={handleAddHeadingAbove}
              // handleAddHeadingBelow={handleAddHeadingBelow}
            />
          )}
          <Button
            onClick={handleSubmit}
            className="mt-4"
            disabled={isSubmitting}
            variant="contained"
          >
            Submit Template
          </Button>
        </Box>
      </Modal>
      {contextMenu && (
        <ContextMenu
          mouseX={contextMenu.mouseX}
          mouseY={contextMenu.mouseY}
          handleCloseMenu={handleCloseMenu}
          handleRemoveElement={handleRemoveElement}
          handleAddHeadingAbove={handleAddHeadingAbove}
          // handleAddHeadingBelow={handleAddHeadingBelow}
        />
      )}
    </div>
  );
};

export default TemplateForm;
