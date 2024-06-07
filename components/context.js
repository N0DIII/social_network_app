import { createContext, useState } from 'react';
import { io } from 'socket.io-client';
import serverUrl from '../scripts/server_url';

const Context = createContext(false);
const socket = io.connect(serverUrl);

const Provider = ({ children }) => {
    const [userData, setUserData] = useState(false);
    const [error, setError] = useState([false, '']);
    const [success, setSuccess] = useState([false, '']);
    const [confirm, setConfirm] = useState([false]);

    return(
        <Context.Provider value={{ userData, setUserData, error, setError, success, setSuccess, confirm, setConfirm, socket }}>
            {children}
        </Context.Provider>
    )
}

export { Context, Provider };