import React from 'react';
import { Link } from 'react-router-dom';
import styles from './css/ProductCard.module.css'; 


function ProductCard({ product, addToCart }) {
  return (
     <div className="page">
    <div className={styles.card}>
      <Link to={`/product/${product.id}`}>
        <img src={product.img} alt={product.name} className={styles.image} />
      </Link>
      <h3 className={styles.name}>{product.name}</h3>
      <p className={styles.price}>₹{product.price}</p>
      <button className={styles.button} onClick={() => addToCart(product)}>Add to Cart</button>
    </div>
    </div>
  );
}

export default ProductCard;
