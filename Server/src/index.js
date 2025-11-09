const express = require('express');
const cors = require('cors');

require("dotenv").config();
const connectDB = require('./config/db.config');


//* Routes Imports
const authRoutes = require('./routes/auth.routes');


const app = express();
const PORT = process.env.PORT || 4000;

//* Middleware
app.use(cors());
app.use(express.json());

//* Connect DB
connectDB();

app.get('/', (req, res) => {
    res.status(200).send('Welcome to Agriculter On SmartWay API 🚀 🚀');
});

//* Use Routes
app.use('/api/auth', authRoutes);



app.listen(PORT, "0.0.0.0", () =>
    console.log(`🚀 Server running at http://0.0.0.0:${PORT}`)
);