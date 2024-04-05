import React from "react";

const Modal = ({ showModal, setShowModal, handleAccept }) => {
  return (
    <div
      id="default-modal"
      tabIndex="-1"
      aria-hidden="true"
      className={`${
        showModal ? "fixed inset-0 overflow-y-auto" : "hidden"
      } flex items-center justify-center`}
    >
      {/* Semi-transparent overlay */}
      <div
        className={`${
          showModal ? "fixed inset-0 bg-black bg-opacity-50" : "hidden"
        }`}
        onClick={() => setShowModal(false)}
      ></div>

      <div className="relative p-4 w-full max-w-2xl z-10">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
            <h3 className="text-xl font-semibold text-gray-900">
              Hide Setup Payment Tracking
            </h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
              onClick={() => setShowModal(false)}
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          <div className="p-4 md:p-5 space-y-4">
            <p className="text-base leading-relaxed text-gray-500">
              Do you want to hide the setup for Payment Tracking and Tutorial
              Video? If you hide it now, you may need to manually enable it
              later.
            </p>
          </div>
          <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b">
            <button
              onClick={() => {
                handleAccept();
                setShowModal(false);
              }}
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3"
            >
              Yes
            </button>
            <button
              onClick={() => setShowModal(false)}
              type="button"
              className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100"
            >
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
