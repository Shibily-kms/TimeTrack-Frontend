import React, { useEffect, useState } from 'react'
import './style.scss'
import { ttSv2Axios } from '../../../config/axios';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from '../../../redux/features/user/systemSlice';
import SpinWithMessage from '../../common/spinners/SpinWithMessage';
import { findAgeFromDate } from '../../../assets/javascript/find-helpers';
import {
    TbCalendarSmile, TbGenderBigender, TbCalendarPlus, TbClockPlay, TbArrowForwardUpDouble, TbCash,
    TbPhone, TbPhoneCheck, TbPhoneIncoming,
    TbSettingsAutomation
} from "react-icons/tb";
import SingleButton from '../../common/buttons/SingleButton';
import { GrEdit } from "react-icons/gr";
import { getTimeFromSecond } from '../../../assets/javascript/date-helper';
import Badge from '../../common/badge/Badge';
import { MdArrowForward, MdOutlineAlternateEmail, MdOutlineNumbers } from "react-icons/md";
import { BsWhatsapp } from "react-icons/bs";
import Modal from '../../common/modal/Modal';
import EditProfile from '../my-account-sub/EditProfile';
import SingleContact from '../my-account-sub/SingleContact';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const [loading, setLoading] = useState('fetch')
    const [userData, setUserData] = useState({})
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { user } = useSelector((state) => state.userAuth)
    const [modal, setModal] = useState({ status: false })

    useEffect(() => {
        setLoading('fetch')
        ttSv2Axios.get(`/worker/account/${user?.acc_id}?profession=Yes`).then((response) => {
            setUserData(response.data)
            setLoading('')
        }).catch((error) => {
            dispatch(toast.push.error({ message: error.message }))
            navigate('/?page=home')
            setLoading('')
        })

        // eslint-disable-next-line
    }, [])

    const openModal = (title, content) => {
        setModal({ status: true, title, content })
    }

    return (
        <>
            <Modal modal={modal} setModal={setModal} />
            {loading === 'fetch'
                ? <SpinWithMessage load fullView />
                : <div className="sub-account-div profile-comp-div">
                    {/* Basic Info */}
                    <div className="listCard2-div">
                        <div className="listCard2-head-div">
                            <div className="title-section">
                                <h3>Basic Info</h3>
                                <p className='desc'>Your personal information</p>
                            </div>
                            <div className="right-section">
                                <SingleButton name={'Edit'} stIcon={<GrEdit />} classNames={'sm btn-primary'}
                                    onClick={() => openModal('Update Profile', <EditProfile userData={userData} setUserData={setUserData} setModal={setModal} />)} />
                            </div>
                        </div>
                        <div className="listCard2listing-div">
                            <div className="listCard2-listing">
                                <div className="listing-icon">
                                    <TbCalendarSmile />
                                </div>
                                <div className="listing-item">
                                    <div className="listing-label">
                                        <p>Date of Birth</p>
                                    </div>
                                    <div className="listing-value">
                                        <p>{new Date(userData?.dob).toDateString()} {userData?.dob && `(${findAgeFromDate(userData?.dob)} age)`}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="listCard2-listing">
                                <div className="listing-icon">
                                    <TbGenderBigender />
                                </div>
                                <div className="listing-item">
                                    <div className="listing-label">
                                        <p>Gender</p>
                                    </div>
                                    <div className="listing-value">
                                        <p>{userData?.gender || 'Prefer not to say'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Profession Info */}
                    <div className="listCard2-div">
                        <div className="listCard2-head-div">
                            <div className="title-section">
                                <h3>Profession Info</h3>
                                <p className='desc'>Your profession information</p>
                            </div>
                            <div className="right-section">

                            </div>
                        </div>
                        <div className="listCard2listing-div">
                            <div className="listCard2-listing">
                                <div className="listing-icon">
                                    <MdOutlineNumbers />
                                </div>
                                <div className="listing-item">
                                    <div className="listing-label">
                                        <p>Staff ID</p>
                                    </div>
                                    <div className="listing-value">
                                        <p>{userData?.sid || 'Nill'}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="listCard2-listing">
                                <div className="listing-icon">
                                    <TbCalendarPlus />
                                </div>
                                <div className="listing-item">
                                    <div className="listing-label">
                                        <p>Join Date</p>
                                    </div>
                                    <div className="listing-value">
                                        <p>{new Date(userData?.join_date).toDateString() || 'Nill'}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="listCard2-listing">
                                <div className="listing-icon">
                                    <TbSettingsAutomation />
                                </div>
                                <div className="listing-item">
                                    <div className="listing-label">
                                        <p>Work mode</p>
                                    </div>
                                    <div className="listing-value">
                                        <p>{userData?.e_type} / {userData?.work_mode}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="listCard2-listing">
                                <div className="listing-icon">
                                    <TbClockPlay />
                                </div>
                                <div className="listing-item">
                                    <div className="listing-label">
                                        <p>Working Time</p>
                                    </div>
                                    <div className="listing-value">
                                        <p>{userData?.current_working_days} Days, {getTimeFromSecond(userData?.current_working_time || 0) || 'No Times'}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="listCard2-listing">
                                <div className="listing-icon">
                                    <TbArrowForwardUpDouble />
                                </div>
                                <div className="listing-item">
                                    <div className="listing-label">
                                        <p>Carry forward</p>
                                    </div>
                                    <div className="listing-value">
                                        <p>{getTimeFromSecond(userData?.balance_CF || 0) || 'No times'}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="listCard2-listing">
                                <div className="listing-icon">
                                    <TbCash />
                                </div>
                                <div className="listing-item">
                                    <div className="listing-label">
                                        <p>Salary</p>
                                    </div>
                                    <div className="listing-value">
                                        <p>{userData?.current_salary || 'No Salary'} INR</p>
                                        {/* <span className='link'>Last 6 Month Report</span> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="listCard2-div">
                        <div className="listCard2-head-div">
                            <div className="title-section">
                                <h3>Contact Info</h3>
                                <p className='desc'>All contact information</p>
                            </div>
                            <div className="right-section">

                            </div>
                        </div>
                        <div className="listCard2listing-div">
                            <div className="listCard2-listing action-allow"
                                onClick={() => openModal('Email Address', <SingleContact type={'email'} label={'email_address'}
                                    contact={userData?.email_address} setModal={setModal} setUserData={setUserData} />)}>
                                <div className="listing-icon">
                                    <MdOutlineAlternateEmail />
                                </div>
                                <div className="listing-item">
                                    <div className="listing-label">
                                        <p>Email Address</p>
                                    </div>
                                    <div className="listing-value">
                                        <p>{userData?.email_address?.mail || 'Nill'}</p>
                                        {/* {userData?.email_address?.mail && <Badge
                                            text={userData?.email_address?.verified ? "Verified" : 'Unverified'}
                                            className={userData?.email_address?.verified ? "success-not-fill" : 'warning-not-fill'} />} */}
                                    </div>
                                </div>
                                <div className="listing-right">
                                    <MdArrowForward />
                                </div>
                            </div>
                            <div className="listCard2-listing action-allow"
                                onClick={() => openModal('Primary number', <SingleContact label={'primary_number'} type={'mobile'}
                                    contact={userData?.primary_number} setModal={setModal} setUserData={setUserData} />)}>
                                <div className="listing-icon">
                                    <TbPhoneCheck />
                                </div>
                                <div className="listing-item">
                                    <div className="listing-label">
                                        <p>Primary number</p>
                                    </div>
                                    <div className="listing-value">
                                        <p>{userData?.primary_number?.country_code} {userData?.primary_number?.number}</p>
                                        {userData?.primary_number?.number && <Badge
                                            text={userData?.primary_number?.verified ? "Verified" : 'Unverified'}
                                            className={userData?.primary_number?.verified ? "success-not-fill" : 'warning-not-fill'} />}
                                    </div>
                                </div>
                                <div className="listing-right">
                                    <MdArrowForward />
                                </div>
                            </div>
                            <div className="listCard2-listing action-allow"
                                onClick={() => openModal('Secondary number', <SingleContact label={'secondary_number'} type={'mobile'}
                                    contact={userData?.secondary_number} setModal={setModal} setUserData={setUserData} />)}>
                                <div className="listing-icon">
                                    <TbPhone />
                                </div>
                                <div className="listing-item">
                                    <div className="listing-label">
                                        <p>Secondary number</p>
                                    </div>
                                    <div className="listing-value">
                                        <p>{userData?.secondary_number?.country_code} {userData?.secondary_number?.number}</p>
                                        {userData?.secondary_number?.number && <Badge
                                            text={userData?.secondary_number?.verified ? "Verified" : 'Unverified'}
                                            className={userData?.secondary_number?.verified ? "success-not-fill" : 'warning-not-fill'} />}
                                    </div>
                                </div>
                                <div className="listing-right">
                                    <MdArrowForward />
                                </div>
                            </div>
                            <div className="listCard2-listing action-allow"
                                onClick={() => openModal('Official number', <SingleContact label={'official_number'} type={'mobile'}
                                    contact={userData?.official_number} setModal={setModal} setUserData={setUserData} />)}>
                                <div className="listing-icon">
                                    <TbPhoneIncoming />
                                </div>
                                <div className="listing-item">
                                    <div className="listing-label">
                                        <p>Official number</p>
                                    </div>
                                    <div className="listing-value">
                                        <p>{userData?.official_number?.country_code} {userData?.official_number?.number}</p>
                                        {userData?.official_number?.number && <Badge
                                            text={userData?.official_number?.verified ? "Verified" : 'Unverified'}
                                            className={userData?.official_number?.verified ? "success-not-fill" : 'warning-not-fill'} />}
                                    </div>
                                </div>
                                <div className="listing-right">
                                    <MdArrowForward />
                                </div>
                            </div>
                            <div className="listCard2-listing action-allow"
                                onClick={() => openModal('Whatsapp number', <SingleContact label={'whatsapp_number'} type={'whatsapp'}
                                    contact={userData?.whatsapp_number} setModal={setModal} setUserData={setUserData} />)}>
                                <div className="listing-icon">
                                    <BsWhatsapp />
                                </div>
                                <div className="listing-item">
                                    <div className="listing-label">
                                        <p>Whatsapp number</p>
                                    </div>
                                    <div className="listing-value">
                                        <p>{userData?.whatsapp_number?.country_code} {userData?.whatsapp_number?.number}</p>
                                        {/* {userData?.whatsapp_number?.number && <Badge
                                            text={userData?.whatsapp_number?.verified ? "Verified" : 'Unverified'}
                                            className={userData?.whatsapp_number?.verified ? "success-not-fill" : 'warning-not-fill'} />} */}
                                    </div>
                                </div>
                                <div className="listing-right">
                                    <MdArrowForward />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Address */}
                    <div className="listCard2-div">
                        <div className="listCard2-head-div">
                            <div className="title-section">
                                <h3>Your Address</h3>
                                <p className='desc'>Manage address associated with Alliance</p>
                            </div>
                            <div className="right-section">
                                <SingleButton name={'Edit'} stIcon={<GrEdit />} classNames={'sm btn-primary'}
                                    onClick={() => openModal('Update Profile', <EditProfile userData={userData} setUserData={setUserData} setModal={setModal} />)} />
                            </div>
                        </div>
                        <div className="listCard2listing-div">
                            <div className="listCard2-listing">
                                <div className="listing-item">
                                    <div className="listing-label">
                                        <p>Address, Place</p>
                                    </div>
                                    <div className="listing-value">
                                        <p>{userData?.address?.address} House, {userData?.address?.place}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="listCard2-listing">
                                <div className="listing-item">
                                    <div className="listing-label">
                                        <p>Post Office, Pin</p>
                                    </div>
                                    <div className="listing-value">
                                        <p>P.O {userData?.address?.post} - {userData?.address?.pin_code}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="listCard2-listing">
                                <div className="listing-item">
                                    <div className="listing-label">
                                        <p>District, State</p>
                                    </div>
                                    <div className="listing-value">
                                        <p>{userData?.address?.district} ,{userData?.address?.state}, {userData?.address?.country}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>}
        </>
    )
}

export default Profile
