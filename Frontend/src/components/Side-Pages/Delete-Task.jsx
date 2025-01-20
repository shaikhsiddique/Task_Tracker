import React from 'react'
import { useParams } from 'react-router-dom'

function Delete_Task() {
    const { id } = useParams();  
    console.log(id)
  return (
    <div>Delete_Task</div>
  )
}

export default Delete_Task