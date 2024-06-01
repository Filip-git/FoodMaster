import { useEffect, useState } from 'react';
import { getFirestore, collection, query, where, getDocs, doc, deleteDoc, updateDoc, increment, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import Slider from 'react-slick'; // Make sure to install react-slick and slick-carousel
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Profile = () => {
  const [recipes, setRecipes] = useState([]);
  const [editRecipe, setEditRecipe] = useState(null);
  const [username, setUsername] = useState('');
  const [editForm, setEditForm] = useState({
    title: '',
    ingredients: '',
    instructions: '',
    category: 'Desserts'
  });
  const firestore = getFirestore();
  const auth = getAuth();

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (user) {
        setUsername(user.displayName || user.email.split('@')[0]); // Set the username
        const q = query(collection(firestore, 'recipes'), where('createdByUid', '==', user.uid));
        const querySnapshot = await getDocs(q);
        setRecipes(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
      }
    };

    fetchData();
  }, [auth, firestore]);

  const handleDelete = async (id) => {
    const user = auth.currentUser;
    if (user) {
      try {
        // Delete the recipe from the global recipes collection
        await deleteDoc(doc(firestore, 'recipes', id));
        console.log(`Deleted from global recipes collection: ${id}`);

        // Delete the recipe from the user's subcollection
        await deleteDoc(doc(firestore, `users/${user.uid}/recipes`, id));
        console.log(`Deleted from user's subcollection: ${id}`);

        // Decrement the recipeCount in the user's document
        const userDocRef = doc(firestore, 'users', user.uid);
        await updateDoc(userDocRef, {
          recipeCount: increment(-1)
        });
        console.log(`Decremented recipe count for user: ${user.uid}`);

        // Update the local state to remove the deleted recipe
        setRecipes(recipes.filter(recipe => recipe.id !== id));
      } catch (error) {
        console.error('Error deleting recipe:', error);
      }
    }
  };

  const handleEditClick = (recipe) => {
    setEditRecipe(recipe.id);
    setEditForm({
      title: recipe.title,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      category: recipe.category,
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (user) {
      const recipeRef = doc(firestore, 'recipes', editRecipe);
      const userRecipeRef = doc(firestore, `users/${user.uid}/recipes`, editRecipe);

      // Create an object with the updated recipe data
      const updatedRecipeData = {
        title: editForm.title,
        ingredients: editForm.ingredients,
        instructions: editForm.instructions,
        category: editForm.category,
      };

      try {
        // Log the IDs for debugging
        console.log(`Editing recipe: ${editRecipe}`);
        console.log(`User ID: ${user.uid}`);

        // Check if the document exists in the user's subcollection
        const userRecipeDoc = await getDoc(userRecipeRef);
        if (!userRecipeDoc.exists()) {
          console.error(`No document found in user subcollection with ID: ${editRecipe}`);
          throw new Error('No document to update in user subcollection');
        }

        // Update the recipe in the global recipes collection
        await updateDoc(recipeRef, updatedRecipeData);
        console.log('Global recipe updated successfully');

        // Update the recipe in the user's subcollection
        await updateDoc(userRecipeRef, updatedRecipeData);
        console.log('User subcollection recipe updated successfully');

        // Update the local state
        setRecipes(recipes.map(recipe =>
          recipe.id === editRecipe
            ? { ...recipe, ...editForm }
            : recipe
        ));

        setEditRecipe(null);
      } catch (error) {
        console.error('Error updating recipe:', error);
      }
    }
  };

  return (
    <div className="profile">
      <h1 className="text-3xl mb-4">My profile - <span className="italic">{username}</span></h1>
      {recipes.map(recipe => (
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
            {editRecipe === recipe.id ? (
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={editForm.title}
                    onChange={handleEditChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div>
                  <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700">
                    Ingredients
                  </label>
                  <textarea
                    name="ingredients"
                    value={editForm.ingredients}
                    onChange={handleEditChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div>
                  <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">
                    Instructions
                  </label>
                  <textarea
                    name="instructions"
                    value={editForm.instructions}
                    onChange={handleEditChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <select
                    name="category"
                    value={editForm.category}
                    onChange={handleEditChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  >
                    {['Desserts', 'BBQ', 'Breakfast', 'Lunch', 'Dinner', 'Vegetarian'].map(cat => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditRecipe(null)}
                  className="px-4 py-2 ml-2 bg-gray-600 text-white rounded-md"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <>
                <h2 className="text-xl font-semibold mb-2">{recipe.title}</h2>
                <h3 className="text-lg font-medium mb-2">Ingredients:</h3>
                <p className="text-gray-700 mb-4">{recipe.ingredients}</p>
                <h3 className="text-lg font-medium mb-2">Instructions:</h3>
                <p className="text-gray-700">{recipe.instructions}</p>
                <h3 className="text-lg font-medium mb-2">Category:</h3>
                <p className="text-gray-700">{recipe.category}</p>

                <button
                  onClick={() => handleEditClick(recipe)}
                  className="bg-yellow-500 text-white px-4 py-2 m-2 rounded-md"
                >
                  Edit
                </button>

                <button
                  className="bg-red-500 text-white px-4 py-2 m-2 rounded-md"
                  onClick={() => handleDelete(recipe.id)}
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Profile;
