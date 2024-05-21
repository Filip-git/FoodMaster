import RecipeForm from '../components/RecipeForm';

const AddRecipe = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl">Add New Recipe</h1>
      <RecipeForm />
    </div>
  );
};

export default AddRecipe;