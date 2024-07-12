let ioInstance;

const initializeSocket = (io) => {
    ioInstance = io;
    io.on('connection', (socket) => {
        console.log('New client connected');

        socket.on('joinDrawing', ({ drawingId }) => {
            socket.join(drawingId);
            console.log(`Client joined drawing: ${drawingId}`);
        });

        socket.on('sendDrawingData', ({ drawingId, data }) => {
            socket.to(drawingId).emit('receiveDrawingData', data);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });
};

module.exports = {
    initializeSocket,
    ioInstance,
};
