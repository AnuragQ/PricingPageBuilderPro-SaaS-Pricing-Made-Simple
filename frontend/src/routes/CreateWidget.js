// CreateWidget.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const CreateWidget = () => {
  // State to manage form inputs
  const [widgetDetails, setWidgetDetails] = useState({
    appName: '',
    pricingModel: 'monthly',
    currency: 'USD',
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setWidgetDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  // Pricing template based on user input
  const pricingTemplate = `${widgetDetails.appName} Pricing - ${widgetDetails.currency} ${
    widgetDetails.pricingModel === 'monthly' ? 'per month' : 'per year'
  }`;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex">
        {/* Left Side - Widget Details Form */}
        <motion.div
          className="max-w-md mx-auto mb-8 p-4 bg-white rounded-md shadow-md"
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-4">Widget Details</h2>
          <form>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">App Name</label>
              <input
                type="text"
                name="appName"
                value={widgetDetails.appName}
                onChange={handleInputChange}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Pricing Model</label>
              <select
                name="pricingModel"
                value={widgetDetails.pricingModel}
                onChange={handleInputChange}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Currency</label>
              <select
                name="currency"
                value={widgetDetails.currency}
                onChange={handleInputChange}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                {/* Add more currency options as needed */}
              </select>
            </div>
          </form>
        </motion.div>

        {/* Middle - Pricing Template Display */}
        <motion.div
          className="flex-1 mx-4 p-8 bg-white rounded-md shadow-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-4">Pricing Template</h2>
          <p className="text-gray-700">{pricingTemplate}</p>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateWidget;
