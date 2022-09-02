import React, { useEffect, useState } from 'react';

import ProposteView from '../ProposteView';

function Asta({ socket, user, setUser }) {

    const [astaState, setAstaState] = useState({});
    const [valueProposta, setValueProposta] = useState('');

    useEffect(() => {
        const astaListener = (data) => {
            const { proposte } = data
            if (proposte.length !== 0) {
                const highestProposta = proposte.splice(0, 1)[0]
                setAstaState({ ...data, highestProposta: highestProposta, proposte })
            } else {
                setAstaState(data)
            }
        };

        socket.on('update-asta-status', astaListener);
        // socket.on('deleteMessage', deleteMessageListener);
        socket.emit('get-asta-status');

        return () => {
            socket.off('update-asta-status', astaListener);
        };
    }, [socket]);

    function selectGiocatore(giocatore) {
        socket.emit("select-giocatore", giocatore)
    }

    function submitForm(e) {
        e.preventDefault();
        if (valueProposta > astaState.highestProposta.value) {
            socket.emit('send-proposta', valueProposta);
        } else {
            alert("offerta troppo bassa mate")
        }
        setValueProposta('');
    }

    if (astaState.isAstaOn) {
        if (astaState.giocatoreSelezionato === null) {
            return (
                <div>
                    {astaState.currentUser === user.nome ? <>
                        <div>Tocca a te scegliere il giocatore!</div>
                        <div>
                            {astaState.listone[astaState.categoriaGiocatori].map(giocatore => <button key={giocatore.Id} onClick={() => selectGiocatore(giocatore)}>{giocatore.Nome}</button>)}
                        </div>
                    </> : `${astaState.currentUser} deve scegliere un giocatore`}
                </div>
            )
        } else {
            return (
                <div>
                    Quanti soldi vuoi mettere per {astaState.giocatoreSelezionato.Nome}?
                    <ProposteView proposte={astaState.proposte} highestProposta={astaState.highestProposta} />
                    <form onSubmit={submitForm}>
                        <input
                            value={valueProposta}
                            placeholder="Buttali sti cash"
                            onChange={(e) => {
                                setValueProposta(e.currentTarget.value);
                            }}
                        />
                        <button type='submit'>Manda Proposta</button>
                    </form>
                </div>
            )
        }
    } else {
        return <div>CT aspetta un attimo</div>
    }
}

export default Asta;