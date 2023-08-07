import React, { useState } from 'react'
import './first-page.scss'
import Title from '../../common/title/Title'
import ChangePassword from '../modals/change-password/ChangePassword'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { IoCloseCircleOutline } from 'react-icons/io5'

function First_page() {
    const { user } = useSelector((state) => state.userAuth)
    const navigate = useNavigate()
    const [modal, setModal] = useState(null)

    return (
        <div className='first-page-user'>
            <div className="container">
                <div>
                    <Title name={`User name : ${user?.first_name ? user?.first_name + ' ' + user?.last_name : user?.user_name}`} designation={`Designation : ${user?.designation?.designation}`} />
                </div>
                <div className="bottom">
                    <div className="boader">
                        <div className="button-div">
                            <button onClick={() => navigate('/enter-work-details')}>ENTER WORK DETAILS</button>
                        </div>
                        {user?.designation?.allow_origins.includes('Sales') &&
                            <div className="button-div">
                                <button onClick={() => window.location.href = `https://www.sales.alliancewatersolutions.com?id=${user._id}`}>SALES</button>
                            </div>}
                        <div className="button-div">
                            <button onClick={() => setModal('CHANGE PASSWORD')}>CHANGE PASSWORD</button>
                        </div>
                    </div>
                </div>
            </div>
            {modal ?
                <>
                    <div className="model" >
                        <div className="boader">
                            <div className="shadow" onClick={() => setModal(null)}></div>
                            <div className="box">
                                <div className="header">
                                    <div className="title">
                                        <h5>{modal}</h5>
                                    </div>
                                    <div className="close-icon" onClick={() => setModal(null)}>
                                        <IoCloseCircleOutline />
                                    </div>
                                </div>
                                <div className="content">
                                    {modal === 'CHANGE PASSWORD' && <ChangePassword setModal={setModal} />}
                                </div>
                            </div>
                        </div>
                    </div>
                </> : ''}
        </div>
    )
}

export default First_page