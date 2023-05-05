import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Add_work_Comp from '../../../components/admin/add-work/Add_work'
import Header from '../../../components/admin/header/Header'

function Add_work() {
    const location = useLocation()
    const navigate = useNavigate()
    const designation = location?.state

    useEffect(() => {
        if (!designation) navigate('/admin')
    }, [])
    return (
        <div>
            <div className="header-div">
                <Header />
            </div>
            <div className="bottom-div">
                <Add_work_Comp />
            </div>
        </div>
    )
}

export default Add_work