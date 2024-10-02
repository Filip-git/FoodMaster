import React from "react";
import { Typography, Button } from "@material-tailwind/react";
import { FlagIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";

export function Page404() {
  return (
    <div className="h-screen mx-auto grid place-items-center text-center px-8">
      <div className="animate-fadeIn">
        <FlagIcon className="w-20 h-20 mx-auto text-blue-500 animate-bounce" />
        <Typography
          variant="h1"
          color="blue-gray"
          className="mt-10 !text-3xl !leading-snug md:!text-4xl font-bold"
        >
          Error 404 <br /> It looks like something went wrong.
        </Typography>
        <Typography className="mt-6 mb-12 text-[18px] font-normal text-gray-600 mx-auto md:max-w-sm">
          Oops! The page you're looking for isn't here. Let's get you back on track.
        </Typography>
        <Link to="/">
        <button 
        className="w-full px-4 py-2 md:w-[10rem] text-white rounded-md font-semibold shadow-lg transition-transform hover:scale-105 bg-blue-600"
        ripple={true}
        >
          Go Home
            </button>
        </Link>
      </div>
    </div>
  );
}

export default Page404;
