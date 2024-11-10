import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const UserProfileAuth = ({ type = 'participant', children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userType, setUserType] = useState(null);

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const sessionResponse = await axios.get(
                    'http://localhost:8080/api/session'
                );
                setIsLoggedIn(sessionResponse.data.isLoggedIn);

                if (sessionResponse.data.isLoggedIn) {
                    const profileResponse = await axios.get(
                        'http://localhost:8080/api/user/profile'
                    );
                    setUserType(
                        profileResponse.data['description_of_org']
                            ? 'org'
                            : 'participant'
                    );
                }
            } catch (error) {
                console.error('Error checking session:', error);
            } finally {
                setIsLoading(false);
            }
        };
        checkLoginStatus();
    }, []);

    if (isLoading) {
        return <h1>Loading...</h1>;
    }

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    if (userType !== type) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default UserProfileAuth;
