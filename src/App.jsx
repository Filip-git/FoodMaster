import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import MyProfile from './pages/MyProfile';
import AddRecipe from './pages/AddRecipe';
import NavBar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Footer from './components/Footer';
import Recipes from './pages/Recipes';
import About from './pages/About';
import AdminPanel from './pages/AdminPanel';


const App = () => {
  return (
    <Router>
      <div className="App">
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/about" element={<About />} />
          <Route path="/profile" element={<PrivateRoute><MyProfile /></PrivateRoute>} />
          <Route path="/add-recipe" element={<PrivateRoute><AddRecipe /></PrivateRoute>} />
          <Route path="/admin-panel" element={<PrivateRoute><AdminPanel /></PrivateRoute>} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
