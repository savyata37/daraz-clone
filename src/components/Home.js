// import React, { useEffect, useState } from 'react';
// import Papa from 'papaparse';
// import ProductCard from './ProductCard';
// import styles from './css/Home.module.css';

// function Home({ addToCart }) {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetch('/inventory.csv')
//       .then(res => res.text())
//       .then(csvText => {
//         Papa.parse(csvText, {
//           header: true,
//           skipEmptyLines: true,
//           complete: (result) => {
//             const parsed = result.data.map(row => ({
//               id: row.product_id?.trim() || '',
//               name: row.product_name?.trim() || '',
//               img: row.image?.trim() || '',            // Use image path as is
//               price: parseFloat(row.selling_price?.trim() || '0'),
//               description: row.description?.trim() || '',
//               brand: row.brand_name?.trim() || '',
//               stock: parseInt(row.stock_left?.trim() || '0', 10),
//               category: row.product_category?.trim() || '',
//               restockThreshold: parseInt(row.restock_threshold?.trim() || '0', 10),
//               restockDate: row.last_restocked_date?.trim() || '',
//               salesVolume: parseInt(row.sales_volume?.trim() || '0', 10),
//             }));

//             // Filter out invalid products (must have name, image, and price > 0)
//             const validProducts = parsed.filter(p => p.name && p.img && p.price > 0);

//             setProducts(validProducts);
//             setLoading(false);
//           },
//           error: (error) => {
//             console.error('Error parsing CSV:', error);
//             setLoading(false);
//           }
//         });
//       })
//       .catch(error => {
//         console.error('Error fetching CSV:', error);
//         setLoading(false);
//       });
//   }, []);

//   if (loading) return <p>Loading products...</p>;
//   if (products.length === 0) return <p>No products available.</p>;

//   return (
//     <div className={styles.productGrid}>
//       {products.map(product => (
//         <ProductCard key={product.id} product={product} addToCart={addToCart} />
//       ))}
//     </div>
//   );
// }

// export default Home;



import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import ProductCard from './ProductCard';
import styles from './css/Home.module.css';

function Home({ addToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/inventory.csv')
      .then(res => res.text())
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            const parsed = result.data.map(row => ({
              id: row.product_id?.trim() || '',
              name: row.product_name?.trim() || '',
              img: row.image?.trim() || '',
              price: parseFloat(row.selling_price?.trim() || '0'),
              description: row.description?.trim() || '',
              brand: row.brand_name?.trim() || '',
              stock: parseInt(row.stock_left?.trim() || '0', 10),
              category: row.product_category?.trim() || '',
              restockThreshold: parseInt(row.restock_threshold?.trim() || '0', 10),
              restockDate: row.last_restocked_date?.trim() || '',
              salesVolume: parseInt(row.sales_volume?.trim() || '0', 10),
            }));

            const validProducts = parsed.filter(p => p.name && p.img && p.price > 0);
            setProducts(validProducts);
            setLoading(false);
          },
          error: (error) => {
            console.error('Error parsing CSV:', error);
            setLoading(false);
          }
        });
      })
      .catch(error => {
        console.error('Error fetching CSV:', error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="page"><p>Loading products...</p></div>;
  if (products.length === 0) return <div className="page"><p>No products available.</p></div>;

  return (
    <div className="page">
      <div className={styles.productGrid}>
        {products.map(product => (
          <ProductCard key={product.id} product={product} addToCart={addToCart} />
        ))}
      </div>
    </div>
  );
}

export default Home;
