const express = require("express");
const dotenv = require("dotenv");

const app = express();
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger Setup
const { swaggerSetup } = require('./config/swagger');
swaggerSetup(app);

const AuthRoutes = require('./routes/AuthRoutes')
const ProdukRoutes = require('./routes/ProdukRoutes')
const PelangganRoutes = require('./routes/PelangganRoutes')
const PenjualanRoutes = require('./routes/PenjualanRoutes')
const DetailPenjualanRoutes = require('./routes/DetailPenjualanRoutes')

app.use( AuthRoutes)
app.use( ProdukRoutes)
app.use( PelangganRoutes)
app.use( PenjualanRoutes)
app.use( DetailPenjualanRoutes)

app.get("/", (req, res) => {
  res.send("Server Is Running");
});

module.exports = app;
