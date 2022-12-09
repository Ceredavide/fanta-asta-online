import React, { useEffect, useState } from 'react';

import ProposteView from '../ProposteView';

function Asta({ socket, user }) {

    const [astaState, setAstaState] = useState(null);
    const [currentSoccerPlayerState, setcurrentSoccerPlayerState] = useState(null)
    const [valueProposta, setValueProposta] = useState('');

    useEffect(() => {
        const astaListener = (data) => {
            setAstaState(data)
        };

        const currentSoccerPlayerListener = (data) => {
            const newArr = [...data.proposte].reverse()
            setcurrentSoccerPlayerState({...data, proposte: newArr})
        }

        socket.emit('get-asta-status');
        socket.emit("get-soccer-player-status")
        socket.on('update-asta-status', astaListener);
        socket.on('update-soccer-player-status', currentSoccerPlayerListener);
        

        return () => {
            socket.off('update-asta-status', astaListener);
        };
    }, [socket]);

    function selectGiocatore(giocatoreId) {
        socket.emit("select-giocatore", giocatoreId)
    }

    function leaveGiocatore() {
        socket.emit("leave-giocatore")
    }

    function sendProposta(e) {
        e.preventDefault();
        if (!astaState.highestProposta || valueProposta > currentSoccerPlayerState.highestProposta.value) {
            socket.emit('add-proposta', valueProposta);
        } else {
            alert("offerta troppo bassa mate")
        }
        setValueProposta('');
    }

    if (astaState?.isAstaOn) {
        if (!currentSoccerPlayerState || currentSoccerPlayerState.selectedSoccerPlayer === null) {
            return (
                <div>
                    {astaState.currentUser === user.nome ? <>
                        <div>Tocca a te scegliere il giocatore!</div>
                        <div>
                            {astaState.listone.map(giocatore => <button key={giocatore.Id} onClick={() => selectGiocatore(giocatore.Id)}>{giocatore.Nome}</button>)}
                        </div>
                    </> : `${astaState.currentUser} deve scegliere un giocatore`}
                </div>
            )
        } else {
            return (
                <div>
                    <ProposteView proposte={currentSoccerPlayerState.proposte} highestProposta={currentSoccerPlayerState.highestProposta} />
                    {currentSoccerPlayerState?.usersOut.includes(astaState.currentUser) === false &&
                        <div>
                            Quanti soldi vuoi mettere per {currentSoccerPlayerState.selectedSoccerPlayer.Nome}?
                            <form onSubmit={sendProposta}>
                                <input
                                    value={valueProposta}
                                    placeholder="Buttali sti cash"
                                    onChange={(e) => {
                                        setValueProposta(e.currentTarget.value);
                                    }}
                                />
                                <button type='submit'>Manda Proposta</button>
                            </form>
                            <button type='button' onClick={leaveGiocatore}>Lascia Giocatore</button>
                        </div>
                    }
                </div>
            )
        }
    } else {
        return <div>CT aspetta un attimo</div>
    }
}

export default Asta;