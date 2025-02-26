import React, { useEffect, useState } from 'react'
import './profile-card.scss'
import { useDispatch, useSelector } from 'react-redux'
import Badge from '../../common/badge/Badge'
import { TimeBasedGreeting } from '../../../assets/javascript/date-helper'
import { GoDotFill } from "react-icons/go";
import { getUserProfileImagePath } from '../../../assets/javascript/find-helpers';
import { ui_version } from '../../../assets/javascript/const-data'
import { ttSv2Axios } from '../../../config/axios'
import Modal from '../../../components/common/modal/Modal'
import SingleContact from '../my-account-sub/SingleContact'
import { toast } from '../../../redux/features/user/systemSlice'

const ProfileCard = () => {
    const { user } = useSelector((state) => state.userAuth)
    const userProfileImage = getUserProfileImagePath(user?.last_name);
    const dispatch = useDispatch()
    const [userData, setUserData] = useState({})
    const [inWork, setInWork] = useState(false)
    const { workDetails } = useSelector((state) => state.workData)
    const [modal, setModal] = useState({ status: false })
    const [verifyContacts, setVerifyContact] = useState({})

    const handlePopupModalClose = (obj) => {
        if (!verifyContacts?.primary_number?.verified) {
            dispatch(toast.push.error({ message: 'You need to be verified first to proceed.' }))
            return
        }
        setModal(obj)
    }

    const primaryNumberVerify = (primary_number) => {
        setModal({
            status: true, title: 'Verify Primary number', content: <SingleContact label={'primary_number'} type={'mobile'}
                contact={primary_number} setModal={setModal} setUserData={setUserData} />
        })
    }

    const whatsappNumberVerify = (whatsapp_number) => {
        setModal({
            status: true, title: 'Verify Whatsapp number', content: <SingleContact label={'whatsapp_number'} type={'whatsapp'}
                contact={whatsapp_number} setModal={setModal} setUserData={setUserData} />
        })
    }

    useEffect(() => {
        let contacts = {}
        ttSv2Axios.get(`/worker/account/${user?.acc_id}?initial=Yes`).then((response) => {
            setUserData(response?.data)
            contacts.primary_number = response?.data?.primary_number
            contacts.whatsapp_number = response?.data?.whatsapp_number
        })

        const timer = setTimeout(() => {
            setVerifyContact(contacts)
        }, 5000);

        return () => clearTimeout(timer);
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (verifyContacts?.primary_number && !verifyContacts?.primary_number?.verified) {
            primaryNumberVerify(verifyContacts?.primary_number)
        } else if (verifyContacts?.whatsapp_number && !verifyContacts?.whatsapp_number?.verified) {
            whatsappNumberVerify(verifyContacts?.whatsapp_number)
        }
    }, [verifyContacts])

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
            <Modal modal={modal} setModal={handlePopupModalClose} />
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