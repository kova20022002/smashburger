import { useContext } from "react";
import { AuthContext } from "./services/AuthContext"; // ✅ Import context
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./ui/Home";
import Menu from "./features/menu/Menu";
import Cart from "./features/cart/Cart";
import Login from "./features/user/Login";
import Signup from "./features/user/Signup";
import CreateOrder from "./features/order/CreateOrder";
import Order from "./features/order/Order";
import AppLayout from "./ui/AppLayout";
import AdminHome from "./ui/AdminHome";
import User from "./userProfile/User";
import { useCart } from "./services/CartContext";
import Notification from "./ui/Notification";

function App() {
  const { user } = useContext(AuthContext);
  const { notification, dismissNotification } = useCart();

  const router = createBrowserRouter(
    [
      {
        element: <AppLayout />,
        children: [
          {
            path: "/",
            element: user?.role === "admin" ? <AdminHome /> : <Home />,
          },
          { path: "/menu", element: <Menu /> },
          { path: "/cart", element: <Cart /> },
          { path: "/order/new", element: <CreateOrder /> },
          { path: "/order/:OrderId", element: <Order /> },
          { path: "/profile", element: <User /> },
        ],
      },
      { path: "/login", element: <Login /> },
      { path: "/signup", element: <Signup /> },
    ],
    {
      future: {
        v7_startTransition: true, // ✅ Enable React.startTransition for React Router v7
      },
    },
  );

  return (
    <>
      <RouterProvider router={router} />
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={dismissNotification}
        />
      )}
    </>
  );
}

export default App;
