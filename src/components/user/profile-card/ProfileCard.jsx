import React from 'react'
import './profile-card.scss'
import { useSelector } from 'react-redux'
import Badge from '../../common/badge/Badge'
import { FaCheckCircle } from "react-icons/fa";
import { TimeBasedGreeting } from '../../../assets/javascript/date-helper'
import { GoDotFill } from "react-icons/go";
import { getUserProfileImagePath } from '../../../assets/javascript/find-helpers';
import { ui_version } from '../../../assets/javascript/const-data'
import { FaCheck, FaTimes } from "react-icons/fa";

const ProfileCard = ({ data, inWork }) => {
    const { user } = useSelector((state) => state.userAuth)



    const userProfileImage = getUserProfileImagePath(user?.last_name);

    return (
        <div className="profile-card-div">
            <div className="top-section-div">
                <div className="profile-image-div">
                    <img src={userProfileImage} alt='Profile' />
                </div>
                <div className="name-section-div">
                    <p>Hi, {TimeBasedGreeting()}</p>
                    <h3>{user?.first_name} {user?.last_name}</h3>
                    <p> ID : {data?.sid || 'NILL'} <GoDotFill /> {data?.designation || 'NILL'} </p>
                </div>
            </div>
            <div className="bottom-section-div">
                <div>
                    <p>Version {ui_version}</p>
                </div>
                <Badge icon={inWork ? <FaCheck /> : <FaTimes />} className={inWork ? "md success-fill" : 'md error-fill'}
                    text={inWork ? "On work" : 'Out of work'} />
            </div>
        </div>
    )
}

export default ProfileCard