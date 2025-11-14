require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const farmRoutes = require('./routes/farmRoutes');

const app = express();

// Middleware
// CORS configuration - allow multiple origins for development and production
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173', // Vite default port
  'https://my-farm-app-nine.vercel.app',
  'https://my-farm-app-qczu.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean); // Remove undefined values

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow all Vercel preview deployments
    if (origin.includes('.vercel.app')) {
      return callback(null, true);
    }
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'My Farm API is running',
    version: '1.0.0'
  });
});

app.use('/api/farm', farmRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://Aliomran_11:aliomran11@bookstore.2p8vi6j.mongodb.net/my-farmn', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 API Base URL: http://localhost:${PORT}/api/farm`);
});

