import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import './css/DrawingCanvas.css';

const socket = io('http://localhost:5000');

const DrawingCanvas = ({ drawingId }) => {
    const canvasRef = useRef(null);
    const contextRef = useRef(null);

    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState('#000000');
    const [brushSize, setBrushSize] = useState(5);

    const [undoArray, setUndoArray] = useState([]);
    const [undoArrayIndex, setUndoArrayIndex] = useState(-1);

    //////////////////////////////////////////////////////////////////////////

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        contextRef.current = context;

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
    ///////////////////////////////////////////////////////////////////////

    const clearCanvas = () => {
        console.log('clear');
        const canvas = canvasRef.current;
        const context = contextRef.current;

        context.fillStyle = "white";
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillRect(0, 0, canvas.width, canvas.height);

        setUndoArray([]);
        setUndoArrayIndex(-1);
    };

    const undoDrawing = () => {
        if (undoArrayIndex == -1) return;
        const canvas = canvasRef.current;
        const context = contextRef.current;

        setUndoArrayIndex(prevUndoArrayIndex => {
            const newUndoArrayIndex = prevUndoArrayIndex - 1;

            if(undoArrayIndex > 0 ) { 
                const imageData = undoArray[newUndoArrayIndex];
                context.putImageData(imageData, 0, 0);
            } else {
                clearCanvas();
            }

            return newUndoArrayIndex;
        });

    }

    const startDraw = (e) => {
        setIsDrawing(true);
        draw(e);
    };

    const stopDraw = (e) => {
        const canvas = canvasRef.current;
        const context = contextRef.current;

        setIsDrawing(false);
        contextRef.current.beginPath();

        if (e.type != 'mouseout') {
            console.log(undoArrayIndex);

            setUndoArrayIndex(prevUndoArrayIndex => {
                const newUndoArrayIndex = prevUndoArrayIndex + 1;
                console.log(newUndoArrayIndex);

                const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                const newUndoArray = [...undoArray.slice(0, newUndoArrayIndex), imageData];
                setUndoArray(newUndoArray);
                console.log(undoArray);  

                return newUndoArrayIndex;
            });


        }
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const { offsetX, offsetY } = e.nativeEvent;
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.strokeStyle = color;
        contextRef.current.lineWidth = brushSize;
        contextRef.current.lineCap = 'round';
        contextRef.current.lineJoin = 'round';
        contextRef.current.stroke();
    };

    return (
        <div className="drawing-container">
            <h1 className="heading">Collaborate & Draw</h1>
            <canvas
                id='canvas'
                className='canvas'
                ref={canvasRef}
                width={window.innerWidth - 100}
                height={500}
                onMouseDown={startDraw}
                onMouseUp={stopDraw}
                onMouseMove={draw}
            />
            <div className='tools'>
                <button onClick={undoDrawing} type='button' className='button'>Undo</button>
                <button onClick={clearCanvas} type="button" className="button">Clear</button>
                <input type="color" className='color-picker' onChange={(e) => setColor(e.target.value)} />
                <input type="range" className='brush-size' min={1} max={30} value={brushSize} onChange={(e) => setBrushSize(e.target.value)} />
            </div>
        </div>
    );
};

export default DrawingCanvas;