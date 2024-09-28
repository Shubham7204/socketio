import React, { useEffect } from 'react';
import { io } from 'socket.io-client';

const App = () => {
  const socket = io('http://localhost:3000');

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server', socket.id);
    });

    socket.on('welcome', (message) => {
      console.log(message);
    });

    return () => {
      socket.disconnect(); // Clean up the socket connection when the component unmounts
    };
  }, []);

  return (
    <div>
      <h1 className='text-red-600 text-4xl text-center m-4'>Learning Socket.io</h1>
    </div>
  );
};

export default App;
