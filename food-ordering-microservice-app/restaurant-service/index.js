const express = require('express');
const app = express();
app.use(express.json());

const PORT = 3001;

const restaurants = [
  { id: 1, name: 'Pizza Palace', cuisine: 'Italian' },
  { id: 2, name: 'Sushi World', cuisine: 'Japanese' },
  { id: 3, name: 'Burger Hub', cuisine: 'American' }
];

app.get('/viewallrestaurant', (req, res) => {
  res.status(200).json({ message: 'List of all restaurants', data: restaurants });
});

app.get('/searchrestaurant', (req, res) => {
  const { name } = req.query;
  const result = restaurants.filter(r =>
    r.name.toLowerCase().includes((name || '').toLowerCase())
  );
  res.status(200).json({ message: `Search results for "${name}"`, data: result });
});

app.listen(PORT, () => {
  console.log(`Restaurant Service is running on http://localhost:${PORT}`);
});