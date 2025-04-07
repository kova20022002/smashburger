import { Link } from "react-router-dom";

function CartOverview() {
  return (
    <div>
      <p>Cart Overview</p>
      <Link to="/cart">Open Cart</Link>
    </div>
  );
}

export default CartOverview;
