import React, { useState, useEffect, useMemo } from 'react';
import { io } from 'socket.io-client';

const App = () => {
  const [message, setMessage] = useState('');
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [room, setRoom] = useState('');
  const [socketID, setSocketID] = useState('');
  const [targetSocketID, setTargetSocketID] = useState('');
  const [joinedRoom, setJoinedRoom] = useState('');
  const socket = useMemo(() => io('http://localhost:3000'), []);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server', socket.id);
      setSocketID(socket.id);
    });

    socket.on('receive-message', (data) => {
      console.log('Received message:', data);
      setReceivedMessages((prevMessages) => [...prevMessages, data]);
    });

    socket.on('room-joined', (roomName) => {
      console.log(`Successfully joined room: ${roomName}`);
      setJoinedRoom(roomName);
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
    console.log(`Requested to join room: ${room}`);
    setRoom('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (targetSocketID) {
      socket.emit('message-to-socket', { message, targetSocketID });
      console.log(`Sent message to socket: ${targetSocketID}`);
    } else if (joinedRoom) {
      socket.emit('message-to-room', { message, room: joinedRoom });
      console.log(`Sent message to room: ${joinedRoom}`);
    } else {
      socket.emit('broadcast-message', { message });
      console.log('Sent broadcast message');
    }
    setMessage('');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-red-600 text-4xl text-center m-4">Learning Socket.io</h1>
      <h2 className="text-lg">Your Socket ID: {socketID}</h2>
      {joinedRoom && <h3 className="text-lg">Current Room: {joinedRoom}</h3>}

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