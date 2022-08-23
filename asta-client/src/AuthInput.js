import React, { useState, useEffect } from 'react';
import './MessageInput.css';

const AuthInput = ({ socket, setUser }) => {

    const [value, setValue] = useState('');

    const submitForm = (e) => {
        e.preventDefault();
        socket.emit('check-auth', value);
        setValue('');
    };

    useEffect(() => {

        const handleAuth = (value) => {
            console.log(value)
            if (value === null) {
                alert("valore inserito errato, riprovare.")
            } else {
                alert("successo!")
                setUser(value)
            }
        }

        socket.on('res-auth', handleAuth);

        return () => {
            socket.off('res-auth', handleAuth);
        };
    }, [socket]);

    return (
        <form onSubmit={submitForm}>
            <input
                autoFocus
                value={value}
                placeholder="Inserisci il tuo codice"
                onChange={(e) => {
                    setValue(e.currentTarget.value);
                }}
            />
        </form>
    );
};

export default AuthInput;