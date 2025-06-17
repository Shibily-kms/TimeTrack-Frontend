import React, { useEffect, useState } from 'react'
import './profile-card.scss'
import { useSelector } from 'react-redux'
import Badge from '../../common/badge/Badge'
import { TimeBasedGreeting } from '../../../assets/javascript/date-helper'
import { GoDotFill } from "react-icons/go";
import { getUserProfileImagePath } from '../../../assets/javascript/find-helpers';
import { ui_version } from '../../../assets/javascript/const-data'
import { RiShieldStarLine } from "react-icons/ri";

const ProfileCard = () => {
    const { user } = useSelector((state) => state.userAuth)
    const userProfileImage = getUserProfileImagePath(user?.last_name);
    const [inWork, setInWork] = useState(false)
    const { workDetails } = useSelector((state) => state.workData)


    useEffect(() => {
        const lastPunchData = workDetails?.punch_list?.[workDetails?.punch_list.length - 1] || {}
        if (lastPunchData?.in && !lastPunchData?.out) {
            setInWork(true)
        } else if (lastPunchData?.out) {
            setInWork(false)
        }
        // eslint-disable-next-line
    }, [workDetails])


    return (
        <div className="profile-card-div">

            <div className="top-section-div">
                <div className="profile-image-div">
                    <img src={userProfileImage} alt='Profile' />
                </div>
                <div className="name-section-div">
                    <p>Hi, {TimeBasedGreeting()}</p>
                    <h3>{user?.first_name} {user?.last_name} {user?.pro_account?.[0] && <RiShieldStarLine />}</h3>
                    <p> ID : {user?.sid || 'NILL'} <GoDotFill /> {user?.designation || 'NILL'} </p>
                </div>
            </div>
            <div className="bottom-section-div">
                <div>
                    <p>Version {ui_version}</p>
                </div>
                <Badge className={inWork ? "md success-fill" : 'md error-fill'}
                    text={inWork ? "On work" : 'Out of work'} />
            </div>
        </div>
    )
}

export default ProfileCard