const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const csv = require('csv-parser');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const USERS_CSV = 'USERID.csv';
const INVENTORY_CSV = 'inventory.csv';
const CUSTOMER_CSV = 'customer.csv';

// Utility: Read CSV file
const readCSV = (filePath) =>
  new Promise((resolve) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results));
  });

// ----------------------- USER SIGNUP -----------------------
app.post('/signup', (req, res) => {
  const { name, email, password } = req.body;
  const line = `${name},${email},${password}\n`;

  fs.appendFile(USERS_CSV, line, (err) => {
    if (err) return res.status(500).json({ error: 'Failed to save user.' });
    res.json({ success: true });
  });
});

// ----------------------- USER SIGNIN -----------------------
app.post('/signin', (req, res) => {
  const { email, password } = req.body;
  let found = false;

  fs.createReadStream(USERS_CSV)
    .pipe(csv(['name', 'email', 'password']))
    .on('data', (row) => {
      if (row.email === email && row.password === password) {
        found = true;
      }
    })
    .on('end', () => {
      if (found) {
        res.json({ success: true });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    });
});

// ----------------------- CHECKOUT + INVENTORY -----------------------
app.post('/checkout', async (req, res) => {
  const cart = req.body.cart;
  const inventoryPath = path.join(__dirname, INVENTORY_CSV);
  const customerPath = path.join(__dirname, CUSTOMER_CSV);

  let inventory = await readCSV(inventoryPath);

  // Update inventory
  const updatedInventory = inventory.map((item) => {
    const cartItem = cart.find((c) => c.id === item.id);
    if (cartItem) {
      const newQty = Math.max(0, parseInt(item.stock) - parseInt(cartItem.quantity || 1));
      return { ...item, stock: newQty };
    }
    return item;
  });

  // Write updated inventory
  const header = 'id,name,stock';
  const inventoryCsv = updatedInventory.map(item => `${item.id},${item.name},${item.stock}`).join('\n');
  fs.writeFileSync(inventoryPath, `${header}\n${inventoryCsv}`);

  // Append order to customer.csv
  const orderLines = cart.map(c => `${c.id},${c.name},${c.quantity || 1},${c.price}`).join('\n');
  fs.appendFileSync(customerPath, `${orderLines}\n`);

  res.json({ success: true });
});

// ----------------------- START SERVER -----------------------
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
