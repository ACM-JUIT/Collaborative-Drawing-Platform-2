import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import './css/DrawingCanvas.css';

const socket = io('http://localhost:5000');

const DrawingCanvas = ({ drawingId }) => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('#000000');
    const [brushSize, setBrushSize] = useState(5);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        socket.emit('joinDrawing', { drawingId });

        const handleReceiveDrawingData = (data) => {
            const image = new Image();
            image.onload = () => {
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.drawImage(image, 0, 0);
            };
            image.src = data;
        };

        socket.on('receiveDrawingData', handleReceiveDrawingData);

        const loadDrawingState = async () => {
            try {
                const res = await axios.get(`http://192.168.1.10:5000/api/drawings/state/${drawingId}`);
                if (res.data) {
                    const image = new Image();
                    image.onload = () => {
                        context.clearRect(0, 0, canvas.width, canvas.height);
                        context.drawImage(image, 0, 0);
                    };
                    image.src = res.data;
                }
            } catch (err) {
                console.error(err);
            }
        };

        loadDrawingState();

        return () => {
            socket.off('receiveDrawingData', handleReceiveDrawingData);
        };
    }, [drawingId]);

    const handleMouseDown = (e) => {
        setIsDrawing(true);
        draw(e);
    };

    const handleMouseUp = () => {
        setIsDrawing(false);
        const data = canvasRef.current.toDataURL();
        socket.emit('sendDrawingData', { drawingId, data });
    };

    const handleMouseMove = (e) => {
        if (isDrawing) {
            draw(e);
        }
    };

    const draw = (e) => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        context.lineWidth = brushSize;
        context.lineCap = 'round';
        context.strokeStyle = color;

        context.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        context.stroke();
        context.beginPath();
        context.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    };

    return (
        <div className="drawing-container">
            <div className="toolbar">
                <label htmlFor="colorPicker">Color:</label>
                <input
                    id="colorPicker"
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                />
                <label htmlFor="brushSize">Brush Size:</label>
                <input
                    id="brushSize"
                    type="range"
                    min="1"
                    max="20"
                    value={brushSize}
                    onChange={(e) => setBrushSize(e.target.value)}
                />
            </div>
            <canvas
                ref={canvasRef}
                width={800}
                height={600}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                className="drawing-canvas"
            />
        </div>
    );
};

export default DrawingCanvas;
