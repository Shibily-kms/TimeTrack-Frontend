import React, { useEffect } from 'react'
import './dashboard.scss'
import { setAdminActivePage } from '../../../redux/features/user/systemSlice'
import { useDispatch } from 'react-redux'

const Dashboard = ({ setPageHead }) => {
    const dispatch = useDispatch()


    useEffect(() => {
        dispatch(setAdminActivePage('dashboard'))
        setPageHead({ title: 'Dashboard' })

        // eslint-disable-next-line
    }, [])

    return (
        <div className='dashboard-div'>
        </div>
    )
}

export default Dashboard