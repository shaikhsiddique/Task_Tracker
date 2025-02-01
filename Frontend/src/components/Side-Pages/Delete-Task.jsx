import React, { useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../config/axios';
import { UserContext } from '../../context/UserContext';

function Delete_Task() {
    const { id } = useParams();  
    const { user } = useContext(UserContext);
    const token = localStorage.getItem("Auth-Token");
    const navigate = useNavigate();

    useEffect(() => {
        axios
        .delete(`/task/delete/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(() => {
            navigate(-1); // Go back to the previous page
        })
        .catch((err) => {
            console.log(err);
        });
    }, [token, user, id, navigate]);

    return <div>Deleting Task...</div>;
}

export default Delete_Task;
