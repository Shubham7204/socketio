import React from 'react'
import {io} from 'socket.io-client'
const App = () => {

  const socket = io('http://localhost:3000')
  
  return (
    <div>
      <h1 className='text-red-600 text-4xl text-center m-4' >Learning Socket.io</h1>
    </div>
  )
}

export default App