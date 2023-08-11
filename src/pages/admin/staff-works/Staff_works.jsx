import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Header from '../../../components/admin/header/Header'
import TopBar from '../../../components/admin/staff-work/TopBar'
import WorkAnalyze from '../../../components/admin/staff-work/WorkAnalyze'

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
            <div >
                <TopBar />
            </div>
            <div >
                <WorkAnalyze />
            </div>
        </div>
    )
}

export default Staff_works