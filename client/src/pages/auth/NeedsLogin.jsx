import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const NeedsLogin = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(null);

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const response = await axios.get(
                    'http://localhost:8080/api/session'
                );
                setIsLoggedIn(response.data.isLoggedIn);
            } catch (error) {
                console.error('Error checking session:', error);
                setIsLoggedIn(false);
            }
        };
        checkLoginStatus();
    }, []);

    if (isLoggedIn === null) {
        return (
            <div>
                <h1>Loading...</h1>
            </div>
        );
    }

    return isLoggedIn ? children : <Navigate to="/login" replace />;
};

export default NeedsLogin;
