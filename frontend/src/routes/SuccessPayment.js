import React from "react";
import Navbar from "../components/NavBar";

const SuccessPayment = () => {
  return (
    <>
      <Navbar />
      <div class="grid h-[70vh] place-content-center bg-[#f0f2f5] px-4">
        <div class="text-center">
          <div className="flex justify-center">
            <img
              src="https://opay.eu/user/themes/opay-theme/images/feature-img-folder/thankyou-image.svg"
              className="h-60"
              alt=""
            />
          </div>
          <h1 class="mt-6 text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Success!
          </h1>

          <p class="mt-4 text-gray-500">
            Your payment has been processed successfully. Thank you for your
            purchase!
          </p>

          <div className="flex justify-center">
            <a
              href="/my-apps"
              class="flex items-center space-x-2 w-48 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 mt-8 rounded transition duration-150 ease-in-out"
              title="Go to Widgets"
            >
              <span className="ml-2">Go to Widgets</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default SuccessPayment;
