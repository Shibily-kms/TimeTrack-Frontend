import React, { useEffect, useState } from 'react'
import './more.scss'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { MdOutlinePassword, MdOutlineNotificationsActive } from "react-icons/md";
import { IoArrowForwardOutline, IoPersonCircleOutline } from "react-icons/io5";
import { IoMdLogOut } from "react-icons/io";
import { BsQrCodeScan } from "react-icons/bs";
import Modal from '../../../components/common/modal/Modal'
import ChangePassword from '../../../components/user/change-password/ChangePassword';
import { clearWorkData } from '../../../redux/features/user/workdataSlice';
import { clearRegularWork } from '../../../redux/features/user/dayWorksSlice';
import { logOut } from '../../../redux/features/user/authSlice'
import { useDispatch } from 'react-redux';

const MorePage = ({ setPageHead }) => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [modal, setModal] = useState({ content: null, title: null, status: false })
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        if (!searchParams.get('page')) {
            setSearchParams(`page=home`)
        }

        setPageHead(() => ({ title: 'More Options' }))
        // eslint-disable-next-line
    }, [])

    const openModel = (title, content) => {
        setModal({ content, title, status: true })
    }

    const handleLogOut = () => {
        const ask = window.confirm('Are you ready for logOut ?')
        if (ask) {
            dispatch(clearWorkData())
            dispatch(clearRegularWork())
            dispatch(logOut())
            navigate('/login')
        }
    }


    return (
        <div className="more-page-div">
            <Modal modal={modal} setModal={() => setModal({ status: false })} />
            <div className="section-border">
                <div className="option-div">
                    <div className="left">
                        <IoPersonCircleOutline />
                        <h4>Profile</h4>
                    </div>
                    <div className="right">
                        <IoArrowForwardOutline />
                    </div>
                </div>
                <div className="option-div">
                    <div className="left">
                        <BsQrCodeScan />
                        <h4>Punch Scanner</h4>
                    </div>
                    <div className="right">
                        <IoArrowForwardOutline />
                    </div>
                </div>
                <div className="option-div" onClick={() => openModel('Change Password', <ChangePassword setModal={setModal} />)}>
                    <div className="left">
                        <MdOutlinePassword />
                        <h4>Change password</h4>
                    </div>
                    <div className="right">
                        <IoArrowForwardOutline />
                    </div>
                </div>
                <div className="option-div">
                    <div className="left">
                        <MdOutlineNotificationsActive />
                        <h4>Notifications</h4>
                    </div>
                    <div className="right">
                        <IoArrowForwardOutline />
                    </div>
                </div>
                <div className="option-div red-option" onClick={() => handleLogOut()}>
                    <div className="left">
                        <IoMdLogOut />
                        <h4>Log out</h4>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MorePage