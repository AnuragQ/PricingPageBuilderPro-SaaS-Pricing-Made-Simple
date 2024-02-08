import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar"; // Adjust the import path as needed
import { motion } from "framer-motion";
import { FaEdit, FaShareAlt, FaSearch, FaLink, FaCode } from "react-icons/fa"; // Ensure react-icons is installed

const userApps = [
  {
    id: 1,
    name: "Weather App",
    createdAt: "2020-05-17T12:00:00Z",
    imageUrl: "https://source.unsplash.com/random/150x150?weather",
  },
  {
    id: 2,
    name: "Currency Converter",
    createdAt: "2020-05-18T15:30:00Z",
    imageUrl: "https://source.unsplash.com/random/150x150?currency",
  },
  {
    id: 3,
    name: "To-Do List",
    createdAt: "2020-05-19T09:00:00Z",
    imageUrl: "https://source.unsplash.com/random/150x150?todo",
  },
  {
    id: 4,
    name: "Calendar App",
    createdAt: "2020-05-20T14:00:00Z",
    imageUrl: "https://source.unsplash.com/random/150x150?calendar",
  },
  {
    id: 5,
    name: "News Feed",
    createdAt: "2020-05-21T10:30:00Z",
    imageUrl: "https://source.unsplash.com/random/150x150?news",
  },
  {
    id: 6,
    name: "Photo Gallery",
    createdAt: "2020-05-22T11:00:00Z",
    imageUrl: "https://source.unsplash.com/random/150x150?photos",
  },
];

const UserAppsPage = () => {
  const [showShareOptions, setShowShareOptions] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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

  return (
    <>
      <NavBar />
      <div
        className="px-8 py-4 min-h-screen flex justify-center"
        style={{ backgroundColor: "#f0f2f5" }}
      >
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
                key={app.id}
                className="relative bg-white p-4 rounded-lg shadow hover:shadow-md"
              >
                <motion.div whileHover={{ scale: 1.03 }} className="space-y-2">
                  <img
                    src={app.imageUrl}
                    alt={app.name}
                    className="w-full h-40 object-cover rounded-md"
                  />
                  <h3 className="font-semibold text-lg">{app.name}</h3>
                  <p className="text-sm">
                    Created at:{" "}
                    {new Date(app.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </motion.div>
                <div className="flex justify-end space-x-2 mt-2">
                  <FaEdit
                    className="text-blue-600 hover:text-blue-700 cursor-pointer"
                    size={24}
                  />
                  <FaShareAlt
                    className="text-green-600 hover:text-green-700 cursor-pointer"
                    size={24}
                    onClick={(e) => handleShareClick(e, app.id)}
                  />
                </div>
                {showShareOptions === app.id && (
                  <div className="absolute bg-white p-3 rounded shadow-lg -bottom-20 right-0 z-10 w-48 share-menu">
                    <div className="flex flex-col items-start">
                      <button
                        className="flex items-center gap-2 hover:text-blue-600"
                        onClick={() => {
                          /* Handle shareable link */
                        }}
                      >
                        <FaLink size={16} /> Shareable Link
                      </button>
                      <button
                        className="flex items-center gap-2 hover:text-blue-600 mt-2"
                        onClick={() => {
                          /* Handle get code */
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
