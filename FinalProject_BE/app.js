
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');

require('dotenv').config();

//Routers
const userRoutes = require('./src/routes/userRoutes');
const hotelRegister = require('./src/routes/hotelRegisterRoutes');
const hotelRoutes = require('./src/routes/hotelRoutes');
const authRoutes = require('./src/routes/authRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const bookingRoutes = require('./src/routes/bookingRoutes');
const loyaltyRoutes = require('./src/routes/loyaltyRoutes');
const reviewRoutes = require('./src/routes/reviewRoutes');
const searchRoutes = require('./src/routes/searchRoutes');

//middlewares
const logger = require('./src/middleware/logger');
const errorHandler = require('./src/middleware/errorHandler');

//db
const connectDB = require('./src/config/db.config');
connectDB(process.env.MONGO_URL);

// CORS Hardening: Required for the Cookie Approach
const corsOptions = {
    origin: process.env.ALLOWED_ORIGIN || 'http://localhost:4200', 
    credentials: true,               // Essential: Allows browser to send/receive cookies
    methods: 'GET,POST,PATCH,DELETE', 
    optionsSuccessStatus: 200        
};

app.use(cors(corsOptions)); // Apply CORS first

app.use('/uploads', express.static('uploads')); //for uploading the file

//logger
app.use(logger);
app.use(express.json()); //Set the request Body 
app.use(cookieParser()); // Parses cookies from browser into req.cookies

//Public Routes
app.use('/api/auth', authRoutes);   // For Login, Register, Logout


//Protected Routes
app.use('/api/booking', bookingRoutes);
app.use('/api/hotel/register', hotelRegister);
app.use('/api/hotel',hotelRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/admin', adminRoutes); // For Admin User Management
app.use('/api/user', userRoutes);   // For User Profile actions
app.use('/api/loyalty', loyaltyRoutes);
app.use('/api/review', reviewRoutes);


//Error Handling
app.use(errorHandler);

module.exports = app;