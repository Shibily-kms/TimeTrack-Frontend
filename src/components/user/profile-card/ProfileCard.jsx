import React from 'react'
import './profile-card.scss'
import { useSelector } from 'react-redux'
import Badge from '../../common/badge/Badge'
import { FaCheckCircle } from "react-icons/fa";
import { TimeBasedGreeting } from '../../../assets/javascript/date-helper'
import { GoDotFill } from "react-icons/go";

const ProfileCard = () => {
    const { user } = useSelector((state) => state.userAuth)

    function getUserProfileImagePath(last_name) {
        // Check if the user or user's last_name exists
        const firstLetter = last_name?.charAt(0)?.toUpperCase();

        if (firstLetter) {
            try {
                // Dynamically require the image based on the first letter
                return require(`../../../assets/images/profile-tamp/${firstLetter}.png`);
            } catch (error) {
                // If the specific image doesn't exist, fallback to the common image
                return require('../../../assets/images/profile-tamp/common.png');
            }
        } else {
            // If user or last_name is not defined, or the first letter could not be determined
            return require('../../../assets/images/profile-tamp/common.png');
        }
    }

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
                    <p> ID : {user?.staff_slNo || 'NILL'} <GoDotFill /> {user?.designation?.designation} </p>
                </div>
            </div>
            <div className="bottom-section-div">
                <p>{user?.address?.address}, {user?.address?.place}</p>
                <div>
                    <Badge icon={<FaCheckCircle />} className={user?.status === 'Active' ? 'sm success-fill' : "sm error-fill"} text={user?.status || 'Left the company'} />
                    <p>75h 30m / 85h 50m</p>
                </div>
            </div>
        </div>
    )
}

export default ProfileCard