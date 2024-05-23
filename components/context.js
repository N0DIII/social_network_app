import { createContext, useState } from 'react';

const Context = createContext(false);

const Provider = ({ children }) => {
    const [userData, setUserData] = useState(false);
    const [error, setError] = useState([false, '']);

    return(
        <Context.Provider value={{ userData, setUserData, error, setError }}>
            {children}
        </Context.Provider>
    )
}

export { Context, Provider };