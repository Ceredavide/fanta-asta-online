import React, { useEffect, useState } from 'react';

import ProposteView from '../ProposteView';

function Dashboard({ socket }) {

  const [activeUsers, setActiveUsers] = useState([]);
  const [astaState, setAstaState] = useState({})

  useEffect(() => {
    const activeUsersListener = (activeUsers) => {
      setActiveUsers(activeUsers);
    };

    const astaListener = (data) => {
        setAstaState(data)
    };

    socket.emit('get-active-users')
    socket.emit('get-asta-status')
    socket.on('change-active-users', activeUsersListener);
    socket.on('update-asta-status', astaListener);

    return () => {
      socket.off('change-active-users', activeUsersListener);
      socket.off('update-asta-status', astaListener);
    };
  }, [socket]);

  function activeAsta() {
    socket.emit("active-asta")
  }

  console.log(astaState)

  return (
    <div className="message-list">
      <div className="fs-4">Utenti Attivi:
        {activeUsers.map((activeUser) => <div key={activeUser} className="badge bg-success text-wrap m-1">
          {activeUser}
        </div>)}
      </div>
      {astaState.isAstaOn ? <div>
        <p class="fs-4">Utente che deve scegliere il giocatore: {astaState.currentUser}</p>
        <ProposteView proposte={astaState.proposte} highestProposta={astaState.highestProposta} />
      </div> : <button type="button" className="btn btn-primary" onClick={activeAsta}>Comincia Asta</button>}
    </div>
  );
}

export default Dashboard;