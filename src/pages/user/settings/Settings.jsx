import React, { useEffect, useState } from 'react'
import './settings.scss'
import { useSearchParams } from 'react-router-dom'
import { MdLightMode, MdDarkMode, MdOutlinePassword, MdCloudSync } from "react-icons/md";
import { IoArrowForwardOutline } from "react-icons/io5";
import { PiSpinnerBold } from "react-icons/pi";
import Modal from '../../../components/common/modal/Modal'
import ChangeTheme from '../../../components/user/change-theme/ChangeTheme';
import { useDispatch, useSelector } from 'react-redux';
import { BsCircleHalf } from "react-icons/bs";
import ChangePassword from '../../../components/user/my-account-sub/ChangePassword';
import { userAxios } from '../../../config/axios';
import { setUser } from '../../../redux/features/user/authSlice';
import { getPunchDetails } from '../../../redux/features/user/workdataSlice';
import { setRegularWork } from '../../../redux/features/user/dayWorksSlice';
import { toast } from '../../../redux/features/user/systemSlice';

const Settings = ({ setPageHead }) => {
    const [searchParams, setSearchParams] = useSearchParams()
    const dispatch = useDispatch();
    const [modal, setModal] = useState({ content: null, title: null, status: false })
    const { theme, internet } = useSelector((state) => state.systemInfo)
    const { user } = useSelector((state) => state.userAuth)
    const [loading, setLoading] = useState('')

    useEffect(() => {
        if (!searchParams.get('page')) {
            setSearchParams(`page=settings`)
        }

        setPageHead(() => ({ title: 'Settings' }))
        // eslint-disable-next-line
    }, [])

    const openModel = (title, content) => {
        setModal({ content, title, status: true })
    }

    const syncData = () => {
        if (!internet) {
            dispatch(toast.push.warning({ message: "Must have internet" }))
            return;
        }
        setLoading('sync')
        if (user) {
            userAxios.get(`/auth/check-active`).then((response) => {
                dispatch(setUser({ ...user, ...response.data }))
                dispatch(getPunchDetails())
                userAxios.get('/regular-work').then((works) => {
                    dispatch(setRegularWork(works.data))
                    setLoading('')
                })
            })
        }

    }


    return (
        <div className="settings-page-div">
            <Modal modal={modal} setModal={() => setModal({ status: false })} />
            <div className="section-border">
                <div className="option-div" onClick={() => openModel('Change Theme', <ChangeTheme />)}>
                    <div className="left">
                        {theme === 'dark' ? <MdDarkMode /> : theme === 'light' ? < MdLightMode /> : <BsCircleHalf />}
                        <h4>Theme</h4>
                    </div>
                    <div className="right">
                        <IoArrowForwardOutline />
                    </div>
                </div>

                <div className="option-div" onClick={() => syncData()}>
                    <div className="left">
                        <MdCloudSync />
                        <h4>Sync Data</h4>

                    </div>
                    <div className={loading === 'sync' ? "right loading-icon" : 'right '}>
                        {loading === 'sync' && <PiSpinnerBold />}
                    </div>
                </div>

                <div className="option-div" onClick={() => openModel('Change Password', <ChangePassword setModal={setModal} />)}>
                    <div className="left">
                        <MdOutlinePassword />
                        <h4>Change Password</h4>
                    </div>
                    <div className="right">
                        <IoArrowForwardOutline />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Settings