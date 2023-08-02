import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Header from '../../../components/admin/header/Header'
import StaffTable from '../../../components/admin/staff-work/Staff_work_table'

function Staff_works() {
    const location = useLocation()
    const navigate = useNavigate()
    const staff_works = location?.state

    useEffect(() => {
        if (!staff_works && typeof staff_works !== "object") navigate('/admin')
        // eslint-disable-next-line
    }, [])
    return (
        <div>
            <div className="header-div">
                <Header />
            </div>
            <div className="bottom-div">
                <StaffTable />
            </div>
        </div>
    )
}

export default Staff_works