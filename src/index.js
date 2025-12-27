const express = require("express");
const cors = require("cors");
const { getCorsOrigin, initEnv } = require("./config/env");

const app = express();


if (process.env.VERCEL !== '1') {
  try {
    require('dotenv').config();
  } catch (e) {
  }
}


try {
  initEnv();
} catch (error) {
  console.error(' Environment initialization failed:', error.message);
  if (process.env.NODE_ENV === 'production') {
    throw error;
  }
}

app.use(cors({
  origin: getCorsOrigin(),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: req.path
  });
});

module.exports = app;
