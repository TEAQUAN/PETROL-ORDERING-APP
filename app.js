const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler'); 
const path = require('path');
const app = express();


// Load environment variables from .env file
dotenv.config();

const apiKey = process.env.API_KEY;
console.log(apiKey);

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(express.static("frontend"))
app.use(cors());
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', express.static('uploads'));
// Database connection
const db = require('./config/db');
mongoose.connect(db.mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB Connection Error:', err));

// Routes
const authRoutes = require('./routes/authRoutes');
const stationRoutes = require('./routes/stationRoutes');
const fuelRoutes = require('./routes/fuelRoutes');
const orderRoutes = require('./routes/orderRoutes');
const profileRoutes = require('./routes/profileRoutes');
const fetchStations = require("./routes/fetch-stations")
const AdminRoute = require("./routes/AdminRoute")

app.use('/auth', authRoutes);
app.use('/stations', stationRoutes);
app.use('/fuels', fuelRoutes);
app.use('/orders', orderRoutes);
app.use('/profile', profileRoutes);
app.use('/Admin', AdminRoute);
app.use("/GetStations",fetchStations)

app.use("*", (req, res) =>{
  res.sendFile(path.resolve("frontend/Home.html"))
})

app.use(errorHandler)

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});