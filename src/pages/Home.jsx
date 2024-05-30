import { Link } from 'react-router-dom';
import { Fade, Slide } from 'react-awesome-reveal';
import foodPic1 from '../assets/photos/foodpic1.jpeg';
import foodPic2 from '../assets/photos/foodpic2.jpeg';

const FoodPic1 = () => {
  return <img src={foodPic1} alt="Share Your Recipes" className="w-24 h-24 rounded-full shadow-lg" />;
};

const FoodPic2 = () => {
  return <img src={foodPic2} alt="Find New Favorites" className="w-24 h-24 rounded-full shadow-lg" />;
};

const Home = () => {
  return (
    <div className="container mx-auto p-4">
      <header className="bg-blue-500 text-white text-center py-12 mb-8 rounded-lg shadow-lg">
        <Fade cascade>
          <h1 className="text-5xl font-bold mb-4">Welcome to FoodMaster</h1>
          <p className="text-xl mb-4">Discover and share the best recipes from around the world.</p>
          <Link to="/recipes" className="bg-white text-blue-500 font-semibold py-2 px-4 rounded-full shadow-lg hover:bg-gray-200 transition duration-300">
            Explore Recipes
          </Link>
        </Fade>
      </header>

      <main>
        <section className="mb-12">
          <Slide direction="left">
            <div className="bg-gray-100 p-6 rounded-lg shadow-lg flex items-center space-x-4 rtl:space-x-reverse">
              <FoodPic1 />
              <div>
                <h2 className="text-3xl font-bold mb-2">Share Your Recipes</h2>
                <p className="text-gray-700">Have a favorite recipe? Share it with the world and inspire others.</p>
              </div>
            </div>
          </Slide>
        </section>

        <section className="mb-12">
          <Slide direction="right">
            <div className="bg-gray-100 p-6 rounded-lg shadow-lg flex items-center space-x-4 rtl:space-x-reverse">
              <FoodPic2 />
              <div>
                <h2 className="text-3xl font-bold mb-2">Find New Favorites</h2>
                <p className="text-gray-700">Explore our extensive collection of recipes from all cuisines and diets.</p>
              </div>
            </div>
          </Slide>
        </section>

        <section className="text-center">
          <Fade>
            <h2 className="text-4xl font-bold mb-4">Join Our Community</h2>
            <p className="text-gray-700 mb-8">Become a part of the FoodMaster community and start sharing and discovering delicious recipes today.</p>
            <Link to="/signup" className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-full shadow-lg hover:bg-blue-600 transition duration-300">
              Get Started
            </Link>
          </Fade>
        </section>
      </main>
    </div>
  );
};

export default Home;
