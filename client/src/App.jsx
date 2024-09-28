import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const App = () => {
  const [message, setMessage] = useState('');
  const socket = io('http://localhost:3000');

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server', socket.id);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleChange = (e) => {
    setMessage(e.target.value); // Update the message state
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the form from reloading the page
    console.log('Message submitted:', message); // Log the message for now
    setMessage(''); // Clear the input after submission
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-red-600 text-4xl text-center m-4">Learning Socket.io</h1>

      <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4">
        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={handleChange}
          className="border border-gray-300 rounded px-4 py-2"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Send Message
        </button>
      </form>
    </div>
  );
};

export default App;
