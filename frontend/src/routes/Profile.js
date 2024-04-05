import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/NavBar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth } from "../config/firebase";
import axios from "axios";
import Modal from "../components/Modal";
import Cookies from "js-cookie";

const Profile = () => {
  const [stripeApiKey, setStripeApiKey] = useState("");
  const [stripeWebhookKey, setStripeWebhookKey] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingWebhook, setIsEditingWebhook] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [backendUrl, setBackendUrl] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [hideSections, setHideSections] = useState(false);
  const [userIsPaid, setUserIsPaid] = useState(false);

  useEffect(() => {
    const userEmail = auth.currentUser.email;
    setCurrentUser(userEmail);

    if (currentUser === null) return;

    axios
      .get(`${process.env.REACT_APP_BASE_URL}/api/users/${currentUser}`)
      .then((response) => {
        setStripeApiKey(response.data.stripe_key);
        setStripeWebhookKey(response.data.stripe_webhook);
      });

    const url = process.env.REACT_APP_BACKEND_EXPOSED_URL;
    setBackendUrl(url);

    const userPreference = Cookies.get("hideMenuBar");
    if (!userPreference) {
      setTimeout(() => {
        setShowModal(true);
      }, 5000); // Show modal after 5 seconds
    } else {
      setHideSections(true); // Hide sections if user has accepted to hide them
    }
  }, [currentUser]);

  const handleStripeApiKeyChange = (e) => {
    setStripeApiKey(e.target.value);
  };

  const handleStripeWebhookKeyChange = (e) => {
    setStripeWebhookKey(e.target.value);
  };

  const saveStripeApiKey = () => {
    setIsEditing(false);
    axios
      .put(
        `${process.env.REACT_APP_BASE_URL}/api/users/stripe/${currentUser}`,
        {
          stripe_key: stripeApiKey,
        }
      )
      .then((response) => {
        toast.success("Stripe API Key saved successfully!");
      });
  };

  const saveStripeWebhookKey = () => {
    setIsEditingWebhook(false);
    axios
      .put(
        `${process.env.REACT_APP_BASE_URL}/api/users/stripe-webhook/${currentUser}`,
        {
          stripe_webhook: stripeWebhookKey,
        }
      )
      .then((response) => {
        toast.success("Stripe Webhook Key saved successfully!");
      });
  };

  const handleBtnClick = (e) => {
    e.preventDefault();
    if (isEditing) {
      saveStripeApiKey();
    } else {
      setIsEditing(true);
    }
  };

  const handleWebhookBtnClick = (e) => {
    e.preventDefault();
    if (isEditingWebhook) {
      saveStripeWebhookKey();
    } else {
      setIsEditingWebhook(true);
    }
  };

  const handleCopyURL = () => {
    navigator.clipboard.writeText(backendUrl);
    toast.info("URL copied to clipboard!");
  };

  const handleAccept = () => {
    Cookies.set("hideMenuBar", true, { expires: 7 }); // Set cookie to expire after 7 days
    setHideSections(true); // Hide sections after user accepts
  };

  const handleRevealSections = () => {
    setHideSections(false); // Reveal hidden sections
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <motion.div
        className="max-w-4xl mx-auto pt-16 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.5 } }}
      >
        <ToastContainer />
        <Modal
          showModal={showModal}
          setShowModal={setShowModal}
          handleAccept={handleAccept}
        />
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Basic Details</h2>
          <div className="bg-white shadow rounded-lg p-6">
            <div>
              <strong>Email: &nbsp;</strong> {currentUser}
            </div>
            <div className="mt-4 flex items-center">
              <strong>Stripe API Key:</strong>
              {isEditing ? (
                <input
                  type="text"
                  value={stripeApiKey}
                  onChange={handleStripeApiKeyChange}
                  className="ml-2 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow"
                />
              ) : (
                <span className="ml-2">
                  {stripeApiKey.substring(0, 35).replace(/.(?=.{4})/g, "*")}
                </span>
              )}
              <button
                onClick={(e) => handleBtnClick(e)}
                className="ml-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
              >
                {isEditing ? "Save" : "Edit"}
              </button>
            </div>

            <div className="mt-4 flex items-center">
              <strong>Stripe Webhook Signing Key:</strong>
              {isEditingWebhook ? (
                <input
                  type="text"
                  value={stripeWebhookKey}
                  onChange={handleStripeWebhookKeyChange}
                  className="ml-2 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow"
                />
              ) : (
                <span className="ml-2">
                  {stripeWebhookKey.substring(0, 35).replace(/.(?=.{4})/g, "*")}
                </span>
              )}
              <button
                onClick={(e) => handleWebhookBtnClick(e)}
                className="ml-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
              >
                {isEditingWebhook ? "Save" : "Edit"}
              </button>
            </div>
          </div>
        </div>

        {!hideSections && (
          <>
            <div className="mb-10">
              <h2 className="text-2xl font-bold mb-4">
                Setup Payment Tracking
              </h2>
              <p className="mb-4">
                To enable us to track your payments and display them on the
                dashboard, please set the following URL as your payment endpoint
                in your project's environment variables. Also, don't forget to
                fill in your Webhook Signing Key on the Profile Details section
                above.
              </p>
              <div className="flex items-center">
                <code className="text-sm sm:text-base inline-flex text-left items-center space-x-4 bg-gray-800 text-white rounded-lg p-4 pl-6 cursor-pointer">
                  <span className="flex gap-4">
                    <span className="shrink-0 text-gray-500">$</span>
                    <span className="flex-1">
                      <span className="text-yellow-500">{backendUrl}</span>
                    </span>
                  </span>
                  <svg
                    onClick={handleCopyURL}
                    className="shrink-0 h-5 w-5 transition text-gray-500 group-hover:text-white cursor-pointer"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z"></path>
                    <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z"></path>
                  </svg>
                </code>
              </div>
            </div>

            <div className="mb-10">
              <h2 className="text-2xl font-bold mb-4">Tutorial Video</h2>
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  title="Setup Payment Tracking Tutorial"
                  width="560"
                  height="315"
                  src="https://www.youtube.com/embed/wM8wW59Nas0"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </>
        )}

        {/* Button to reveal hidden sections */}
        {hideSections && (
          <div className="flex justify-center mt-6">
            <button
              onClick={handleRevealSections}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mb-8"
            >
              Reveal Setup Payment Tracking
            </button>
          </div>
        )}

        {/* Past Payments Section Unchanged */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Past Payments</h2>
          <div className="bg-white shadow rounded-lg p-6">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="pb-2">Widget Name</th>
                  <th className="pb-2">Date</th>
                  <th className="pb-2">Amount</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {/* Example Data; Populate from your state or props as needed */}
                <tr className="border-b">
                  <td className="py-2">Example Widget 1</td>
                  <td>2024-01-01</td>
                  <td>$50.00</td>
                  <td>Completed</td>
                </tr>
                {/* Repeat for each payment record */}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
