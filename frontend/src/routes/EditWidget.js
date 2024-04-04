import React, { useState, useEffect, useRef } from "react";
import NavBar from "../components/NavBar";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaTimes } from "react-icons/fa";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import currencies from "../resources/currencies";

const EditWidget = () => {
  const [widgetData, setWidgetData] = useState(null);
  const [open, setOpen] = useState(false);
  const [paymentOptions, setPaymentOptions] = useState([]);
  const [currency, setCurrency] = useState("usd");
  const [successUrl, setSuccessUrl] = useState("");
  const [failureUrl, setFailureUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [widgetName, setWidgetName] = useState("New Widget");
  const contentRef = useRef(null);
  const codeRef = useRef(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [currencyList, setCurrencyList] = useState([]);

  const widgetId = new URLSearchParams(window.location.search).get("widgetId");
  const handleOpenModal = async () => {
    setOpen(true);

    // Simulate fetching labels for payment options
    const paymentBtns = document.querySelectorAll("[data-payment-btn]");
    const options = Array.from(paymentBtns).map((btn) => ({
      label: btn.getAttribute("data-payment-btn"),
      value: "",
    }));
    setPaymentOptions(options);

    // Introduce a short delay before fetching details
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Get all details of the payment buttons via get request
    try {
      const promises = Array.from(paymentBtns).map(async (btn, index) => {
        const btnId = btn.getAttribute("data-payment-id");
        console.log(btnId);
        const btnDetails = await axios.get(
          `http://localhost:3000/api/buttons/${btnId}`
        );

        // Update the particular option inside the paymentOptions array
        const updatedOptions = [...paymentOptions];
        updatedOptions[index].value = btnDetails.data.price;
        setPaymentOptions(updatedOptions);
      });

      await Promise.all(promises);
    } catch (error) {
      console.error("Error fetching payment button details:", error);
      // Handle error gracefully
      toast.error("Error fetching payment button details");
      setOpen(false); // Close modal on error
    }
  };

  const pricingData = paymentOptions.map((option) => ({
    label: option.label,
    price: option.value,
    currency: currency,
  }));

  useEffect(() => {
    const fetchWidgetData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/widgets/findOne/${widgetId}`
        );
        setWidgetData(response.data);
        const bodyStartIndex = response.data.code.indexOf("<body>");
        const bodyEndIndex = response.data.code.indexOf("</body>");
        const bodyCode = response.data.code.substring(
          bodyStartIndex + 6,
          bodyEndIndex
        );
        codeRef.current.innerHTML = bodyCode;

        // Pre-fill modal fields with data from database
        setSuccessUrl(response.data.success_url);
        setFailureUrl(response.data.failure_url);
        setImageUrl(response.data.image_url);
        setWidgetName(response.data.name);

        if (response.data.currency) {
          setCurrency(response.data.currency);
        }
        console.log("Widget data fetched:", response.data);
      } catch (error) {
        console.error("Error fetching widget data:", error);
      }
    };

    fetchWidgetData();
  }, [widgetId]);

  useEffect(() => {
    // Fetch currency list
    const fetchCurrencyList = async () => {
      try {
        const response = await axios.get(
          "https://api.exchangerate-api.com/v4/latest/USD"
        );
        setCurrencyList(response.data.rates);
      } catch (error) {
        console.error("Error fetching currency list:", error);
      }
    };

    fetchCurrencyList();
  }, []);

  const handleCloseModal = () => setOpen(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission
  };
  const handlePriceChange = (index, newValue) => {
    try {
      // Deep copy of paymentOptions array
      const updatedOptions = JSON.parse(JSON.stringify(paymentOptions));
      if (updatedOptions[index]) {
        updatedOptions[index].value = newValue;
      }
      setPaymentOptions(updatedOptions);
    } catch (error) {}
  };

  const handleCurrencyChange = (event) => {
    setCurrency(event.target.value);
  };

  if (!widgetData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <NavBar />
      <ToastContainer />
      <div className="flex h-fit bg-[#F4F7F6]">
        <AnimatePresence>
          <motion.aside
            className={`flex flex-col items-center bg-white shadow-xl overflow-scroll ${
              isCollapsed ? "w-20" : "w-64"
            }`}
            initial={false}
            animate={{ width: isCollapsed ? "20px" : "250px" }}
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
                {/* Render menu items here */}
                {/* Example: */}
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Editable Content</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>Heading</Typography>
                  </AccordionDetails>
                </Accordion>

                <div className="mt-8 flex justify-center items-center">
                  <button
                    type="button"
                    onClick={handleOpenModal}
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-base px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Update Widget
                  </button>
                </div>
              </motion.div>
            )}
          </motion.aside>
        </AnimatePresence>
        <div
          className="flex-1 flex flex-col items-center p-4"
          id="widget-wrapper"
        >
          <div ref={contentRef}>{/* Render widget content here */}</div>
        </div>
        <div className="flex-1 p-4">
          {/* Render code display here */}
          <pre ref={codeRef}></pre>
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
                {/* Render form fields here */}
                {/* Example: */}
                <div className="mb-4 px-4">
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
                <div className="mb-4 px-4">
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
                {/* Add more fields as needed */}

                <div className="mb-4 px-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Currency
                  </label>
                  <Select
                    labelId="currency-select-label"
                    id="currency-select"
                    value={currency.toUpperCase()}
                    label="Currency"
                    onChange={handleCurrencyChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[90%]"
                  >
                    {Object.keys(currencies).map((currencyCode) => (
                      <MenuItem key={currencyCode} value={currencyCode}>
                        {currencies[currencyCode].name} (
                        {currencies[currencyCode].symbol})
                      </MenuItem>
                    ))}
                  </Select>
                </div>

                <div className="mb-4 px-4">
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

                <div className="flex justify-between px-4">
                  <button
                    onClick={handleCloseModal}
                    className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-20 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-20 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
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

export default EditWidget;
