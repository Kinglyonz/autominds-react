const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Serve static files from dist directory
// Express will automatically serve index.html for / and all other .html/.css/.js files
app.use(express.static(path.join(__dirname, 'dist')));

app.listen(PORT, () => {
  console.log(`AutoMinds server running on port ${PORT}`);
  console.log(`Serving from: ${path.join(__dirname, 'dist')}`);
});
