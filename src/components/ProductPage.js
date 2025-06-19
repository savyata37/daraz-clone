
// src/components/ProductPage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Papa from 'papaparse';
import styles from './css/ProductPage.module.css';

function ProductPage({ addToCart }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch('/inventory.csv')
      .then((res) => res.text())
      .then((data) => {
        const parsed = Papa.parse(data, {
          header: true,
          skipEmptyLines: true,
        });

        const found = parsed.data.find((p) => p.product_id === id);
        setProduct(found);
      });
  }, [id]);

  if (!product) {
    return <div className={styles.page}>Loading or product not found...</div>;
  }

  return (
    <div className={styles.page}>
      <img
        src={product.image}
        alt={product.product_name}
        className={styles.image}
        onError={(e) => (e.target.src = '/placeholder.jpg')} // fallback
      />
      <div className={styles.info}>
        <h1>{product.product_name}</h1>
        <h2>₹{product.selling_price}</h2>
        <p><b>Description</b></p>
        <p>{product.description}</p>
        <p><b>Stock = </b>{product.stock_left}</p>
        <button className={styles.button} onClick={() => addToCart(product)}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductPage;
