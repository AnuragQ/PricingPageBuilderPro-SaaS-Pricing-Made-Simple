import React, { useState, useEffect } from 'react';
import { ThreeDots } from 'react-loader-spinner';
import NavBar from '../components/NavBar';

// Placeholder templates data
const mockTemplates = [
  { id: 1, image: 'https://source.unsplash.com/random/200x200?sig=1', title: 'Weather Widget', usage: 'Displays current weather.' },
  { id: 2, image: 'https://source.unsplash.com/random/200x200?sig=2', title: 'Currency Converter', usage: 'Converts between different currencies.' },
  // Add more templates as needed
];

const ChooseTemplate = () => {
  const [templates, setTemplates] = useState([]);
  const [displayedTemplates, setDisplayedTemplates] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    // Simulate fetching data
    setTimeout(() => {
      setTemplates(mockTemplates);
      setDisplayedTemplates(mockTemplates); // Initially display all templates
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleSearch = () => {
    const filtered = templates.filter(template =>
      template.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setDisplayedTemplates(filtered); // Update displayed templates
  };

  const handleClearSearch = () => {
    setSearchTerm(''); // Clear search term
    setDisplayedTemplates(templates); // Reset displayed templates to full list
  };

  return (
    <>
      <NavBar/>
      <div className="min-h-screen bg-gray-100 p-8 flex justify-center">
        <div className="max-w-4xl w-full">
          <div className="flex items-center mb-6">
            <input
              type="text"
              placeholder="Search templates..."
              className="flex-grow px-4 py-2 border border-blue-300 rounded-full shadow-sm focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {displayedTemplates.map(template => (
                <div key={template.id} className="p-4 bg-white rounded-lg shadow-md">
                  <img src={template.image} alt={template.title} className="h-40 w-full object-cover rounded-md" />
                  <h3 className="mt-2 text-lg font-semibold">{template.title}</h3>
                  <p className="text-sm text-gray-600">{template.usage}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChooseTemplate;
