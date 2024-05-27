import React from 'react'
import './profile-card.scss'
import { getUserProfileImagePath } from '../../../assets/javascript/find-helpers';

const ProfileCard = ({ full_name, description, rightContent }) => {

    const userProfileImage = getUserProfileImagePath(full_name);

    return (
        <div className="profile-card-dash-div">
            <div className="left-div">
                <div className="image-div">
                    <img src={userProfileImage} alt='Profile' />
                </div>
                <div className="name-div">
                    <h4>{full_name}</h4>
                    <p>{description}</p>
                </div>
            </div>
            <div className="right-div">
                {rightContent}
            </div>
        </div>
    )
}

export default ProfileCard