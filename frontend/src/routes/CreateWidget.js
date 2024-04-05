import React, { useState, useRef, useEffect } from "react";
import NavBar from "../components/NavBar";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaTimes, FaPlus } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import currencies from "../resources/currencies";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { auth } from "../config/firebase";
import ReactDOMServer from "react-dom/server";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { update } from "../../../backend/src/controllers/template.controller";

const CreateWidget = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const contentRef = useRef(null);

  const [reviewFormData, setReviewFormData] = useState(null);

  const [open, setOpen] = useState(false);
  const [paymentOptions, setPaymentOptions] = useState([]);
  const [currency, setCurrency] = useState("usd");
  const [successUrl, setSuccessUrl] = useState("");
  const [failureUrl, setFailureUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [widgetName, setWidgetName] = useState("New Widget");
  const [menuBar, setMenuBar] = useState("");

  const handleCurrencyChange = (event) => {
    setCurrency(event.target.value);
  };

  const handleOpenModal = () => {
    setOpen(true);
    // Simulate fetching labels for payment options
    const paymentBtns = document.querySelectorAll("[data-payment-btn]");
    const options = Array.from(paymentBtns).map((btn) => ({
      label: btn.getAttribute("data-payment-btn"),
      value: "",
    }));
    setPaymentOptions(options);
  };

  const handleCloseModal = () => setOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Get email of the user from Firebase Auth
    const user = auth.currentUser;
    if (!user) {
      console.error("No user logged in");
      return;
    }

    const pricingData = paymentOptions.map((option) => ({
      label: option.label,
      price: option.value,
      currency: currency,
    }));

    try {
      // Sending pricing data to your server
      const buttonIdsResponse = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/buttons`,
        {
          buttons: pricingData,
        }
      );

      let buttonsData = buttonIdsResponse.data;
      buttonsData = buttonsData.button_ids;
      // console.log(buttonsData["Basic Plan"]);
      // return;
      // console.log("Button IDs:", buttonsData.button_ids);

      // Processing buttonsData to attach new IDs to buttons
      document.querySelectorAll("[data-payment-btn]").forEach((btn, index) => {
        // Get the button's label
        const buttonLabel = btn.getAttribute("data-payment-btn");
        btn.setAttribute("data-payment-id", buttonsData[buttonLabel]);
      });

      // Constructing updatedTemplateCode with the necessary HTML structure
      let updatedTemplateCode = contentRef.current.innerHTML;
      updatedTemplateCode = updatedTemplateCode.replace(
        /className=/g,
        "class="
      );

      // HTML boilerplate with your updatedTemplateCode included
      updatedTemplateCode = `
      <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <script src="https://cdn.tailwindcss.com"></script>
          </head>
          <body>
            ${updatedTemplateCode}
            <script>
              const paymentBtns = document.querySelectorAll('[data-payment-btn]')
              paymentBtns.forEach((btn) => {
                btn.addEventListener('click', async (e) => {
                  e.preventDefault()
                  const paymentId = btn.getAttribute('data-payment-id')
                  createCheckoutSession(paymentId)
                    .then((data) => {
                      console.log(data.url)
                      window.location.href = data.url; 
                    })
                    .catch((error) => {
                      console.error(error) 
                    })
                })
              })

              async function createCheckoutSession(paymentId) {
                try {
                  const response = await fetch(
                    '${process.env.REACT_APP_BACKEND_EXPOSED_URL}',
                    {
                      method: 'POST', 
                      headers: {
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify({ items: [{ id: paymentId }] }) 
                    }
                  )

                  if (!response.ok) {
                    console.log('Failed to create checkout session:', response);
                  }

                  const data = await response.json() 
                  return data 
                } catch (error) {
                  console.error('Failed to create checkout session:', error)
                }
              }
            </script>
          </body>
        </html>

    `;

      // Saving the widget with updated template code
      const widgetDataResponse = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/widgets`,
        {
          name: widgetName,
          created_by: user.email,
          code: updatedTemplateCode,
          image_url: imageUrl,
          success_url: successUrl,
          failure_url: failureUrl,
          payment_button_ids: buttonsData,
          currency: currency,
          // Include any other data necessary for your widget
        }
      );

      toast.success("Widget Created Successfully!");

      // Wait for 2 seconds and redirect to /my-apps
      setTimeout(() => {
        window.location.href = `/my-apps`;
      }, 2000);

      console.log("Widget created with ID:", widgetDataResponse.data);
    } catch (error) {
      toast.error("Error creating widget. Please try again later.");
      console.error("Error during form submission:", error);
    }

    handleCloseModal();
  };

  const handlePriceChange = (index, newValue) => {
    const updatedOptions = [...paymentOptions];
    updatedOptions[index].value = newValue;
    setPaymentOptions(updatedOptions);
  };

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
    const element = document.querySelector(
      `#widget-wrapper [data-unique-key="${uniqueKey}"]`
    );

    if (!element) return; // Element not found

    // Preserve child elements (like <span>) by only updating the text nodes directly
    Array.from(element.childNodes).forEach((node) => {
      // Node type 3 is a text node
      if (node.nodeType === 3) {
        // Text node
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
        setImageUrl(templateData.template_image);
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

  // UseEffect to set manuBar when renderMenu is called
  useEffect(() => {
    setMenuBar(renderMenu());
  }, [renderMenu]);

  const handleCreateWidget = () => {
    console.log("Create widget clicked");
    handleOpenModal();
  };

  return (
    <>
      <NavBar />
      <ToastContainer />
      <div className="flex h-fit bg-[#F4F7F6]">
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

                <div class="mt-8 flex justify-center items-center">
                  <button
                    type="button"
                    onClick={handleCreateWidget}
                    class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-base px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5 me-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Create Widget
                  </button>
                </div>
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

      {open && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
          id="my-modal"
          onClick={handleCloseModal}
        >
          <div
            className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Confirm Pricing
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Please choose these prices carefully as these will be the
                  final prices.
                </p>
              </div>
              <form onSubmit={handleSubmit} className="w-full mt-4">
                {paymentOptions.map((option, index) => (
                  <div key={index} className="mb-4 px-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      {option.label}
                    </label>
                    <input
                      type="number"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={option.value}
                      onChange={(e) => handlePriceChange(index, e.target.value)}
                    />
                  </div>
                ))}

                <div className="mb-4 mt-12 px-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Success URL
                  </label>
                  <input
                    type="text"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={successUrl}
                    name="success_url"
                    onChange={(e) => setSuccessUrl(e.target.value)}
                  />
                </div>

                <div className="mb-12 px-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Failure URL
                  </label>
                  <input
                    type="text"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={failureUrl}
                    name="failure_url"
                    onChange={(e) => setFailureUrl(e.target.value)}
                  />
                </div>

                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Currency
                </label>
                <Select
                  labelId="currency-select-label"
                  id="currency-select"
                  value={currency}
                  label="Currency"
                  onChange={handleCurrencyChange}
                  // fullWidth
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[90%]" // Tailwind CSS classes
                >
                  {Object.keys(currencies).map((key) => (
                    <MenuItem key={key} value={key.toLowerCase()}>
                      {currencies[key].name} ({currencies[key].symbol})
                    </MenuItem>
                  ))}
                </Select>

                <div className="mb-4 mt-12 px-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Widget Name
                  </label>
                  <input
                    type="text"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={widgetName}
                    name="widget_name"
                    onChange={(e) => setWidgetName(e.target.value)}
                  />
                </div>

                <div className="items-center px-4 py-3 mt-12">
                  <button
                    onClick={handleCloseModal}
                    className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="mt-3 px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateWidget;
