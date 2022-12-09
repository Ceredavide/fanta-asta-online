import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Asta from './components/asta';
import Dashboard from './components/dashboard';
import AuthInput from './components/AuthInput';


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
      <div className="container text-center">
        <header className="app-header mt-3 mb-5">
          Asta Fantacalcio {user ? `${user.nome}` : ""}
        </header>
        <div >
          {user ? user.nome === "Admin" ? <Dashboard socket={socket} /> : (
            <Asta socket={socket} user={user} setUser={setUser} />
          ) : (
            <AuthInput socket={socket} setUser={setUser} />
          )}
        </div>
      </div>
    );
  }

}

export default App;