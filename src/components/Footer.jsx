import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/photos/FoodMaster.png'

const Footer = () => {
  const currentDate = new Date().getFullYear();

  return (
    <footer className="bg-white rounded-lg shadow dark:bg-gray-900 m-4">
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <Link to="/" className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
          <img className="h-12" src={logo} alt="FoodMaster Logo" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">FoodMaster</span>
          </Link>
          <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
            <li>
              <Link to="/" className="hover:underline me-4 md:me-6">Home</Link>
            </li>
            <li>
              <Link to="/about" className="hover:underline me-4 md:me-6">About</Link>
            </li>
            <li>
              <Link to="/recipes" className="hover:underline me-4 md:me-6">Recipes</Link>
            </li>
            {localStorage.getItem('isLoggedIn') === 'true' && (
              <li>
                <Link to="/add-recipe" className="hover:underline me-4 md:me-6">Add New Recipe</Link>
              </li>
            )}
          </ul>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
          © {currentDate} <a href="https://flowbite.com/" className="hover:underline">FoodMaster</a>. All Rights Reserved.
        </span>
      </div>
    </footer>
  );
}

export default Footer;
