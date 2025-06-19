import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './css/Cart.module.css';

function Cart({ cart, setCart, isLoggedIn }) {
  const [quantities, setQuantities] = useState(cart.map(() => 1));
  const [isPaying, setIsPaying] = useState(false);
  const navigate = useNavigate();

  const updateQuantity = (idx, delta) => {
    setQuantities((prev) => {
      const updated = [...prev];
      updated[idx] = Math.max(1, updated[idx] + delta);
      return updated;
    });
  };

  const total = cart.reduce(
    (sum, p, idx) => sum + parseFloat(p.selling_price) * quantities[idx],
    0
  ).toFixed(2);

  const handlePay = async () => {
    if (!isLoggedIn) {
      alert('You must be signed in to proceed to checkout.');
      navigate('/signin');
      return;
    }

    setIsPaying(true);
    const payload = cart.map((item, idx) => ({
      ...item,
      quantity: quantities[idx],
    }));

    try {
      const res = await fetch('http://localhost:5000/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart: payload }),
      });

      if (res.ok) {
        alert('✅ Payment successful! Cart cleared.');
        setCart([]);
      } else {
        alert('❌ Something went wrong during checkout.');
      }
    } catch (err) {
      alert('❌ Network error.');
    } finally {
      setIsPaying(false);
    }
  };

  return (
     <div className="page">
    <div className={styles.cart}>
      <h2>Your Cart</h2>
      {cart.length === 0 && <p>No items added yet.</p>}
      {cart.map((p, idx) => (
        <div key={idx} className={styles.item}>
          <p>{p.name}</p>
          <p>₹{parseFloat(p.selling_price).toFixed(2)}</p>
          <div className={styles.quantityControls}>
            <button onClick={() => updateQuantity(idx, -1)}>-</button>
            <span className={styles.quantity}>{quantities[idx]}</span>
            <button onClick={() => updateQuantity(idx, 1)}>+</button>
          </div>
        </div>
      ))}
      {cart.length > 0 && (
        <>
          <h3>Total: ₹{total}</h3>
          <button
            onClick={handlePay}
            className={styles.payButton}
            disabled={isPaying}
          >
            {isPaying ? 'Processing...' : 'Pay'}
          </button>
        </>
      )}
    </div>
    </div>
  );
}

export default Cart;
