import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../utils/firebase';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [searchTitle, setSearchTitle] = useState('');
  const [searchCategory, setSearchCategory] = useState('');

  const fetchData = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, 'recipes'));
      const recipeList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRecipes(recipeList);
      setFilteredRecipes(recipeList);
    } catch (error) {
      console.error('Error fetching recipes: ', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter recipes based on search title and category
  useEffect(() => {
    let filtered = recipes;

    // Filter by title if searchTitle is not empty
    if (searchTitle) {
      filtered = filtered.filter((recipe) =>
        recipe.title.toLowerCase().includes(searchTitle.toLowerCase())
      );
    }

    // Filter by category if searchCategory is not empty
    if (searchCategory) {
      filtered = filtered.filter((recipe) =>
        recipe.category.toLowerCase().includes(searchCategory.toLowerCase())
      );
    }

    setFilteredRecipes(filtered);
  }, [searchTitle, searchCategory, recipes]);

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

      {/* Search bars */}
      <div className="mb-8 flex justify-center gap-4">
        {/* Search by title */}
        <input
          type="text"
          placeholder="Search by Title"
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
          className="p-2 border rounded-lg w-64"
        />

        {/* Search by category */}
        <input
          type="text"
          placeholder="Search by Category"
          value={searchCategory}
          onChange={(e) => setSearchCategory(e.target.value)}
          className="p-2 border rounded-lg w-64"
        />
      </div>

      {/* Recipe list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {filteredRecipes.length > 0 ? (
          filteredRecipes.map((recipe) => (
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

              <div className="p-8 max-w-lg mx-auto bg-white shadow-md rounded-lg">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">{recipe.title}</h2>
                
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2 text-gray-700">Ingredients:</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    {recipe.ingredients.split('\n').map((ingredient, index) => (
                      <li key={index}>{ingredient}</li>
                    ))}
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2 text-gray-700">Instructions:</h3>

                  {/* Instructions with Read More/Less functionality */}
                  <InstructionsToggle instructions={recipe.instructions} />
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2 text-gray-700">Category:</h3>
                  <p className="text-gray-600">{recipe.category}</p>
                </div>

                <p className="italic text-gray-500 text-right">by {recipe.createdBy}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No recipes found.</p>
        )}
      </div>
    </div>
  );
};

// Instructions toggle component
const InstructionsToggle = ({ instructions }) => {
  const [showFullInstructions, setShowFullInstructions] = useState(false);

  // Truncate instructions if not showing full
  let displayInstructions = instructions;
  if (!showFullInstructions) {
    displayInstructions = instructions.substring(0, 90) + '...';
  }

  return (
    <>
      <p className="text-gray-600">{displayInstructions}</p>

      <button
        onClick={() => setShowFullInstructions((prev) => !prev)}
        className="text-indigo-500 mt-3 hover:text-indigo-600"
      >
        {showFullInstructions ? 'Less' : 'More'}
      </button>
    </>
  );
};

export default RecipeList;
