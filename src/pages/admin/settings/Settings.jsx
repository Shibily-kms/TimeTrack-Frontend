import React, { useEffect, useState } from 'react'
import './settings.scss'
import Modal from '../../../components/common/modal/Modal'
import ChangeTheme from '../../../components/user/change-theme/ChangeTheme'
import { useSelector } from 'react-redux'
import { MdDarkMode, MdLightMode } from 'react-icons/md'
import { BsCircleHalf } from 'react-icons/bs'
import { IoArrowForwardOutline } from 'react-icons/io5'

const Settings = ({ setPageHead }) => {
    const [modal, setModal] = useState({})
    const { theme } = useSelector((state) => state.systemInfo)

    const openModel = (title, content) => {
        setModal({ content, title, status: true })
    }



    useEffect(() => {
        setPageHead({ title: 'Settings' })
    }, [])

    return (
        <div className="admin-settings-page-div">
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
            </div>
        </div>
    )
}

export default Settings