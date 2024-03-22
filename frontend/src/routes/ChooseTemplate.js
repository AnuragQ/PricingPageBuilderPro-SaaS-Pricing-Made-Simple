import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ThreeDots } from "react-loader-spinner";
import NavBar from "../components/NavBar";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const fetchTemplates = async () => {
  const response = await fetch(
    `${process.env.REACT_APP_BASE_URL}/api/templates`,
    {
      headers: {
        Accept: "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error(`Network response was not ok (status: ${response.status})`);
  }
  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    throw new Error("Received non-JSON response from the server");
  }
  return response.json();
};

const ChooseTemplate = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const {
    data: templates,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["templates"],
    queryFn: fetchTemplates,
  });

  const handleSearch = () => {
    // Filter the templates based on the search term
    const filtered = templates?.filter((template) =>
      template.plan_title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTemplates(filtered);
  };

  const handleClearSearch = () => {
    setSearchTerm(""); // Clear search term
    setFilteredTemplates([]); // Clear filtered templates
  };

  let navigate = useNavigate();

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gray-100 p-8 flex justify-center">
        <div className="max-w-4xl w-full">
          <div className="flex items-center mb-6">
            <input
              type="text"
              placeholder="Search templates..."
              className="flex-grow px-4 py-2 border border-blue-300 rounded-full shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
            <button
              onClick={handleSearch}
              className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-full shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Search
            </button>
            <button
              onClick={handleClearSearch}
              className="ml-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-full shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Clear
            </button>
          </div>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <ThreeDots color="#3B82F6" height={50} width={50} />
            </div>
          ) : isError ? (
            <div>Error: {error.message}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {(filteredTemplates.length > 0
                ? filteredTemplates
                : templates
              )?.map((template) => (
                <motion.div
                  key={template._id}
                  whileHover={{ scale: 1.03 }}
                  className="p-4 bg-white rounded-lg shadow-md cursor-pointer"
                  onClick={() => navigate(`/create-widget`)}
                >
                  <img
                    src={template.template_image}
                    alt={template.plan_title}
                    className="h-40 w-full object-cover rounded-md"
                  />
                  <h3 className="mt-2 text-lg font-semibold">
                    {template.plan_title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {template.plan_description}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChooseTemplate;
