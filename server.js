const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Serve static files from dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Serve all HTML files directly from dist
app.get('*.html', (req, res) => {
  const filePath = path.join(__dirname, 'dist', req.path);
  res.sendFile(filePath);
});

// Serve CSS files
app.get('*.css', (req, res) => {
  const filePath = path.join(__dirname, 'dist', req.path);
  res.sendFile(filePath);
});

// Serve JS files
app.get('*.js', (req, res) => {
  const filePath = path.join(__dirname, 'dist', req.path);
  res.sendFile(filePath);
});

// For all other routes, serve the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`AutoMinds server running on port ${PORT}`);
  console.log(`Serving from: ${path.join(__dirname, 'dist')}`);
});
