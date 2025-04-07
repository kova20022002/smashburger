import { useState } from "react";
import { useCart } from "../../services/CartContext";

function OtherProducts() {
  const { products, addToCartWithNotification } = useCart();

  // Get both types of fries
  const fries = products.filter(
    (product) =>
      product.categoryId === 2 ||
      product.categoryId === 4 ||
      product.categoryId === 5,
  );
  const drinks = products.filter((product) => product.categoryId === 3);

  // Track quantity for each fries item
  const [quantities, setQuantities] = useState({});

  // Handle quantity selection
  const handleQuantityChange = (friesId, quantity) => {
    setQuantities((prev) => ({
      ...prev,
      [friesId]: Number.parseInt(quantity, 10),
    }));
  };

  const addToCart = (item) => {
    const cartItem = {
      productId: item.id,
      price: item.price,
      quantity: quantities[item.id] || 1, // Default to 1 if not selected
    };

    addToCartWithNotification(cartItem, item.name);
  };

  return (
    <>
      <div className="py-12 bg-smash-gray">
        <h2 className="text-3xl font-bold text-center mb-8 text-smash-black">
          SIDES & EXTRAS
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
          {fries.map((friesItem) => (
            <div
              key={friesItem.id}
              className="bg-white rounded-xl overflow-hidden shadow-custom hover:shadow-hover transition-shadow duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  src={`/OtherProducts/${friesItem.name}.jpg`}
                  alt={friesItem.name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-smash-black to-transparent opacity-60" />
                <h2 className="absolute bottom-4 left-4 text-white text-xl font-bold">
                  {friesItem.name}
                </h2>
              </div>

              <div className="p-5">
                <p className="text-gray-600 mb-4">
                  {friesItem.description ||
                    "Our delicious crispy fries, the perfect companion to your burger."}
                </p>

                <div className="mb-4 flex items-center">
                  <h3 className="text-sm font-semibold mr-3 text-smash-black">
                    Quantity:
                  </h3>
                  <select
                    id={`quantity-${friesItem.id}`}
                    value={quantities[friesItem.id] || 1}
                    onChange={(e) =>
                      handleQuantityChange(friesItem.id, e.target.value)
                    }
                    className="w-20 p-2 border border-gray-300 rounded-lg bg-white text-gray-700 shadow-custom focus:ring-0 outline-none"
                  >
                    {[...Array(10)].map((_, i) => (
                      <option
                        key={`qty-${friesItem.id}-${i + 1}`}
                        value={i + 1}
                      >
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-smash-black">
                    ${friesItem.price}
                  </span>
                  <button
                    type="button"
                    onClick={() => addToCart(friesItem)}
                    className="bg-smash-black text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors shadow-custom"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* // Drinks */}

      <div className="py-12 bg-smash-gray">
        <h2 className="text-3xl font-bold text-center mb-8 text-smash-black">
          DRINKS
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
          {drinks.map((drink) => (
            <div
              key={drink.id}
              className="bg-white rounded-xl overflow-hidden shadow-custom hover:shadow-hover transition-shadow duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  src={`/OtherProducts/${drink.name}.jpg`}
                  alt={drink.name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-smash-black to-transparent opacity-60" />
                <h2 className="absolute bottom-4 left-4 text-white text-xl font-bold">
                  {drink.name}
                </h2>
              </div>

              <div className="p-5">
                <p className="text-gray-600 mb-4">
                  {drink.description ||
                    "Our delicious crispy fries, the perfect companion to your burger."}
                </p>

                <div className="mb-4 flex items-center">
                  <h3 className="text-sm font-semibold mr-3 text-smash-black">
                    Quantity:
                  </h3>
                  <select
                    id={`quantity-${drink.id}`}
                    value={quantities[drink.id] || 1}
                    onChange={(e) =>
                      handleQuantityChange(drink.id, e.target.value)
                    }
                    className="w-20 p-2 border border-gray-300 rounded-lg bg-white text-gray-700 shadow-custom focus:ring-0 outline-none"
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={`qty-${drink.id}-${i + 1}`} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-smash-black">
                    ${drink.price}
                  </span>
                  <button
                    type="button"
                    onClick={() => addToCart(drink)}
                    className="bg-smash-black text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors shadow-custom"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default OtherProducts;
