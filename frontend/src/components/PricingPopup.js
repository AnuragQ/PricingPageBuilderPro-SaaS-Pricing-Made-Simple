import React from "react";

const PricingPopup = ({ showModal, setShowModal }) => {
  const handleUpgradeClick = () => {
    setShowModal(false);
    // Redirect to the pricing page
    window.location.href = "/pricing";
  };

  return (
    <div
      id="progress-modal"
      className={`fixed top-0 left-0 z-50 flex justify-center items-center w-full h-screen bg-opacity-50 bg-black ${
        showModal ? "" : "hidden"
      }`}
    >
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <button
          type="button"
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 transition rounded-full p-2 focus:outline-none"
          onClick={() => setShowModal(false)}
        >
          <svg
            className="w-6 h-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <div className="p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Upgrade to Premium
          </h3>
          <p className="text-gray-700 mb-6">
            Unlock premium features and full capacity by upgrading now to access
            code downloads and pricing page deployment.
          </p>
          <div className="flex justify-center space-x-4">
            <button
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg focus:outline-none"
              onClick={() => handleUpgradeClick()}
            >
              Upgrade Now
            </button>
            <button
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg focus:outline-none"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPopup;
