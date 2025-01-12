import React, { useContext, useEffect } from 'react';
import axiosInstance from '../config/axios';
import { UserContext } from "../context/UserContext";
import { useNavigate } from 'react-router-dom';

function Logout() {
    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("Auth-Token");

        if (token) {
            axiosInstance.get('/user/logout', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((res) => {
                    console.log(res.data);
                    localStorage.removeItem("Auth-Token");
                    setUser(null);
                    navigate('/login');
                })
                .catch((err) => {
                    console.error(err);
                    setUser(null);
                    navigate('/login');
                });
        } else {
            setUser(null);
            navigate('/login');
        }
    }, [navigate, setUser]);

    return (
        <div>Logging out...</div>
    );
}

export default Logout;
