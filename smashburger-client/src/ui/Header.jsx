import { useContext, useState } from "react";
import { AuthContext } from "../services/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../services/CartContext";

function Header() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { cart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleSignup = () => {
    navigate("/signup");
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Helper function to determine if a link is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-smash-yellow shadow-custom sticky top-0 z-10">
      <div className="container mx-auto px-10 ">
        <div className="flex justify-between items-center ml-10">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="/logo-removebg-black.png" alt="logo" className="w-28" />
            <img src="/logo.png" alt="logo" className="w-40" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/menu"
              className={`text-smash-black font-medium transition-colors relative ${
                isActive("/menu")
                  ? "text-smash-black font-bold after:absolute after:bottom-[-8px] after:left-0 after:w-full after:h-[3px] after:bg-smash-black after:rounded-full"
                  : "hover:text-gray-700"
              }`}
            >
              Menu
            </Link>
            <Link
              to="/cart"
              className={`text-smash-black font-medium transition-colors relative ${
                isActive("/cart")
                  ? "text-smash-black font-bold after:absolute after:bottom-[-8px] after:left-0 after:w-full after:h-[3px] after:bg-smash-black after:rounded-full"
                  : "hover:text-gray-700"
              }`}
            >
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-smash-black text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </div>
            </Link>
            {user && (
              <Link
                to="/profile"
                className={`text-smash-black font-medium transition-colors relative ${
                  isActive("/profile")
                    ? "text-smash-black font-bold after:absolute after:bottom-[-8px] after:left-0 after:w-full after:h-[3px] after:bg-smash-black after:rounded-full"
                    : "hover:text-gray-700"
                }`}
              >
                <div className="flex">
                  My profile
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                </div>
              </Link>
            )}
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-smash-black font-medium">
                  {user.name}
                </span>
                <button
                  type="button"
                  onClick={logout}
                  className="bg-smash-black text-white px-4 py-2 rounded-lg hover:bg-opacity-80 transition-colors shadow-custom"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={handleLogin}
                  className="bg-smash-black text-white px-4 py-2 rounded-lg hover:bg-opacity-80 transition-colors shadow-custom"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={handleSignup}
                  className="bg-transparent border-2 border-smash-black text-smash-black px-4 py-2 rounded-lg hover:bg-smash-black hover:text-white transition-colors shadow-custom"
                >
                  Register
                </button>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden text-smash-black"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden pt-4 pb-2 space-y-4">
            <Link
              to="/menu"
              className={`block font-medium py-2 ${
                isActive("/menu")
                  ? "text-smash-black font-bold"
                  : "text-smash-black"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Menu
            </Link>
            <Link
              to="/cart"
              className={`font-medium py-1 relative flex items-center ${
                isActive("/cart")
                  ? "text-smash-black font-bold"
                  : "text-smash-black"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              Cart
              {cart.length > 0 && (
                <span className="ml-2 bg-smash-black text-white text-xs font-bold rounded-full h-5 w-5 inline-flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Link>
            {/* Show My Profile only if the user is logged in */}
            {user && (
              <Link
                to="/profile"
                className={`text-smash-black font-medium transition-colors relative ${
                  isActive("/profile")
                    ? "text-smash-black font-bold after:absolute after:bottom-[-8px] after:left-0 after:w-full after:h-[3px] after:bg-smash-black after:rounded-full"
                    : "hover:text-gray-700"
                }`}
              >
                <div className="flex">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                  My profile
                </div>
              </Link>
            )}

            {user ? (
              <div className="space-y-2">
                <div className="text-smash-black font-medium py-2">
                  {user.name}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="bg-smash-black text-white px-4 py-2 rounded-lg w-full"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    handleLogin();
                    setMobileMenuOpen(false);
                  }}
                  className="bg-smash-black text-white px-4 py-2 rounded-lg w-full"
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleSignup();
                    setMobileMenuOpen(false);
                  }}
                  className="bg-transparent border-2 border-smash-black text-smash-black px-4 py-2 rounded-lg w-full hover:bg-smash-black hover:text-white transition-colors"
                >
                  Register
                </button>
              </div>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}

export default Header;
