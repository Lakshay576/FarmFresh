const express = require("express");
const session = require('express-session');
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const authRoutes = require("./route/authroutes.js");
const cropRoutes = require("./route/croproutes.js");
const orderRoutes = require("./route/orderRoutes.js");
const connectDB = require("./config/db.js");

connectDB();

dotenv.config();

const app = express();



app.use(cors({
  origin: ["http://localhost:5173", "https://your-frontend-url.vercel.app"], // your frontend origin
  credentials: true,
}));


app.use(session({
  secret: '74gfg7gf7g77gf7gf', 
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, 
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24,
  }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads/crops', express.static(path.join(__dirname, 'uploads/crops')));
app.use('/uploads/people', express.static(path.join(__dirname, 'uploads/people')));

app.use(express.static("uploads"));


app.use("/api/auth", authRoutes, cropRoutes, orderRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
