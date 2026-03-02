const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const { startRssService } = require('./services/rssService');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/geopolitics';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    // Start RSS Service after DB connection
    startRssService(io);
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);
  
  // Send the most recently fetched articles upon connection
  const LiveNews = require('./models/LiveNews');
  LiveNews.find().sort({ pubDate: -1 }).limit(50).lean().then(articles => {
    socket.emit('initial_articles', articles);
  }).catch(err => {
    console.error('Error fetching initial articles', err);
  });
  
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date() });
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
