import React, {useState, useEffect} from "react";

const AuthContext = React.createContext({
    token: '',
    isLoggedIn: false,
    login: (token) => {},
    logout: () => {}
});

export const AuthContextProvider = (props) => {
    const initialToken = localStorage.getItem('token');
    const [token, setToken] = useState(initialToken);

    const userIsLoggedIn = !!token;
    const activeTime = 5 * 60 * 1000; // 5 minutes in milliseconds
    const currentTime = new Date().getTime();
    const expirationTime = currentTime + activeTime;

    // Calculating remaining time
    const calculateRemainingTime = () => {
        const storedExpirationTime = localStorage.getItem('expirationTime');
        const currentTime = new Date().getTime();
        return storedExpirationTime - currentTime;
    }

    const loginHandler = (token) => {
        setToken(token);
        localStorage.setItem('token', token);
    }

    const logoutHandler = () => {
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('expirationTime');
    }

    useEffect(() => {
        if(userIsLoggedIn){
            localStorage.setItem('expirationTime', expirationTime);
            const remainingTime = calculateRemainingTime();
            if(remainingTime > 0){
                const logoutTimer = setTimeout(logoutHandler, remainingTime);
                return () => clearTimeout(logoutTimer);
            } else {
                logoutHandler();
            }
        }
    },[userIsLoggedIn, expirationTime]);

    const contextValue = {
        token: token,
        isLoggedIn: userIsLoggedIn,
        login: loginHandler,
        logout: logoutHandler
    }

    return (
        <AuthContext.Provider value={contextValue}>
            {props.children}
        </AuthContext.Provider>
    )

}

export default AuthContext;