import React, { useState } from 'react';
import DrawingCanvas from './components/DrawingCanvas';
import './App.css';

function App() {
    const [drawingId, setDrawingId] = useState('');
    const [isJoined, setIsJoined] = useState(false);

    const handleJoinRoom = () => {
        if (drawingId.trim() !== '') {
            setIsJoined(true);
        }
    };
    
    return (
        <div className="App">
            <header className="App-header">
                {!isJoined ? (
                    <>
                        <h1>{`Collaborate & Draw`}</h1>
                        <div className="join-room">
                            <input 
                                type="text" 
                                placeholder="Enter Drawing ID" 
                                value={drawingId} 
                                onChange={(e) => setDrawingId(e.target.value)} 
                            />
                            <button onClick={handleJoinRoom}>Join Room</button>
                        </div>
                    </>
                ) : (
                    <DrawingCanvas drawingId={drawingId} />
                )}
            </header>
        </div>
    );
}

export default App;
