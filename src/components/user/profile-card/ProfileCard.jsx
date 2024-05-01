import React from 'react'
import './profile-card.scss'
import { useSelector } from 'react-redux'
import Badge from '../../common/badge/Badge'
import { FaCheckCircle } from "react-icons/fa";
import { TimeBasedGreeting } from '../../../assets/javascript/date-helper'
import { GoDotFill } from "react-icons/go";
import { getUserProfileImagePath } from '../../../assets/javascript/find-helpers';
import { MdKeyboardDoubleArrowDown } from "react-icons/md";

const ProfileCard = () => {
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
                    <p> ID : {user?.sid || 'NILL'} <GoDotFill /> {user?.designation?.designation} </p>
                </div>
            </div>
            <div className="bottom-section-div">
                <Badge icon={<FaCheckCircle />} className={user?.status === 'Active' ? 'lg success-fill' : "sm error-fill"} text={user?.status || 'Left the company'} />
                <div>
                    <MdKeyboardDoubleArrowDown/>
                    <p>75h 30m / 85h 50m</p>
                </div>
            </div>
        </div>
    )
}

export default ProfileCard