import Burgers from "./Burgers";
import OtherProducts from "./OtherProducts";
import { Link } from "react-router-dom";
import { useCart } from "../../services/CartContext";

function Menu() {
  const { cart } = useCart();

  return (
    <div>
      <div className="bg-smash-yellow py-10 rounded-2xl shadow-lg mb-2">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-smash-black mb-4">
            SMASHBURGER MENU
          </h1>
          <p className="text-xl text-smash-black max-w-2xl mx-auto">
            Handcrafted burgers made with 100% Angus beef, smashed to
            perfection, and served with our signature sides.
          </p>
        </div>
      </div>

      <Burgers />
      <OtherProducts />

      {cart.length > 0 && (
        <div className="fixed bottom-4 right-4 md:hidden z-30">
          <Link
            to="/cart"
            className="bg-smash-black text-white rounded-full w-14 h-14 flex items-center justify-center shadow-hover"
            aria-label="Go to cart"
          >
            <div className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
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
              <span className="absolute -top-2 -right-2 bg-smash-yellow text-smash-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cart.length}
              </span>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Menu;
