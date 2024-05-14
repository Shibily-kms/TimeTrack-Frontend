import React, { useEffect, useState } from 'react'
import './more.scss'
import Modal from '../../../components/common/modal/Modal'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { MdOutlineNotificationsActive } from "react-icons/md";
import { IoArrowForwardOutline, IoPersonCircleOutline } from "react-icons/io5";
import { LuFileEdit } from "react-icons/lu";
import { IoMdLogOut } from "react-icons/io";
import { BsQrCodeScan } from "react-icons/bs";
import { TbRouteAltRight } from "react-icons/tb";
import { GoGitPullRequest } from "react-icons/go";
import { clearWorkData } from '../../../redux/features/user/workdataSlice';
import { clearRegularWork } from '../../../redux/features/user/dayWorksSlice';
import { logOut } from '../../../redux/features/user/authSlice'
import { useDispatch, useSelector } from 'react-redux';

const MorePage = ({ setPageHead }) => {
    const [searchParams, setSearchParams] = useSearchParams()
    const { user } = useSelector((state) => state.userAuth)
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
                <div className="option-div" onClick={() => navigate('/profile?page=more')}>
                    <div className="left">
                        <IoPersonCircleOutline />
                        <h4>Profile</h4>
                    </div>
                    <div className="right">
                        <IoArrowForwardOutline />
                    </div>
                </div>
                {user?.punch_type === 'software' &&
                    <div className="option-div" onClick={() => navigate('/scanner?page=more')}>
                        <div className="left">
                            <BsQrCodeScan />
                            <h4>Punch Scanner</h4>
                        </div>
                        <div className="right">
                            <IoArrowForwardOutline />
                        </div>
                    </div>
                }
                <div className="option-div">
                    <div className="left">
                        <TbRouteAltRight />
                        <h4>My Enquiries</h4>
                    </div>
                    <div className="right">
                        <IoArrowForwardOutline />
                    </div>
                </div>
                <div className="option-div">
                    <div className="left">
                        <GoGitPullRequest />
                        <h4>Punch Request</h4>
                    </div>
                    <div className="right">
                        <IoArrowForwardOutline />
                    </div>
                </div>
                <div className="option-div" onClick={() => navigate('/leave-app?page=more')}>
                    <div className="left">
                        <LuFileEdit />
                        <h4>Leave Application</h4>
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

            <div className="software-info">
                <p>©Alliance water solutions®</p>
                <p>version 2.0.0</p>
            </div>
        </div>
    )
}

export default MorePage