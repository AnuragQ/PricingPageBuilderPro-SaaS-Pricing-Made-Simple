import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/NavBar";
import * as cheerio from "cheerio";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const CustomTextField = ({
  defaultValue,
  handleContextMenu,
  uniqueId,
  ...props
}) => {
  const inputRef = useRef(null);

  useEffect(() => {
    // Directly apply data-unique-id attribute to the input DOM element
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
        inputRef: inputRef, // Use inputRef to reference the input element
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
        return { value: $(elem).text().trim(), unique_key: (++uniqueIdCounter).toString()};
      } else if (elem.type === "tag") {
        const obj = {
          opening_tag: getFullOpeningTag(elem),
          closing_tag: `</${elem.tagName}>`,
          unique_key: (++uniqueIdCounter).toString(),
          test_key: "test",
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
  handleEdit,
  handleRemove,
  handleRemoveWithChildren,
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
      <MenuItem onClick={handleEdit}>Edit Element</MenuItem>
      <MenuItem onClick={handleRemove}>Remove Current Element</MenuItem>
      <MenuItem onClick={handleRemoveWithChildren}>
        Remove Element and Children
      </MenuItem>
    </Menu>
  );
};

const getTitleFromTag = (tag) => {
  const matches = tag.match(/<(\w+)/);
  return matches ? matches[1].toUpperCase() : "Section";
};

const RecursiveAccordion = ({ data, handleContextMenu }) => {
  const renderChildren = (children, parent) => {
    return children.map((child, index) => {
      const elementKey = `${parent ? parent + "-" : ""}${index}`;
      const uniqueId = child["unique_key"];
      console.log("Unique ID:", uniqueId);
      if (child.value) {
        return (
            <CustomTextField
              key={elementKey}
              defaultValue={child.value}
              handleContextMenu={(e) => handleContextMenu(e, child)}
              uniqueId={uniqueId}
            />
          );
      } else if (child.children) {
        const title = getTitleFromTag(child.opening_tag);
        return (
          <Accordion
            key={elementKey}
            onContextMenu={(e) => handleContextMenu(e, child)}
          >
            <div data-unique-id={uniqueId}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>{title}</Typography>
              </AccordionSummary>
            </div>
            <AccordionDetails id={`accordion-details-${uniqueId}`}>
              {renderChildren(child.children, uniqueId)}
            </AccordionDetails>
          </Accordion>
        );
      }
      return null;
    });
  };

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

  const handleContextMenu = (event, element) => {
    event.preventDefault();
    event.stopPropagation();
    console.log("Right-clicked element:", element);
    console.log("Right-clicked DOM element:", event.target);
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
    // Missing conversion step here. Should be using convertCodeToJSON to process formData.templateCode
    const json = convertCodeToJSON(formData.templateCode); // Correct way to convert and use the JSON
    setJsonPreview(json);
    setModalOpen(true);
  };

  const handleClose = () => setModalOpen(false);

  //   const handleCloseMenu = () => {
  //     setContextMenu(null);
  //   };

  const handleEditElement = () => {
    console.log("Edit:", selectedElement);
    // Logic to edit the selected element
    // Log the unique ID of the selected element
    handleCloseMenu();
  };

  const handleRemoveElement = () => {
    console.log("Remove:", selectedElement);
    // Logic to remove the selected element
    handleCloseMenu();
  };

  const handleRemoveElementAndChildren = () => {
    console.log("Remove with children:", selectedElement);
    // Logic to remove the selected element and its children
    handleCloseMenu();
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setModalOpen(false);

    const postData = {
      ...formData,
      template_code: jsonPreview,
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

    // Remove the event listener on cleanup
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
              // placeholder="Enter your template code here..."
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
          {jsonPreview && console.log(jsonPreview)}
          {jsonPreview && (
            <RecursiveAccordion
              data={jsonPreview ? JSON.parse(jsonPreview) : {}}
              handleContextMenu={handleContextMenu}
            />
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            style={{ marginTop: 20 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Template"}
          </Button>
        </Box>
      </Modal>
      {contextMenu && (
        <ContextMenu
          mouseX={contextMenu.mouseX}
          mouseY={contextMenu.mouseY}
          handleCloseMenu={handleCloseMenu}
          handleEdit={handleEditElement}
          handleRemove={handleRemoveElement}
          handleRemoveWithChildren={handleRemoveElementAndChildren}
        />
      )}
    </div>
  );
};

export default TemplateForm;
