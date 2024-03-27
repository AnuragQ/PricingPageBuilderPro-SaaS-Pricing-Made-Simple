import React from 'react';
import PriceComponent from '../components/PriceComponent';
import TitleComponent from '../components/TitleComponent';
import FeatureComponent from '../components/FeatureComponent';
import PriceCardComponent from '../components/PriceCardComponent';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaTimes } from "react-icons/fa"; // Ensure react-icons is 




const PricePage=()=>{


    // State Management for Sidebar  
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const handleToggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
      };

    // State Management for Sidebar Forms 
    const [activeForm, setActiveForm] = useState(null);

    // State Management for Price Component
    const [prefix, setPrefix] = useState('From');
    const [postfix, setPostfix] = useState('/month');
    const [amount, setAmount] = useState('19');
    const [currency, setCurrency] = useState('$');

     // State Management for Title Component
    const [titleName, setTitleName] = useState('Title Name');
    const [captionName, setCaptionName] = useState('Caption Name');
    const [headingColor, setHeadingColor] = React.useState('#000000');


     // State Management for Feature Component
     const [features, setFeatures] = useState([]);
     const [newFeature, setNewFeature] = useState('');

     // State Management for priceCard Quantity
     const [numPriceCards, setNumPriceCards] = useState(1); 

     // State Management for priceCardIndex
     const [PriceCardsIndex, setNumPriceCardsIndex] = useState(1);


     // State Management Functions for feature Components
     const handleFeatureChange = (index, value) => {
      setFeatures((prevFeatures) => {
        const updatedFeatures = [...prevFeatures];
        updatedFeatures[index] = value;
        return updatedFeatures;
      });
    };
    
    const handleRemoveFeature = (index) => {
      setFeatures((prevFeatures) => {
        const updatedFeatures = [...prevFeatures];
        updatedFeatures.splice(index, 1);
        return updatedFeatures;
      });
    };
    
    const handleAddFeature = () => {
      if (newFeature.trim() !== '') {
        setFeatures((prevFeatures) => [...prevFeatures, newFeature]);
        setNewFeature('');
      }
    };
    

    return (
    
        <div className="flex h-screen">
        {/* Sidebar toggle button */}
        <div className="cursor-pointer" onClick={handleToggleSidebar}>
        {isSidebarOpen ? <FaTimes className="text-gray-600" /> : <FaBars className="text-gray-600" />}
        </div>
        {/*Side bar form selection*/}
        { isSidebarOpen &&(
                  <div className="flex flex-col w-64 h-screen bg-gray-100 p-4">
                  <button
                    className="mb-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300"
                    onClick={() => setActiveForm('title')}
                  >
                    Heading
                  </button>
                  <button
                    className="mb-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300"
                    onClick={() => setActiveForm('price')}
                  >
                    Price
                  </button>
                  <button
                    className="mb-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300"
                    onClick={() => setActiveForm('features')}
                  >
                    Features
                  </button>
                  <button
                    className="mb-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300"
                    onClick={() => setActiveForm('button')}
                  >
                    Button
                  </button>
                  <button
                    className="mb-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300"
                    onClick={() => setActiveForm('image')}
                  >
                    Image
                  </button>

                  {/*  */}
                  <button
                    className="mb-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300"
                    onClick={() => setActiveForm('price_count')}
                  >
                    Num Price Cards
                  </button>
                  <button
                    className="mb-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-300"
                    onClick={() => setActiveForm('index')}
                  >
                    Price Card Index
                  </button>
                 
                  
                  
                </div>
        )}

                
      {/* Sidebar content Price */}
      {isSidebarOpen && activeForm === 'price' && (
        <div className="w-64 bg-gray-200 p-4 space-y-4">
          <label className="block text-sm font-semibold text-gray-700">Prefix</label>
          <input
            type="text"
            placeholder="Enter prefix"
            value={prefix}
            onChange={(e) => setPrefix(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
          />

          <label className="block text-sm font-semibold text-gray-700">Amount</label>
          <input
            type="text"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
          />

          <label className="block text-sm font-semibold text-gray-700">Postfix</label>
          <input
            type="text"
            placeholder="Enter postfix"
            value={postfix}
            onChange={(e) => setPostfix(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
          />

          <label className="block text-sm font-semibold text-gray-700">Currency</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
          >
            <option value="$">$</option>
            <option value="€">€</option>
            <option value="¥">¥</option>
            <option value="£">£</option>
          </select>
        </div>
      )}
      {/* Sidebar content Title*/}
      {isSidebarOpen && activeForm === 'title' && (
      <div className="w-64 bg-gray-200 p-4 space-y-4">
        <label className="block text-sm font-semibold text-gray-700">Title Name</label>
        <input
          type="text"
          placeholder="Enter title name"
          value={titleName}
          onChange={(e) => setTitleName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
        />

        <label className="block text-sm font-semibold text-gray-700">Caption Name</label>
        <input
          type="text"
          placeholder="Enter caption name"
          value={captionName}
          onChange={(e) => setCaptionName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
        />

        {/* Color picker for heading color */}
    {/* Color picker for heading color in a rounded box */}
    <label className="block text-sm font-semibold text-gray-700">Heading Color</label>
    <div className="flex items-center">
      <input
        type="color"
        value={headingColor}
        onChange={(e) => setHeadingColor(e.target.value)}
        className="w-10 h-10 rounded-full cursor-pointer focus:outline-none focus:ring focus:border-blue-500"
      />
    </div>

      </div>
    )}
    {/* sidebar price card count */}
    {isSidebarOpen && activeForm === 'price_count' && (
      
        <div className="w-64 bg-gray-200 p-4 space-y-4">
          {/* <label className="block text-sm font-semibold text-gray-700">Price Card Number</label>
          <input
                        type="number"
                        value={numPriceCards}
                        onChange={(e) => setNumPriceCards(parseInt(e.target.value))}
                        min={1} // Ensure minimum value is 1
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
                    /> */}
          <label className="block text-sm font-semibold text-gray-700">Price Card Number</label>
          <select
            value={numPriceCards}
            onChange={(e) => setNumPriceCards(parseInt(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </div>
      )}
      {/* sidebar price card index */}
    {isSidebarOpen && activeForm === 'index' && (
      
      <div className="w-64 bg-gray-200 p-4 space-y-4">
        <label className="block text-sm font-semibold text-gray-700">Price Card Number</label>
        <select
          value={PriceCardsIndex}
          onChange={(e) => setNumPriceCardsIndex(parseInt(e.target.value))}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
         >
          {/* Generate options based on the numPriceCards state */}
          {Array.from({ length: numPriceCards }).map((_, index) => (
          <option key={index} value={index}>{index + 1}</option>
          ))}
        </select>
      </div>
    )}

      {/* Sidebar content Features*/}
      {isSidebarOpen && activeForm === 'features' && (
  <div className="w-64 bg-gray-200 p-4 space-y-4">
    {/* Mapping over existing features */}
    {features.map((feature, index) => (
      <div key={index} className="flex space-x-2 items-center">
        <input
          type="text"
          placeholder={`Feature ${index + 1}`}
          value={feature}
          onChange={(e) => handleFeatureChange(index, e.target.value)}
          className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
        />
        <button
          type="button"
          onClick={() => handleRemoveFeature(index)}
          className="p-2 bg-red-500 text-white rounded hover:bg-red-700 transition duration-300"
        >
          Remove
        </button>
      </div>
    ))}

    {/* Input for adding new feature */}
    <div className="flex space-x-2 items-center">
      <input
        type="text"
        placeholder="New Feature"
        value={newFeature}
        onChange={(e) => setNewFeature(e.target.value)}
        className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-500"
      />
      <button
        type="button"
        onClick={handleAddFeature}
        className="p-2 bg-green-500 text-white rounded hover:bg-green-700 transition duration-300"
      >
        Add
      </button>
    </div>
  </div>
)}




      
      {/* Main content */}


      <div className="flex flex-grow p-4 flex-wrap justify-center">
      {
        Array.from({length:numPriceCards}).map(
          (_,index)=>(
            <PriceCardComponent
            key={index}
            PriceCardsIndex={PriceCardsIndex}
            titleName={titleName}
            headingColor={headingColor}
            captionName={captionName}
            prefix={prefix}
            amount={amount}
            postfix={postfix}
            currency={currency}
            features={features}
            newFeature={newFeature}
            onAddFeature={handleAddFeature}
            onNewFeatureChange={(e) => setNewFeature(e.target.value)}
            onFeatureChange={handleFeatureChange}
            onRemoveFeature={handleRemoveFeature}
            style={{ flex: "1 0 auto" }}
        />  
          )
        )
      }
      </div>


      {/* <div className="flex-grow p-4">
                <PriceCardComponent
                    titleName={titleName}
                    headingColor={headingColor}
                    captionName={captionName}
                    prefix={prefix}
                    amount={amount}
                    postfix={postfix}
                    currency={currency}
                    features={features}
                    newFeature={newFeature}
                    onAddFeature={handleAddFeature}
                    onNewFeatureChange={(e) => setNewFeature(e.target.value)}
                    onFeatureChange={handleFeatureChange}
                    onRemoveFeature={handleRemoveFeature}
                />
            </div> */}
     
      {/* <div className="flex-grow p-4">
            <TitleComponent 
            title={titleName}
            color={headingColor}
            subtitle={captionName}
            />
            <PriceComponent
                prefix={prefix}
                amount={amount}
                postfix={postfix}
                currency={currency}
                className="my-4"
            />
            <FeatureComponent features={features} />
            </div> */}
        
            
        </div>
        
    );
}; 
export default PricePage;