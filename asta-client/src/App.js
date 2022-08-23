import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import AuthInput from './AuthInput';
import Messages from './Messages';
import MessageInput from './MessageInput';

import './App.css';

function App() {
  const [socket, setSocket] = useState(null);
  const [user, setUser] = useState(null)

  useEffect(() => {
    // creo e setto socket
    const newSocket = io(`http://${window.location.hostname}:3000`);
    setSocket(newSocket);

    return () => newSocket.close();
  }, [setSocket]);

  if (!socket) {
    return <div>Loading</div>
  }
  else {
    return (
      <div className="App">
        <header className="app-header">
          React Chat
        </header>
        {socket ? user ? (
          <div className="chat-container">
            <Messages socket={socket} />
            <MessageInput socket={socket} />
          </div>
        ) : (
          <AuthInput socket={socket} setUser={setUser} />
        ) : <div>Loading</div>}
      </div>
    );
  }

}

export default App;