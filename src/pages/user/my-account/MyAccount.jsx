import React, { useEffect } from 'react'
import { useLocation, useNavigate, Outlet } from 'react-router-dom'
import './my-account.scss'
import { getUserProfileImagePath } from '../../../assets/javascript/find-helpers';
import { useSelector } from 'react-redux'

const MyAccount = ({ setPageHead }) => {
    const navigate = useNavigate()
    const { user } = useSelector((state) => state.userAuth)
    const userProfileImage = getUserProfileImagePath(user?.last_name);
    const location = useLocation();
    const lastPath = location.pathname.split('/').filter(Boolean).pop();

    useEffect(() => {

        if (!['profile', 'your-device', 'security-privacy', 'origin-access'].includes(lastPath)) {
            navigate('/my-account/profile')
        }

        setPageHead({ title: '' })

        // eslint-disable-next-line
    }, [])

    return (
        <div className="my-account-div">
            <div className="profile-div">
                <div className="image-section-div">
                    <div className="image-div">
                        <img src={userProfileImage} alt="Profile" />
                        {/* <div className="camera-icon">
                            <TbCamera />
                        </div> */}
                    </div>
                </div>
                <div className="name-section">
                    <h2>{user?.first_name + ' ' + user?.last_name}</h2>
                    <p>{user?.designation}</p>
                </div>
                <div className="sub-menu-div">
                    <div className={lastPath === 'profile' ? "item-div active-item" : 'item-div'} onClick={() => navigate('/my-account/profile')}>
                        <p>Profile</p>
                        <span></span>
                    </div>
                    <div className={lastPath === 'your-device' ? "item-div active-item" : 'item-div'} onClick={() => navigate('/my-account/your-device')}>
                        <p>Your Devices</p>
                        <span></span>
                    </div>
                    <div className={lastPath === 'security-privacy' ? "item-div active-item" : 'item-div'} onClick={() => navigate('/my-account/security-privacy')}>
                        <p>Security & Privacy</p>
                        <span></span>
                    </div>
                </div>
            </div>
            <div className="list-details-div">
                <Outlet />
            </div>
        </div>
    )
}

export default MyAccount