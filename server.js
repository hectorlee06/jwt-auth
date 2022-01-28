const express = require('express');
const app = express();
const cors = require('cors');
const router = require('./routes/router.js');

const port = process.env.port || 3000;

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());

app.use('/api',router)

app.listen (port, () => {
  console.log (`Servidor en el Puerto ${port}`);
})
