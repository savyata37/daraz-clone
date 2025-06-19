import React from 'react';
import { Link } from 'react-router-dom';
import styles from './css/Navbar.module.css';


function Navbar({ cartCount }) {
  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.logo}>DarazClone</Link>
      <form className={styles.searchForm}>
        <input placeholder="Search products…" />
        <button type="submit"><i className="fas fa-search" /></button>
      </form>
      <div className={styles.linkGroup}>
        <Link to="/signin">Login</Link>
        <Link to="/signup">Sign Up</Link>
        <Link to="/cart">
          <i className="fas fa-shopping-cart" /> {cartCount}
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
