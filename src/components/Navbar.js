

// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import styles from './css/Navbar.module.css';

// function Navbar({ cartCount, products }) {
//   const [query, setQuery] = useState('');
//   const [showResults, setShowResults] = useState(false);

//   const filteredProducts = products.filter(product =>
//     product.product_name.toLowerCase().includes(query.toLowerCase())
//   );

//   const handleInputChange = (e) => {
//     setQuery(e.target.value);
//     setShowResults(true);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
    
//   };


//   const handleResultClick = () => {
//     setShowResults(false);
//     setQuery('');
//   };

// //   return (
// //     <nav className={styles.navbar}>
// //       <Link to="/" className={styles.logo}>DarazClone</Link>

// //       <div className="searchWrapper">
// //       <form className={styles.searchForm} onSubmit={handleSubmit} autoComplete="off">
// //         <input
// //           type="search"
// //           placeholder="Search products…"
// //           value={query}
// //           onChange={handleInputChange}
// //           onFocus={() => setShowResults(true)}
// //           onBlur={() => setTimeout(() => setShowResults(false), 200)} // delay so click works
// //           className={styles.searchInput}
// //         />
// //         <button type="submit">
// //           <i className="fas fa-search" />
// //         </button>

// //         {showResults && query && (
// //           <ul className={styles.searchResults}>
// //             {filteredProducts.length > 0 ? (
// //               filteredProducts.map(product => (
// //                 <li
// //                   key={product.product_id}
// //                   onMouseDown={handleResultClick} // onMouseDown prevents blur before click
// //                   className={styles.searchResultItem}
// //                 >
// //                   <Link to={`/product/${product.product_id}`}>
// //                     {product.product_name}
// //                   </Link>
// //                 </li>
// //               ))
// //             ) : (
// //               <li className={styles.noResults}>No products found</li>
// //             )}
// //           </ul>
// //         )}
// //       </form>
// //       </div>


// //       <div className={styles.linkGroup}>
// //         <Link to="/signin">Login</Link>
// //         <Link to="/signup">Sign Up</Link>
// //         <Link to="/cart">
// //           <i className="fas fa-shopping-cart" /> {cartCount}
// //         </Link>
// //       </div>
// //     </nav>
// //   );
// // }

// // export default Navbar;


// return (
//     <nav className={styles.navbar}>
//       <Link to="/" className={styles.logo}>DarazClone</Link>

//       <div className="searchWrapper">
//         <form className={styles.searchForm} onSubmit={handleSubmit} autoComplete="off">
//           <input
//             type="search"
//             placeholder="Search products…"
//             value={query}
//             onChange={handleInputChange}
//             onFocus={() => setShowResults(true)}
//             onBlur={() => setTimeout(() => setShowResults(false), 200)}
//             className={styles.searchInput}
//           />
//           <button type="submit">
//             <i className="fas fa-search" />
//           </button>
//         </form>

//         {showResults && query && (
//           <ul className={styles.searchResults}>
//             {filteredProducts.length > 0 ? (
//               filteredProducts.map((product) => (
//                 <li key={product.product_id} className={styles.searchResultItem}>
//                   <Link
//                     to={`/product/${product.product_id}`}
//                     onMouseDown={handleResultClick}
//                     style={{ textDecoration: 'none', color: 'black', display: 'block' }}
//                   >
//                     {product.product_name}
//                   </Link>
//                 </li>
//               ))
//             ) : (
//               <li className={styles.noResults}>No products found</li>
//             )}
//           </ul>
//         )}
//       </div>

//       <div className={styles.linkGroup}>
//         <Link to="/signin">Login</Link>
//         <Link to="/signup">Sign Up</Link>
//         <Link to="/cart">
//           <i className="fas fa-shopping-cart" /> {cartCount}
//         </Link>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;






// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import styles from './css/Navbar.module.css';

// function Navbar({ cartCount, products, user, setUser, setIsLoggedIn }) {
//   const [query, setQuery] = useState('');
//   const [showResults, setShowResults] = useState(false);

//   // Filter products based on search query
//   const filteredProducts = products.filter(product =>
//     product.product_name.toLowerCase().includes(query.toLowerCase())
//   );

//   // Handle input change
//   const handleInputChange = (e) => {
//     setQuery(e.target.value);
//     setShowResults(true);
//   };

//   const handleLogout = () => {
//   localStorage.removeItem('user');
//   setIsLoggedIn(false);
//   setUser(null);
// };


//   // Handle form submit (prevents reload)
//   const handleSubmit = (e) => {
//     e.preventDefault();
//   };

//   // Handle clicking on a search result
//   const handleResultClick = () => {
//     setShowResults(false);
//     setQuery('');
//   };


//   return (
//     <nav className={styles.navbar}>
//       <Link to="/" className={styles.logo}>DarazClone</Link>

//       <div className="searchWrapper">
//         <form className={styles.searchForm} onSubmit={handleSubmit} autoComplete="off">
//           <input
//             type="search"
//             placeholder="Search products…"
//             value={query}
//             onChange={handleInputChange}
//             onFocus={() => setShowResults(true)}
//             onBlur={() => setTimeout(() => setShowResults(false), 200)} // Delay so link click registers
//             className={styles.searchInput}
//           />
//           <button type="submit">
//             <i className="fas fa-search" />
//           </button>
//         </form>

//         {showResults && query && (
//           <ul className={styles.searchResults}>
//             {filteredProducts.length > 0 ? (
//               filteredProducts.map(product => (
//                 <li key={product.product_id} className={styles.searchResultItem}>
//                   <Link
//                     to={`/product/${product.product_id}`}
//                     onMouseDown={handleResultClick} // Important: use onMouseDown, not onClick
//                     style={{ textDecoration: 'none', color: 'black', display: 'block' }}
//                   >
//                     {product.product_name}
//                   </Link>
//                 </li>
//               ))
//             ) : (
//               <li className={styles.noResults}>No products found</li>
//             )}
//           </ul>
//         )}
//       </div>


// {/* 
//       <div className={styles.linkGroup}>
//           {user ? (
//             <>
//       <span style={{ marginRight: '10px' }}>Hello, {user.name}</span>
//       <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
//       </>
//       ) : (
//       <>
//         <Link to="/signin">Login</Link>
//         <Link to="/signup">Sign Up</Link>
//         <Link to="/cart">
//           <i className="fas fa-shopping-cart" /> {cartCount}
//         </Link>

//       </>
//       </div> */}





//       <div className={styles.linkGroup}>
//   {user ? (
//     <>
//       <span style={{ marginRight: '10px' }}>Hello, {user.name}</span>
//       <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
//     </>
//   ) : (
//     <>
//       <Link to="/signin">Login</Link>
//       <Link to="/signup">Sign Up</Link>
//     </>
//   )}

//   {/* Cart is shown always, whether user is logged in or not */}
//   <Link to="/cart">
//     <i className="fas fa-shopping-cart" /> {cartCount}
//   </Link>
// </div>

//     </nav>
//   );
// }

// export default Navbar;


// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import styles from './css/Navbar.module.css';

// function Navbar({ cartCount, products, user, setUser, setIsLoggedIn }) {
//   const [query, setQuery] = useState('');
//   const [showResults, setShowResults] = useState(false);

//   const filteredProducts = products.filter(product =>
//     product.product_name.toLowerCase().includes(query.toLowerCase())
//   );

//   const handleInputChange = (e) => {
//     setQuery(e.target.value);
//     setShowResults(true);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//   };

//   const handleResultClick = () => {
//     setQuery('');
//     setShowResults(false);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('user');
//     setUser(null);
//     setIsLoggedIn(false);
//   };

//   return (
//     <nav className={styles.navbar}>
//       <Link to="/" className={styles.logo}>DarazClone</Link>

//       <div className="searchWrapper">
//         <form className={styles.searchForm} onSubmit={handleSubmit} autoComplete="off">
//           <input
//             type="search"
//             placeholder="Search products…"
//             value={query}
//             onChange={handleInputChange}
//             onFocus={() => setShowResults(true)}
//             onBlur={() => setTimeout(() => setShowResults(false), 200)}
//             className={styles.searchInput}
//           />
//           <button type="submit"><i className="fas fa-search" /></button>
//         </form>

//         {showResults && query && (
//           <ul className={styles.searchResults}>
//             {filteredProducts.length > 0 ? (
//               filteredProducts.map(product => (
//                 <li key={product.product_id} className={styles.searchResultItem}>
//                   <Link
//                     to={`/product/${product.product_id}`}
//                     onMouseDown={handleResultClick}
//                     style={{ textDecoration: 'none', color: 'black', display: 'block' }}
//                   >
//                     {product.product_name}
//                   </Link>
//                 </li>
//               ))
//             ) : (
//               <li className={styles.noResults}>No products found</li>
//             )}
//           </ul>
//         )}
//       </div>

//       <div className={styles.linkGroup}>
//         {user ? (
//           <>
//             <span style={{ marginRight: '10px' }}>Hello, {user.name}</span>
//             <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
//           </>
//         ) : (
//           <>
//             <Link to="/signin">Login</Link>
//             <Link to="/signup">Sign Up</Link>
//           </>
//         )}
//         <Link to="/cart">
//           <i className="fas fa-shopping-cart" /> {cartCount}
//         </Link>
//       </div>
//     </nav>
//   );
// }

// export default Navbar;



import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './css/Navbar.module.css';

function Navbar({ cartCount, products, user, setUser, setIsLoggedIn }) {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);

  const filteredProducts = products.filter(product =>
    product.product_name.toLowerCase().includes(query.toLowerCase())
  );

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setShowResults(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleResultClick = () => {
    setQuery('');
    setShowResults(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.logo}>DarazClone</Link>

      <div className="searchWrapper">
        <form className={styles.searchForm} onSubmit={handleSubmit} autoComplete="off">
          <input
            type="search"
            placeholder="Search products…"
            value={query}
            onChange={handleInputChange}
            onFocus={() => setShowResults(true)}
            onBlur={() => setTimeout(() => setShowResults(false), 200)}
            className={styles.searchInput}
          />
          <button type="submit"><i className="fas fa-search" /></button>
        </form>

        {showResults && query && (
          <ul className={styles.searchResults}>
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => (
                <li key={product.product_id} className={styles.searchResultItem}>
                  <Link
                    to={`/product/${product.product_id}`}
                    onMouseDown={handleResultClick}
                    style={{ textDecoration: 'none', color: 'black', display: 'block' }}
                  >
                    {product.product_name}
                  </Link>
                </li>
              ))
            ) : (
              <li className={styles.noResults}>No products found</li>
            )}
          </ul>
        )}
      </div>

      <div className={styles.linkGroup}>
        {user ? (
          <>
            <span style={{ marginRight: '10px' }}>Hello, {user.name}</span>
            <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/signin">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        )}
        <Link to="/cart">
          <i className="fas fa-shopping-cart" /> {cartCount}
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
