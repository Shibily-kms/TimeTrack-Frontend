import React, { useEffect, useState } from 'react'
import './first-page.scss'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { userAxios } from '../../../config/axios'

function First_page() {
    const { user } = useSelector((state) => state.userAuth)
    const navigate = useNavigate()
    const [sales, setSales] = useState(false)

    useEffect(() => {
        userAxios.get(`/designations?id=${user?.designation?.id}`).then((response) => {

            if (response?.data?.designation?.allow_sales) {
                setSales(true)
            } else {
                setSales(false)
            }
        })
    }, [user])

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
                        {sales ?
                            <div className="button-div">
                                <button onClick={() => window.open(`https://www.sales.alliancewatersolutions.com?id=${user._id}`, '_blank')}>SALES</button>
                                {/* <button onClick={() => window.open(`http://localhost:3000/?id=${user._id}`, '_blank')}>SALES</button> */}
                            </div>
                            : ""}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default First_page