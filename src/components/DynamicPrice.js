

import React, { useEffect, useState } from "react";

function DynamicPrice({ productId, fallbackPrice, basePrice }) {
  const [priceData, setPriceData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!productId) return;

    let isMounted = true;
    const controller = new AbortController();

    // Timeout fallback after 6 seconds
    const timeoutId = setTimeout(() => {
      controller.abort();
      if (isMounted) {
        console.warn("⏱ Fallback price triggered:", productId);
        setError("Timeout. Showing fallback.");
        setPriceData({
          basePrice: parseFloat(basePrice).toFixed(2),
          finalPrice: (parseFloat(fallbackPrice) * 0.99).toFixed(2),
          discountPercent: 1,
          fallback: true,
        });
      }
    }, 6000);

    console.log(`🔄 Fetching price for: ${productId}`);

   

    fetch(`/api/pricing/${productId}`, {
      signal: controller.signal,
    })
      .then((res) => {
        clearTimeout(timeoutId);
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!isMounted) return;
        console.log("✅ Received pricing data:", data);
        setPriceData({
          basePrice: parseFloat(data.basePrice).toFixed(2),
          finalPrice: parseFloat(data.finalPrice).toFixed(2),
          discountPercent: data.discountPercent,
          fallback: false,
        });
        setError(null);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("❌ Price fetch error:", err.message);
        setError(err.message);
        setPriceData({
          basePrice: parseFloat(basePrice).toFixed(2),
          finalPrice: (parseFloat(fallbackPrice) * 0.99).toFixed(2),
          discountPercent: 1,
          fallback: true,
        });
      });

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [productId, fallbackPrice, basePrice]);

  if (!priceData) return <p>Loading price for {productId}...</p>;
  const { basePrice: bp, finalPrice, discountPercent, fallback } = priceData;

  return (
    <div>
      {error && <p style={{ color: "orange", fontSize: "0.9rem" }}>⚠ {error}</p>}
      {discountPercent > 0 ? (
        <>
          <p style={{ textDecoration: "line-through", color: "#888", margin: 0 }}>
            ₹{bp}
          </p>
          <p style={{ color: "#d32f2f", fontWeight: "bold", margin: 0 }}>
            ₹{finalPrice}
          </p>
          <span
            style={{
              backgroundColor: fallback ? "#ffd6d6" : "#ffe600",
              padding: "2px 6px",
              borderRadius: "4px",
              fontSize: "0.85rem",
              fontWeight: "bold",
              marginLeft: "8px",
            }}
          >
            {discountPercent}% OFF {fallback ? "(fallback)" : ""}
          </span>
        </>
      ) : (
        <p style={{ fontWeight: "bold", margin: 0 }}>₹{finalPrice}</p>
      )}
    </div>
  );
}

export default DynamicPrice;
