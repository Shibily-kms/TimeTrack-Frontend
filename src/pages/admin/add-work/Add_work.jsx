import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Add_work_Comp from '../../../components/admin/add-work/Add_work'

function Add_work() {
    const location = useLocation()
    const navigate = useNavigate()
    console.log(location,'loc');
    const designation = location?.state 

    useEffect(() => {
        if (!designation) navigate('/admin')
    }, [])
    return (
        <div>
            <Add_work_Comp />
        </div>
    )
}

export default Add_work