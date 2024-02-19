import React from 'react';

const FeatureComponent = ({
  features,
  featureItemStyle = 'text-md text-gray-700 py-2', // Adjusted text size and padding
  containerStyle = 'max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg flex flex-col items-start space-y-4', // Centralized and shadowed container
}) => {
  return (
    <div className={containerStyle}>
      <h2 className="text-xl font-semibold text-gray-900 mb-4 w-full text-left">Features</h2>
      {features.map((feature, index) => (
        <div key={index} className="flex items-center w-full">
          {/* Optional: Add an icon next to each feature */}
          <span className="text-green-500 mr-2">•</span> {/* Custom bullet */}
          <span className={featureItemStyle}>{feature}</span>
        </div>
      ))}
    </div>
  );
};

export default FeatureComponent;


/*import React from 'react';

const FeatureComponent = ({
  features,
  featureItemStyle = 'text-md text-gray-700 py-2', // Adjusted text size and padding
  containerStyle = 'max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg flex flex-col items-start space-y-4', // Centralized and shadowed container
}) => {
  return (
    <div className={containerStyle}>
      <h2 className="text-xl font-semibold text-gray-900 mb-4 w-full text-left">Features</h2>
      {features.map((feature, index) => (
        <div key={index} className="flex items-center w-full">

          <span className="text-green-500 mr-2">•</span> 
          <span className={featureItemStyle}>{feature}</span>
        </div>
      ))}
    </div>
  );
};

export default FeatureComponent;*/

