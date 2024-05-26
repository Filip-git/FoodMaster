const RecipeItem = ({ recipe }) => {
  return (
    <div className="recipe-item">
      <h2>{recipe.title}</h2>
      <p>{recipe.photo}</p>
    </div>
  );
};

export default RecipeItem;
