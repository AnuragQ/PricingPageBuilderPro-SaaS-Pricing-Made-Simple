import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import { motion } from "framer-motion";
import {
  FaEdit,
  FaShareAlt,
  FaSearch,
  FaLink,
  FaCode,
  FaTrash,
} from "react-icons/fa";
import { auth } from "../config/firebase";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import PricingPopup from "../components/PricingPopup";

const UserAppsPage = () => {
  const [showShareOptions, setShowShareOptions] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [userApps, setUserApps] = useState([]);
  const [deploymentStatus, setDeploymentStatus] = useState(false);
  const [userIsPaid, setUserIsPaid] = useState(false);
  const [showPricingPopup, setShowPricingPopup] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [widgetIdToDelete, setWidgetIdToDelete] = useState(null);

  // Get current user's email
  const userEmail = auth.currentUser.email;

  useEffect(() => {
    // Fetch user's apps from the backend
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/api/widgets/${userEmail}`)
      .then((response) => {
        setUserApps(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user apps:", error);
      });

    // Check if the user is a paid user
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/api/users/paid/${userEmail}`)
      .then((response) => {
        setUserIsPaid(response.data);
        console.log("User is paid:", response.data);
      });
  }, [userEmail]);

  const filteredApps =
    searchTerm.length > 0
      ? userApps.filter((app) =>
          app.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : userApps;

  const handleShareClick = (e, appId) => {
    e.stopPropagation(); // Prevent triggering card's hover effect
    setShowShareOptions(showShareOptions === appId ? null : appId);
  };

  useEffect(() => {
    const closeMenu = (e) => {
      if (e.target.closest(".share-menu")) return; // Ignore clicks on the share menu itself
      setShowShareOptions(null);
    };
    window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, []);

  const copyToClipboard = async (textToCopy, message) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      toast.success(message);
    } catch (err) {
      toast.error("Please try again later.");
      console.error("Failed to copy: ", err);
    }
  };

  const handleEditClick = (appId) => {
    navigate(`/edit-widget?widgetId=${appId}`);
  };

  function extractUrl(text) {
    // Regular expression to match URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    // Find all matches of URLs in the text
    const matches = text.match(urlRegex);

    // Return the first URL found, or null if no URL is found
    if (matches) {
      const url = matches[0];
      // Remove unwanted part
      const cleanUrl = url.replace(/(https?:\/\/)/, "");
      return "https://" + cleanUrl;
    } else {
      return null;
    }
  }

  const handleShareableLink = (appId) => {
    if (!userIsPaid) {
      setShowPricingPopup(true);
      return;
    }

    setDeploymentStatus(true);

    // Add a delay of 2 seconds to simulate deployment
    setTimeout(() => {
      console.log("App ID:asdasd", appId);
      // Get the code for the selected app via api call
      axios
        .post(`${process.env.REACT_APP_BASE_URL}/api/widgets/deploy/${appId}`)
        .then((response) => {
          console.log("Response:", response.data);
          copyToClipboard(
            extractUrl(response.data.deployment_url),
            "URL copied to clipboard!"
          );
          setDeploymentStatus(false);
        })
        .catch((error) => {
          console.error("Error fetching user apps:", error);
          setDeploymentStatus(false);
        });
    }, 2000);
  };

  const handleGetCode = (appId) => {
    if (!userIsPaid) {
      setShowPricingPopup(true);
      return;
    }

    console.log("App ID:", appId);
    // Get the code for the selected app via api call
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/api/widgets/findOne/${appId}`)
      .then((response) => {
        copyToClipboard(response.data.code, "Code copied to clipboard!");
      })
      .catch((error) => {
        console.error("Error fetching user apps:", error);
      });
  };

  const handleDeleteWidget = () => {
    axios
      .delete(
        `${process.env.REACT_APP_BASE_URL}/api/widgets/delete/${widgetIdToDelete}`
      )
      .then((response) => {
        console.log("Widget deleted:", response.data);
        setUserApps(
          userApps.filter((app) => app.widget_id !== widgetIdToDelete)
        );
        toast.success("Widget deleted successfully!");
        setShowDeleteConfirmation(false); // Close the confirmation modal after deletion
      })
      .catch((error) => {
        console.error("Error deleting widget:", error);
        toast.error("Failed to delete widget. Please try again later.");
        setShowDeleteConfirmation(false); // Close the confirmation modal if deletion fails
      });
  };

  const handleDeleteConfirmation = (widgetId) => {
    setShowDeleteConfirmation(true);
    setWidgetIdToDelete(widgetId);
  };

  let navigate = useNavigate();

  return (
    <>
      <PricingPopup
        showModal={showPricingPopup}
        setShowModal={setShowPricingPopup}
      />

      {showDeleteConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
            <p className="text-sm mb-4">
              Are you sure you want to delete this widget?
            </p>
            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 mr-4"
                onClick={() => setShowDeleteConfirmation(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={handleDeleteWidget}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {deploymentStatus && (
        <div class="flex flex-col justify-center items-center h-screen fixed w-screen z-50 bg-[#f0f2f5]">
          <div class="rounded-full h-20 w-20 bg-violet-800 animate-ping"></div>
          <h1 className="mt-20 text-xl font-bold">
            Please wait while we are deploying your Pricing Page...
          </h1>
        </div>
      )}
      <NavBar />
      <div
        className="px-8 py-4 pb-20 min-h-screen flex justify-center"
        style={{ backgroundColor: "#f0f2f5" }}
      >
        <ToastContainer />
        <div className="w-full max-w-4xl">
          <h1 className="text-2xl font-semibold mb-6">My Apps</h1>
          <div className="flex justify-center mb-6">
            <div className="flex items-center bg-white shadow rounded-full w-full max-w-md mb-2">
              <FaSearch className="mx-3 text-gray-500" size={20} />
              <input
                type="text"
                placeholder="Search apps..."
                className="py-2 pr-4 pl-2 w-full bg-transparent rounded-full focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredApps.map((app) => (
              <div
                key={app.widget_id}
                data-testid={app.widget_id}
                className="relative bg-white p-4 rounded-lg shadow hover:shadow-md"
              >
                <motion.div whileHover={{ scale: 1.03 }} className="space-y-2">
                  <img
                    src={app.image_url}
                    alt={app.name}
                    className="w-full h-40 object-cover rounded-md"
                  />
                  <h3 className="font-semibold text-lg">{app.name}</h3>
                  <p className="text-sm">
                    <b>Last Updated:</b>&nbsp;&nbsp;&nbsp;{" "}
                    {new Date(app.updated_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                    })}
                  </p>
                </motion.div>
                <div className="flex justify-end space-x-2 mt-2">
                  <FaTrash
                    className="text-red-500 hover:text-red-700 cursor-pointer mr-1"
                    size={24}
                    onClick={() => handleDeleteConfirmation(app.widget_id)}
                  />
                  <FaEdit
                    className="text-blue-600 hover:text-blue-700 cursor-pointer"
                    size={24}
                    onClick={() => handleEditClick(app.widget_id)}
                  />
                  <FaShareAlt
                    className="text-green-600 hover:text-green-700 cursor-pointer"
                    size={24}
                    onClick={(e) => handleShareClick(e, app.widget_id)}
                  />
                </div>
                {showShareOptions === app.widget_id && (
                  <div className="absolute bg-white p-3 rounded shadow-lg -bottom-20 right-0 z-10 w-48 share-menu">
                    <div className="flex flex-col items-start">
                      <button
                        className="flex items-center gap-2 hover:text-blue-600"
                        onClick={() => {
                          /* Handle shareable link */
                          handleShareableLink(app.widget_id);
                        }}
                      >
                        <FaLink size={16} /> Shareable Link
                      </button>
                      <button
                        className="flex items-center gap-2 hover:text-blue-600 mt-2"
                        onClick={() => {
                          /* Handle get code */
                          handleGetCode(app.widget_id);
                        }}
                      >
                        <FaCode size={16} /> Get Code
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserAppsPage;
