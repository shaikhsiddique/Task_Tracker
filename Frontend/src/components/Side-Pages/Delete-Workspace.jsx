import React, { useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../config/axios';
import { UserContext } from '../../context/UserContext';

function Delete_Workspace() {
    const { id } = useParams();  
    const { user } = useContext(UserContext);
    const token = localStorage.getItem("Auth-Token");
    const navigate = useNavigate();

    useEffect(() => {
        axios
        .delete(`workspace/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((res) => {
            axios.post("/notification/create",{
                receiver : user._id, type : "notification", data:{
                  message :`Your Workspace "${res.data.workspace.name}" has deleted Successfully`,
                  sender: user,
                }
              },{
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }).then((res)=>{
                console.log(res.data);
              }).catch((err)=>{
                console.log(err)
              })
              res.data.workspace.members.forEach((usr)=>{
                console.log(usr);
                if(usr != res.data.workspace.admin){
                  axios.post("/notification/create",{
                    receiver : usr, type : "notification", data:{
                      message :` Workspace "${res.data.workspace.name}" has deleted by Admin`,
                      sender: user,
                    }
                  },{
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  }).then((res)=>{
                    console.log(res.data);
                  }).catch((err)=>{
                    console.log(err)
                  })
                }

              })
            navigate(-1); // Go back to the previous page
        })
        .catch((err) => {
            console.log(err);
        });
    }, [token, user, id, navigate]);

    return <div>Deleting Workspace...</div>;
}

export default Delete_Workspace;
