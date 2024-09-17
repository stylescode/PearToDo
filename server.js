const express = require('express');
const routes = require('./server/routes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(routes);

app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});