import React, { useEffect, useState } from 'react'
import './profile-card.scss'
import { useSelector } from 'react-redux'
import Badge from '../../common/badge/Badge'
import { TimeBasedGreeting } from '../../../assets/javascript/date-helper'
import { GoDotFill } from "react-icons/go";
import { getUserProfileImagePath } from '../../../assets/javascript/find-helpers';
import { ui_version } from '../../../assets/javascript/const-data'
import { ttSv2Axios } from '../../../config/axios'
import Modal from '../../../components/common/modal/Modal'
import SingleContact from '../my-account-sub/SingleContact'

const ProfileCard = () => {
    const { user } = useSelector((state) => state.userAuth)
    const userProfileImage = getUserProfileImagePath(user?.last_name);
    const [userData, setUserData] = useState({})
    const [inWork, setInWork] = useState(false)
    const { workDetails } = useSelector((state) => state.workData)
    const [modal, setModal] = useState({ status: false })

    const alertFunction = (primary_number) => {
        if (primary_number?.number && !primary_number?.verified) {
            setModal({
                status: true, title: 'Verify your number', content: <SingleContact label={'primary_number'} type={'mobile'}
                    contact={primary_number} setModal={setModal} setUserData={setUserData} />
            })
        }
    }

    useEffect(() => {
        let numberObj = null
        ttSv2Axios.get(`/worker/account/${user?.acc_id}?initial=Yes`).then((response) => {
            setUserData(response?.data)
            numberObj = response?.data?.primary_number
        })

        const timer = setTimeout(() => {
            alertFunction(numberObj)
        }, 5000);

        return () => clearTimeout(timer);
        // eslint-disable-next-line
    }, []);

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
            <Modal modal={modal} setModal={setModal} />
            <div className="top-section-div">
                <div className="profile-image-div">
                    <img src={userProfileImage} alt='Profile' />
                </div>
                <div className="name-section-div">
                    <p>Hi, {TimeBasedGreeting()}</p>
                    <h3>{user?.first_name} {user?.last_name}</h3>
                    <p> ID : {userData?.sid || 'NILL'} <GoDotFill /> {userData?.designation || 'NILL'} </p>
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