import { Link, useLocation } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../utils/firebase';

const Navbar = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userDocRef = doc(firestore, 'users', currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            setIsAdmin(currentUser.uid === 'svzsUSB4dxNTA23eULPRvxNkdnn2');
            localStorage.setItem('isLoggedIn', 'true');
            setUser(currentUser);
            console.log("Current User UID:", currentUser.uid);
            console.log("Current User Email:", currentUser.email);
            console.log('is admin:', currentUser.uid === 'svzsUSB4dxNTA23eULPRvxNkdnn2');
          } else {
            console.log('User document does not exist');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        localStorage.setItem('isLoggedIn', 'false');
        setUser(null);
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const handleLogout = () => {
    auth.signOut().then(() => {
      localStorage.setItem('isLoggedIn', 'false');
      navigate('/login');
    });
  };

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">FoodMaster</span>
        </Link>
        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          {!user ? (
            <>
              <Link to="/signup">
                <button type="button" className="text-white mr-2 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                  Get started
                </button>
              </Link>
              <Link to="/login">
                <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                  Login
                </button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/add-recipe">
                <button type="button" className="text-white mr-3 bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-400 dark:hover:bg-blue-500 dark:focus:ring-blue-600">
                  Add new recipe
                </button>
              </Link>
              <button onClick={handleLogout} type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                Logout
              </button>
            </>
          )}
          <button data-collapse-toggle="navbar-cta" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-cta" aria-expanded="false">
            <span className="sr-only">Open main menu</span>
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" d="M1 1h15M1 7h15M1 13h15" />
            </svg>
          </button>
        </div>
        <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-cta">
          <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <Link to="/" className={`block py-2 px-3 md:p-0 rounded ${location.pathname === '/' ? 'text-white bg-blue-700 md:bg-transparent md:text-blue-700 md:dark:text-blue-500' : 'text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700'}`} aria-current="page">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className={`block py-2 px-3 md:p-0 rounded ${location.pathname === '/about' ? 'text-white bg-blue-700 md:bg-transparent md:text-blue-700 md:dark:text-blue-500' : 'text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700'}`}>
                About
              </Link>
            </li>
            <li>
              <Link to="/recipes" className={`block py-2 px-3 md:p-0 rounded ${location.pathname === '/recipes' ? 'text-white bg-blue-700 md:bg-transparent md:text-blue-700 md:dark:text-blue-500' : 'text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700'}`}>
                Recipes
              </Link>
            </li>
            {isAdmin && (
              <li>
                <Link to="/admin-panel" className={`block py-2 px-3 md:p-0 rounded ${location.pathname === '/admin-panel' ? 'text-white bg-blue-700 md:bg-transparent md:text-blue-700 md:dark:text-blue-500' : 'text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700'}`}>
                  Admin
                </Link>
              </li>
            )}
            {user && (
              <li>
                <Link to="/profile" className={`block py-2 px-3 md:p-0 rounded ${location.pathname === '/profile' ? 'text-white bg-blue-700 md:bg-transparent md:text-blue-700 md:dark:text-blue-500' : 'text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700'}`}>
                  Profile
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
