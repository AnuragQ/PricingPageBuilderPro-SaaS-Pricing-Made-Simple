import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import { motion } from "framer-motion";
import { FaEdit, FaShareAlt, FaSearch, FaLink, FaCode } from "react-icons/fa";
import { auth } from "../config/firebase";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const UserAppsPage = () => {
  const [showShareOptions, setShowShareOptions] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [userApps, setUserApps] = useState([]);
  const [deploymentStatus, setDeploymentStatus] = useState(false);

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
    setDeploymentStatus(true);

    // Add a delay of 2 seconds to simulate deployment
    // setTimeout(() => {
    console.log("App ID:", appId);
    // Get the code for the selected app via api call
    axios
      .post(`${process.env.REACT_APP_BASE_URL}/api/widgets/deploy/${appId}`)
      .then((response) => {
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
    // }, 10000);
  };

  const handleGetCode = (appId) => {
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

  let navigate = useNavigate();

  return (
    <>
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
