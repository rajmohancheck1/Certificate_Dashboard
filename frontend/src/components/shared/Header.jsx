import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400 text-white shadow-lg">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-white hover:text-blue-100 transition-all transform hover:scale-105">
              CertifyMe
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`${isActive('/') ? 'text-white font-semibold' : 'text-blue-100'} hover:text-white transition-all transform hover:-translate-y-0.5`}
            >
              Home
            </Link>
            <Link 
              to="/services" 
              className={`${isActive('/services') ? 'text-white font-semibold' : 'text-blue-100'} hover:text-white transition-all transform hover:-translate-y-0.5`}
            >
              Services
            </Link>
            <Link 
              to="/about" 
              className={`${isActive('/about') ? 'text-white font-semibold' : 'text-blue-100'} hover:text-white transition-all transform hover:-translate-y-0.5`}
            >
              About
            </Link>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to={user?.role === 'admin' ? '/admin/dashboard' : '/my-applications'}
                  className="text-blue-100 hover:text-white transition-all transform hover:-translate-y-0.5"
                >
                  {user?.role === 'admin' ? 'Dashboard' : 'My Applications'}
                  
                </Link>
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-all transform hover:-translate-y-0.5 shadow-md hover:shadow-lg"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/auth/login"
                  className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-all transform hover:-translate-y-0.5 shadow-md hover:shadow-lg"
                >
                  Login
                </Link>
                <Link
                  to="/auth/register"
                  className="px-4 py-2 bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-800 transition-all transform hover:-translate-y-0.5 shadow-md hover:shadow-lg"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;