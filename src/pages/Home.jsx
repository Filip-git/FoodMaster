import RecipeList from '../components/RecipeList';

const Home = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl">Welcome to FoodMaster</h1>
      <RecipeList />
    </div>
  );
};

export default Home;

