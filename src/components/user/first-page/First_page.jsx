import React, { useEffect, useState } from 'react'
import './first-page.scss'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { userAxios } from '../../../config/axios'
import { setUser } from '../../../redux/features/user/authSlice'

function First_page() {
    const { user } = useSelector((state) => state.userAuth)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        userAxios.get(`/designations?id=${user?.designation?.id}`).then((response) => {
            if (user && !user?.designation?.allow_sales) {
                dispatch(setUser({
                    ...user,
                    designation: {
                        ...user.designation,
                        allow_sales: response.data.designation?.allow_sales || false,
                        auto_punch_out: response.data.designation?.auto_punch_out || '17:30',
                    }
                }))
            }
        })
    }, [])

    return (
        <div className='first-page-user'>
            <div className="container">
                <div className="top">
                    <h5>Designation : {user?.designation?.designation}</h5>
                    <h5>User name : {user?.user_name}</h5>
                </div>
                <div className="bottom">
                    <div className="boader">
                        <div className="button-div">
                            <button onClick={() => navigate('/enter-work-details')}>ENTER WORK DETAILS</button>
                        </div>
                        {user?.designation?.allow_sales ?
                            <div className="button-div">
                                <button onClick={() => window.open(`http://localhost:3000/?id=${user._id}`, '_blank')}>SALES</button>
                            </div>
                            : ""}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default First_page