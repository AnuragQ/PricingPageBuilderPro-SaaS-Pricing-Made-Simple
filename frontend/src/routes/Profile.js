import React, { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/NavBar";

const Profile = () => {
  const [stripeApiKey, setStripeApiKey] = useState(
    "sk_test_YourTestStripeAPIKeyHere"
  );
  const [isEditing, setIsEditing] = useState(false);

  const handleStripeApiKeyChange = (e) => {
    setStripeApiKey(e.target.value);
  };

  const saveStripeApiKey = () => {
    // Save the Stripe API Key
    setIsEditing(false);
    console.log("Stripe API Key saved:", stripeApiKey);
    // Here you should include the logic to actually save the Stripe API key, possibly updating your database.
  };

  const pastPayments = [
    {
      id: 1,
      widgetName: "Widget A",
      date: "2024-03-29",
      amount: "$10.00",
      status: "Completed",
    },
    {
      id: 2,
      widgetName: "Widget B",
      date: "2024-03-15",
      amount: "$25.00",
      status: "Completed",
    },
    // Add more dummy data as needed
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <motion.div
        className="max-w-4xl mx-auto pt-16 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.5 } }}
      >
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Basic Details</h2>
          <div className="bg-white shadow rounded-lg p-6">
            <div>
              <strong>Email:</strong> user@example.com
            </div>
            <div className="mt-4 flex">
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
                  {stripeApiKey.replace(/.(?=.{4})/g, "*")}
                </span>
              )}
              <button
                onClick={() =>
                  isEditing ? saveStripeApiKey() : setIsEditing(true)
                }
                className="ml-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
              >
                {isEditing ? "Save" : "Edit"}
              </button>
            </div>
          </div>
        </div>

        <div>
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
                {pastPayments.map((payment) => (
                  <tr key={payment.id} className="border-b last:border-b-0">
                    <td className="py-2">{payment.widgetName}</td>
                    <td>{payment.date}</td>
                    <td>{payment.amount}</td>
                    <td>{payment.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      <footer className="p-4 mt-16">
        <div className="text-center text-sm">
          <a href="#" className="text-blue-500 hover:underline">
            Privacy Policy
          </a>{" "}
          •{" "}
          <a href="#" className="text-blue-500 hover:underline">
            Terms of Use
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Profile;
