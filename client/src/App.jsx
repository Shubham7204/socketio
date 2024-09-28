import React, { useState, useEffect, useMemo } from 'react';
import { io } from 'socket.io-client';

const App = () => {
  const [message, setMessage] = useState('');
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [room, setRoom] = useState('');
  const [socketID, setSocketID] = useState('');
  const socket = useMemo(() => io('http://localhost:3000'), []);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server', socket.id);
    });

    socket.on('user-id', (id) => {
      setSocketID(id); // Set the socket ID for the user
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

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit('message', { message, to: room }); // Emit the message to the specified user
    setMessage(''); // Clear the input after submission
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-red-600 text-4xl text-center m-4">Learning Socket.io</h1>
      <h2 className="text-lg">Your Socket ID: {socketID}</h2>

      <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4">
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={handleChange}
          className="border border-gray-300 rounded px-4 py-2"
        />
        <input
          type="text"
          placeholder="Enter recipient Socket ID..."
          value={room}
          onChange={handleRoomChange}
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
