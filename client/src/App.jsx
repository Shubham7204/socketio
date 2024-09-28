import React, { useState, useEffect, useMemo } from 'react';
import { io } from 'socket.io-client';

const App = () => {
  const [message, setMessage] = useState('');
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [room, setRoom] = useState('');
  const [socketID, setSocketID] = useState('');
  const [targetSocketID, setTargetSocketID] = useState(''); // For sending message to a specific socket ID
  const socket = useMemo(() => io('http://localhost:3000'), []);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server', socket.id);
      setSocketID(socket.id); // Set the user's socket ID
    });

    socket.on('receive-message', (data) => {
      console.log('Received message:', data);
      setReceivedMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleRoomChange = (e) => {
    setRoom(e.target.value);
  };

  const handleTargetSocketChange = (e) => {
    setTargetSocketID(e.target.value);
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    socket.emit('join-room', room);
    console.log(`Joined room: ${room}`);
    setRoom(''); // Clear the room input after joining
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { message, room }; // Emit the message to the specified room
    if (targetSocketID) {
      // If a target socket ID is provided, send the message to that specific socket
      socket.emit('message-to-socket', { message, targetSocketID });
    } else {
      socket.emit('message', data); // Send message to the room if no target is specified
    }
    setMessage(''); // Clear the input after submission
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-red-600 text-4xl text-center m-4">Learning Socket.io</h1>
      <h2 className="text-lg">Your Socket ID: {socketID}</h2>

      <form onSubmit={handleJoinRoom} className="flex flex-col items-center space-y-4">
        <input
          type="text"
          placeholder="Enter room name..."
          value={room}
          onChange={handleRoomChange}
          className="border border-gray-300 rounded px-4 py-2"
        />
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          Join Room
        </button>
      </form>

      <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4 mt-4">
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={handleChange}
          className="border border-gray-300 rounded px-4 py-2"
        />
        <input
          type="text"
          placeholder="Enter target socket ID..."
          value={targetSocketID}
          onChange={handleTargetSocketChange}
          className="border border-gray-300 rounded px-4 py-2"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Send Message
        </button>
      </form>

      <div className="mt-6">
        <h2 className="text-2xl">Messages:</h2>
        <ul>
          {receivedMessages.map((msg, index) => (
            <li key={index} className="mt-2 text-lg">
              {msg}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
