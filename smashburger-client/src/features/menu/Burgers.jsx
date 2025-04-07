import { useState, useEffect } from "react";
import { fetchProducts } from "../../services/fetchProducts";
import { useCart } from "../../services/CartContext";

function Burgers() {
  const { products, setProducts, addToCartWithNotification } = useCart();
  const [selectedOptions, setSelectedOptions] = useState({});
  const PAN_PRICE = 2.9;

  const handleSelection = (burgerName, productId, size, variantId, price) => {
    setSelectedOptions((prev) => {
      const currentOptions = prev[burgerName] || {};
      return {
        ...prev,
        [burgerName]: {
          ...currentOptions,
          size,
          variantId: Number.parseInt(variantId, 10),
          price: Number.parseFloat(price),
          productId: Number.parseInt(productId, 10),
        },
      };
    });
  };

  const handleQuantityChange = (burgerName, quantity) => {
    setSelectedOptions((prev) => {
      const currentOptions = prev[burgerName] || {};
      return {
        ...prev,
        [burgerName]: {
          ...currentOptions,
          quantity: Number.parseInt(quantity, 10),
        },
      };
    });
  };

  const handlePanSelection = (burgerName, pan) => {
    setSelectedOptions((prev) => {
      const currentOptions = prev[burgerName] || {};
      return {
        ...prev,
        [burgerName]: {
          ...currentOptions,
          pan: pan ? Number.parseInt(pan, 10) : null,
        },
      };
    });
  };

  const addToCart = (burger) => {
    if (!selectedOptions[burger.name]) {
      alert("Please select a size first!");
      return;
    }

    const options = selectedOptions[burger.name];
    const quantity = options.quantity || 1;

    let itemPrice = options.price;

    if (options.pan === 6) {
      itemPrice += PAN_PRICE;
    }

    const cartItem = {
      productId: options.productId,
      variantId: options.variantId,
      pan: options.pan || null,
      quantity: quantity,
      price: itemPrice,
    };
    console.log()

    addToCartWithNotification(cartItem, burger.name);
  };

  useEffect(() => {
    const getProducts = async () => {
      const data = await fetchProducts();
      setProducts(data);
    };
    getProducts();
  }, [setProducts]);

  const burgers = products.filter((product) => product.categoryId === 1);

  const getDisplayPrice = (burger) => {
    const options = selectedOptions[burger.name];
    if (!options) {
      return burger.size[0]?.price || 0;
    }

    let basePrice = options.price;

    if (options.pan === 6) {
      basePrice += PAN_PRICE;
    }

    return basePrice;
  };

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold text-center mb-10 text-smash-black">
        SIGNATURE BURGERS
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
        {burgers.map((burger) => (
          <div
            key={burger.id}
            className="bg-white rounded-xl overflow-hidden shadow-custom hover:shadow-hover transition-shadow duration-300"
          >
            <div className="relative h-52 overflow-hidden">
              <img
                className="w-full h-full object-cover"
                src={`/${burger.name}/${burger.name}-${selectedOptions[burger.name]?.size || "Double"}.jpg`}
                alt={burger.name}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-smash-black to-transparent opacity-60" />
              <div className="absolute bottom-0 left-0 w-full p-4">
                <h2 className="text-white text-xl font-bold">{burger.name}</h2>
                <p className="text-white text-sm opacity-90 mt-1 line-clamp-2">
                  {burger.ingredients}
                </p>
              </div>
            </div>

            <div className="p-5 space-y-5">
              <div>
                <h3 className="text-sm font-semibold mb-2 text-smash-black">
                  Choose Size:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {burger.size.map((burgerSize) => (
                    <label
                      key={burgerSize.id}
                      htmlFor={`${burger.id}-${burgerSize.size}`}
                      className={`px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                        selectedOptions[burger.name]?.size === burgerSize.size
                          ? "bg-smash-yellow text-smash-black font-medium shadow-custom"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <input
                        type="radio"
                        id={`${burger.id}-${burgerSize.size}`}
                        name={`size-${burger.id}`}
                        value={burgerSize.size}
                        checked={
                          selectedOptions[burger.name]?.size === burgerSize.size
                        }
                        onChange={() =>
                          handleSelection(
                            burger.name,
                            burger.id,
                            burgerSize.size,
                            burgerSize.id,
                            burgerSize.price,
                          )
                        }
                        className="sr-only"
                      />
                      {burgerSize.size}
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center">
                  <h3 className="text-sm font-semibold mr-3 text-smash-black">
                    Qty:
                  </h3>
                  <select
                    id={`quantity-${burger.id}`}
                    value={selectedOptions[burger.name]?.quantity || "1"}
                    onChange={(e) =>
                      handleQuantityChange(burger.name, e.target.value)
                    }
                    className="w-16 p-2 border border-gray-300 rounded-lg bg-white text-gray-700 shadow-custom focus:ring-0 outline-none"
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={`qty-${burger.id}-${i + 1}`} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <label
                  htmlFor={`pan-${burger.id}`}
                  className={`inline-flex items-center px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                    selectedOptions[burger.name]?.pan === 6
                      ? "bg-smash-yellow text-smash-black font-medium shadow-custom"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <input
                    type="checkbox"
                    id={`pan-${burger.id}`}
                    checked={selectedOptions[burger.name]?.pan === 6}
                    onChange={() =>
                      handlePanSelection(
                        burger.name,
                        selectedOptions[burger.name]?.pan === 6 ? null : 6,
                      )
                    }
                    className="sr-only"
                  />
                  <span className="flex items-center text-sm">
                    {selectedOptions[burger.name]?.pan === 6 && (
                      <svg
                        className="w-4 h-4 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    + SmashburgerPan ({PAN_PRICE.toFixed(2)} KM)
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div className="text-smash-black">
                  <span className="text-xl font-bold">
                    {getDisplayPrice(burger).toFixed(2)} KM
                  </span>
                  <span className="text-gray-500 text-sm ml-1">/ each</span>
                  {selectedOptions[burger.name]?.quantity > 1 && (
                    <div className="text-sm text-gray-600">
                      Total:{" "}
                      {(
                        getDisplayPrice(burger) *
                        selectedOptions[burger.name]?.quantity
                      )}{" "}
                      KM
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => addToCart(burger)}
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
  );
}

export default Burgers;
