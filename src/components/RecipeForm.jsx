import { useState, useEffect } from 'react';
import { addDoc, collection, doc, updateDoc, arrayUnion, getDoc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { firestore, storage } from '../utils/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RecipeForm = () => {
  const [title, setTitle] = useState('');
  const [saves, setSaves] = useState(0);
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [category, setCategory] = useState('Desserts');
  const [photos, setPhotos] = useState([]);
  const [user, setUser] = useState(null);
  const notifySuccess = () => toast.success('Recipe added successfully!');
  const notifyError = (message) => toast.error(`Error: ${message}`);

  const categories = ['Desserts', 'BBQ', 'Breakfast', 'Lunch', 'Dinner', 'Vegetarian', 'Fitness'];

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser({
        uid: currentUser.uid,
        email: currentUser.email,
        username: currentUser.displayName || currentUser.email.split('@')[0],
      });
    }
  }, []);

  const handlePhotoChange = (e) => {
    if (e.target.files.length > 5) {
      notifyError('You can only upload up to 5 photos.');
      return;
    }
    setPhotos(Array.from(e.target.files));
  };

  const uploadPhoto = async (photo) => {
    const storageRef = ref(storage, `recipes/${user.uid}/${photo.name}`);
    try {
      const snapshot = await uploadBytes(storageRef, photo);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      notifyError('Error uploading photo');
      throw error;
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      notifyError('User not authenticated');
      return;
    }

    // Check if all required fields are filled
    if (!title.trim() || !ingredients.trim() || !instructions.trim() || !category.trim()) {
      notifyError('User not authenticated');
      return;
    }

    const recipeData = {
      title,
      ingredients,
      instructions,
      category,
      createdBy: user.username,
      createdByUid: user.uid,
      createdAt: new Date(),
      saves,
    };

    try {
      const docRef = await addDoc(collection(firestore, 'recipes'), recipeData);

      const photoURLs = await Promise.all(photos.map(uploadPhoto));

      await updateDoc(docRef, { photos: photoURLs });

      const userDocRef = doc(firestore, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);
      if (!userDocSnap.exists()) {
        await setDoc(userDocRef, { recipes: [], recipeCount: 0 });
      }

      const userDocData = userDocSnap.exists() ? userDocSnap.data() : { recipeCount: 0 };
      const newRecipeCount = userDocData.recipeCount + 1;

      await updateDoc(userDocRef, {
        recipes: arrayUnion({ recipeId: docRef.id, title: recipeData.title }),
        recipeCount: newRecipeCount,
      });

      
      
      await setDoc(doc(firestore, `users/${user.uid}/recipes`, docRef.id), recipeData);

      console.log('Recipe written with ID: ', docRef.id);
      notifySuccess();

      setTitle('');
      setIngredients('');
      setInstructions('');
      setCategory('Desserts');
      setPhotos([]);


    } catch (e) {
      notifyError('Error adding recipe');
    }
  };


  return (
    <>
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          required
        />
      </div>
      <div>
        <label htmlFor="ingredients" className="block text-sm font-medium text-gray-700">
          Ingredients
        </label>
        <textarea
          id="ingredients"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          required
        />
      </div>
      <div>
        <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">
          Instructions
        </label>
        <textarea
          id="instructions"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          required
        />
      </div>
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          required
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
      <div>
      <label htmlFor="photo" className="block text-sm font-medium text-gray-700">
          Photo
        </label>
        <input
          type="file"
          id="photo"
          accept="image/*"
          multiple
          onChange={handlePhotoChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">
        Add Recipe
      </button>
    </form>
          <ToastContainer />
</>
  );
};

export default RecipeForm;
