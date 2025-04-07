/* import { useState, useEffect } from "react";
import { fetchProducts } from "../services/fetchProducts"; */

import Menu from "../features/menu/Menu";

function Home() {
  // const [products, setProducts] = useState([]);

  /* useEffect(()=>{
    const getProducts = async () =>{
      const data = await fetchProducts();
      setProducts(data);
    }
    getProducts(); 
  }) */

  return (
    <div>
      <Menu />
    </div>
  );
}

export default Home;
