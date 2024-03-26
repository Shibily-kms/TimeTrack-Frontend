import React, { useState } from 'react'
import './single-page.scss'
import { useNavigate } from 'react-router-dom'
import { RiLogoutCircleLine } from 'react-icons/ri'
import { useDispatch, useSelector } from 'react-redux'
import { logOut } from '../../../redux/features/admin/adminAuthSlice'
import { MdOutlineArrowBackIos } from 'react-icons/md'

const AdminPage = ({ titleArray, children }) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { admin } = useSelector((state) => state.adminAuth)

    const handleLogOut = () => {
        dispatch(logOut())
        window.location.href = 'http://localhost:3000/'
    }

    return (
        <div className='page-boarder'>
            <div className="header-div">
                <div className="header">
                    {/* <div className="back-div">
                        <button onClick={() => navigate(-1)}><MdOutlineArrowBackIos /></button>
                    </div> */}
                    <div className="left" onClick={() => navigate(`/admin?id=${admin?._id}`)}>
                        <h3>Purifier Admin</h3>
                    </div>
                    <div className="right">
                        <button onClick={handleLogOut}><RiLogoutCircleLine /> Quit</button>
                    </div>
                </div>
            </div>
            <div className="body-div container">
                {titleArray?.[0] &&
                    <div className="title-div">
                        {titleArray.map((title, index) => <h5 key={index}>{title}</h5>)}
                    </div>
                }

                <div className="children-div">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default AdminPage