import { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, getDoc, updateDoc, deleteDoc, doc, increment } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import UserList from '../components/UserList';

const AdminPanel = () => {
  const [recipes, setRecipes] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const firestore = getFirestore();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          // Check if the user is an admin
          setIsAdmin(currentUser.uid === 'dSbFF2d0vYVDeL6u7lsQY6c6GwC2');
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    const fetchData = async () => {
      if (isAdmin) {
        try {
          // Fetch all recipes from Firestore
          const recipesSnapshot = await getDocs(collection(firestore, 'recipes'));
          // Map the documents to the recipe data
          const recipesData = recipesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setRecipes(recipesData);
        } catch (error) {
          console.error('Error fetching recipes:', error);
        }
      }
    };

    fetchData();
  }, [isAdmin, firestore]);

  const handleDeleteRecipe = async (id) => {
    try {
      // Fetch the recipe document
      const recipeDoc = await getDoc(doc(firestore, 'recipes', id));
      if (recipeDoc.exists()) {
        // Log the recipe document data to identify the user ID field
        console.log('Recipe document data:', recipeDoc.data());
  
        // Get the user ID associated with the recipe
        const userId = recipeDoc.data().createdByUid;
        if (userId) {
          // Delete the recipe from the global recipes collection
          await deleteDoc(doc(firestore, 'recipes', id));
          console.log(`Deleted from global recipes collection: ${id}`);
  
          // Delete the recipe from the user's subcollection
          await deleteDoc(doc(firestore, `users/${userId}/recipes`, id));
          console.log(`Deleted from user's subcollection: ${id}`);
  
          // Decrement the recipeCount in the user's document
          const userDocRef = doc(firestore, 'users', userId);
          await updateDoc(userDocRef, {
            recipeCount: increment(-1)
          });
          console.log(`Decremented recipe count for user: ${userId}`);
  
          // Update the local state to remove the deleted recipe
          setRecipes(recipes.filter(recipe => recipe.id !== id));
        } else {
          console.error(`No user ID found for recipe: ${id}`);
        }
      } else {
        console.error(`Recipe document not found: ${id}`);
      }
    } catch (error) {
      console.error('Error deleting recipe:', error);
    }
  };
  
  
  
  

  return (
    <div className="admin-panel p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center">Admin Panel</h1>
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gray-200 h-48 flex justify-center items-center">
              {recipe.photos && recipe.photos.length > 0 ? (
                <img src={recipe.photos[0]} alt="Recipe" className="object-cover w-full h-48" />
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
              <button
                onClick={() => handleDeleteRecipe(recipe.id)}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete Recipe
              </button>
            </div>
          </div>
        ))}
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-4">All Users</h2>
        <UserList />
      </div>
    </div>
  );
};

export default AdminPanel;
