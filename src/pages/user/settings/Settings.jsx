import React, { useEffect, useState } from 'react'
import './settings.scss'
import SinglePage from '../../../components/common/page/SinglePage'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { MdLightMode, MdDarkMode } from "react-icons/md";
import { IoArrowForwardOutline } from "react-icons/io5";
import Modal from '../../../components/common/modal/Modal'
import ChangeTheme from '../../../components/user/change-theme/ChangeTheme';
import { useDispatch, useSelector } from 'react-redux';
import { BsCircleHalf } from "react-icons/bs";

const Settings = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [modal, setModal] = useState({ content: null, title: null, status: false })
    const { theme } = useSelector((state) => state.systemInfo)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        if (!searchParams.get('page')) {
            setSearchParams(`page=settings`)
        }
        // eslint-disable-next-line
    }, [])

    const openModel = (title, content) => {
        setModal({ content, title, status: true })
    }


    return (
        <div className="more-page-div">
            <Modal modal={modal} setModal={() => setModal({ status: false })} />
            <SinglePage title={'Settings'}>
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
            </SinglePage>
        </div>
    )
}

export default Settings