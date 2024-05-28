import React from 'react';
import { Link } from 'react-router-dom';

const AboutFoodMaster = () => {
  return (
    <div className="container mx-auto p-6 text-center">
      <h1 className="text-4xl font-bold mb-4 animate-fade-in">Welcome to FoodMaster!</h1>
      <p className="text-lg mb-8 animate-fade-in">
        At FoodMaster, we believe in the power of great recipes to bring people together. Whether you're a professional chef or a home cook, our platform offers a wealth of resources to help you create delicious meals.
      </p>

      <div className="flex flex-wrap justify-center gap-6">
        <div className="feature-card w-64 p-6 bg-gray-100 rounded-lg shadow-lg animate-zoom-in">
          <h2 className="text-xl font-semibold mb-2">Discover Recipes</h2>
          <p>Explore a wide variety of recipes from different cuisines, crafted by our community of food enthusiasts.</p>
        </div>
        <div className="feature-card w-64 p-6 bg-gray-100 rounded-lg shadow-lg animate-zoom-in">
          <h2 className="text-xl font-semibold mb-2">Share Your Creations</h2>
          <p>Upload your own recipes and photos to inspire others and showcase your culinary skills.</p>
        </div>
        <div className="feature-card w-64 p-6 bg-gray-100 rounded-lg shadow-lg animate-zoom-in">
          <h2 className="text-xl font-semibold mb-2">Save recipes</h2>
          <p>Join our community and save recipes to your FoodMaster profile.</p>
        </div>
      </div>

      <div className="mt-12 animate-fade-in">
        <h2 className="text-2xl font-bold mb-4">Join FoodMaster Today!</h2>
        <p className="text-lg mb-6">Sign up now to start discovering, sharing, and connecting with the world of culinary delights.</p>
        <Link to="/recipes">
        <button className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-md shadow-md hover:bg-orange-600 hover:shadow-lg transform hover:-translate-y-1 transition">
          Get Started
        </button></Link>
      </div>
    </div>
  );
}

export default AboutFoodMaster;
