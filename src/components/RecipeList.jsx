import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../utils/firebase';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);

  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, 'recipes'));
      const recipeList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRecipes(recipeList);
    } catch (error) {
      console.error('Error fetching recipes: ', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Recipe List</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gray-200 h-48 flex justify-center items-center">
              {recipe.photos && recipe.photos.length > 0 ? (
                recipe.photos.length === 1 ? (
                  <img src={recipe.photos[0]} alt="Recipe" className="object-cover w-full h-48" />
                ) : (
                  <Slider {...sliderSettings} className="w-full h-full">
                    {recipe.photos.map((photo, index) => (
                      <div key={index}>
                        <img src={photo} alt={`Recipe ${index}`} className="object-cover w-full h-48" />
                      </div>
                    ))}
                  </Slider>
                )
              ) : (
                <span className="text-gray-400">No photo available</span>
              )}
            </div>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">{recipe.title}</h2>
              <h3 className="text-lg font-medium mb-2">Ingredients:</h3>
              <p className="text-gray-700 mb-4">{recipe.ingredients}</p>
              <h3 className="text-lg font-medium mb-2">Instructions:</h3>
              <p className="text-gray-700">{recipe.instructions}</p>
              <h3 className="text-lg font-medium mb-2">Category:</h3>
              <p className="text-gray-700">{recipe.category}</p>
              <p className="italic mt-1">by {recipe.createdBy}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeList;
