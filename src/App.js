// import React, { useState } from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import Navbar from './components/Navbar';
// import Footer from './components/Footer';
// import ProductPage from './components/ProductPage';
// import Cart from './components/Cart';
// import SignUp from './components/SignUp';
// import Home from './components/Home';
// import SignIn from './components/SignIn';
// import './App.css';

// function App() {
//   const [cart, setCart] = useState([]);
//   const [isLoggedIn, setIsLoggedIn] = useState(false); // ✅ Track login state

//   const addToCart = (product) => {
//     setCart((prev) => [...prev, product]);
//   };

//   return (
//     <>
//       <Navbar cartCount={cart.length} />
//       <Routes>
//         <Route path="/" element={<Home addToCart={addToCart} />} />
//         <Route path="/product/:id" element={<ProductPage addToCart={addToCart} />} />
//         <Route
//           path="/cart"
//           element={<Cart cart={cart} setCart={setCart} isLoggedIn={isLoggedIn} />} // ✅ Pass to Cart
//         />
//         <Route
//           path="/signin"
//           element={<SignIn setIsLoggedIn={setIsLoggedIn} />} // ✅ Pass to SignIn
//         />
//         <Route path="/signup" element={<SignUp />} />
//         <Route path="*" element={<Navigate to="/" />} />
//       </Routes>
//       <Footer />
//     </>
//   );
// }

// export default App;


import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProductPage from './components/ProductPage';
import Cart from './components/Cart';
import SignUp from './components/SignUp';
import Home from './components/Home';
import SignIn from './components/SignIn';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Adjust path if CSV is in public folder
    Papa.parse('/products.csv', {
      download: true,
      header: true, // Important: treat first row as headers
      complete: (results) => {
        // results.data is an array of objects
        setProducts(results.data);
      },
      error: (error) => {
        console.error('Error loading CSV:', error);
      },
    });
  }, []);

  const addToCart = (product) => {
    setCart((prev) => [...prev, product]);
  };

  return (
    <>
      <Navbar cartCount={cart.length} />
      <Routes>
        <Route path="/" element={<Home addToCart={addToCart} products={products} />} />
        <Route path="/product/:id" element={<ProductPage products={products} addToCart={addToCart} />} />
        <Route path="/cart" element={<Cart cart={cart} setCart={setCart} isLoggedIn={isLoggedIn} />} />
        <Route path="/signin" element={<SignIn setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
