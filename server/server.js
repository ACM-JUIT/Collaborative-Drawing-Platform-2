const express = require('express');
const http = require('http');
const socketio =  require('socket.io');
const connectDB = require('./config/db');
const cors = require('cors');

const app = express();
const server = http.createServer();
const io = socketio(server);

connectDB();

app.use(express.json({ extended: false}));
app.use(cors());

app.use('/api/documents', require('./routes/main'));

// Socket.io Connection
io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('joinDocument', ({ documentId }) => {
        socket.join(documentId);
        console.log(`Joined document ${documentId}`);
    });

    socket.on('sendChanges', ({ documentId, changes }) => {
        socket.broadcast.to(documentId).emit('receiveChanges', changes);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));