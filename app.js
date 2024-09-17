const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 3000;
const routes = require('./server/routes');

app.use(cors());
app.use(express.json());

// Serve static files from the client app
app.use(express.static(path.join(__dirname, './client/dist')));

// api routes
app.use(routes);

// serve client routes as fall back
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './client/dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
