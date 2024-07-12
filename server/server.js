const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const cors = require('cors');
const drawingRoutes = require('./routes/drawingRoutes');
const { initializeSocket } = require('./socket');
const PORT = 5000;

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

app.use(cors());
app.use(express.json());

app.use('/api/drawings', drawingRoutes);

initializeSocket(io);

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
