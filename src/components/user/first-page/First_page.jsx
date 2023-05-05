import React from 'react'
import './first-page.scss'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function First_page() {
    const { user } = useSelector((state) => state.userAuth)
    const navigate = useNavigate()

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
                    </div>
                </div>
            </div>
        </div>
    )
}

export default First_page