import React, { useEffect, useState } from 'react'
import './settings.scss'
import { useSearchParams } from 'react-router-dom'
import { MdLightMode, MdDarkMode, MdOutlinePassword } from "react-icons/md";
import { IoArrowForwardOutline } from "react-icons/io5";
import Modal from '../../../components/common/modal/Modal'
import ChangeTheme from '../../../components/user/change-theme/ChangeTheme';
import { useSelector } from 'react-redux';
import { BsCircleHalf } from "react-icons/bs";
import ChangePassword from '../../../components/user/change-password/ChangePassword';

const Settings = ({ setPageHead }) => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [modal, setModal] = useState({ content: null, title: null, status: false })
    const { theme } = useSelector((state) => state.systemInfo)

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

                <div className="option-div" onClick={() => openModel('Change Password', <ChangePassword setModal={setModal} />)}>
                    <div className="left">
                        <MdOutlinePassword />
                        <h4>Change password</h4>
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