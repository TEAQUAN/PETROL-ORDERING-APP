const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler'); 
const app = express();


// Load environment variables from .env file
dotenv.config();

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

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
const fuelTypeRoutes = require("./routes/fuelTypeRoutes");
const fetchStations = require("./routes/fetch-stations")
const fuelPriceRoute = require("./routes/fuelPriceRoute")

app.use('/auth', authRoutes);
app.use('/stations', stationRoutes);
app.use('/fuels', fuelRoutes);
app.use('/orders', orderRoutes);
app.use('/profile', profileRoutes);
app.use('/fuelType', fuelTypeRoutes);
app.use("/GetStations",fetchStations)
app.use("/fuel",fuelPriceRoute)
app.use(errorHandler)

// Start the server
const stations = ["Rainoil", "Conoil", "Eterna", "Total"]
console.log(`Server started on port `, stations.includes("Rainoil"))
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});