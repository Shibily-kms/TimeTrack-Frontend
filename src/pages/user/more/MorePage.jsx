import React, { useEffect, useState } from 'react'
import './more.scss'
import Modal from '../../../components/common/modal/Modal'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { IoArrowForwardOutline, IoPersonCircleOutline } from "react-icons/io5";
import { LuFileEdit } from "react-icons/lu";
import { IoMdLogOut } from "react-icons/io";
import { BsQrCodeScan } from "react-icons/bs";
import { clearWorkData } from '../../../redux/features/user/workdataSlice';
import { doLogOut } from '../../../redux/features/user/authSlice'
import { useDispatch, useSelector } from 'react-redux';
import { ui_version } from '../../../assets/javascript/const-data'
import { RiSettingsLine } from 'react-icons/ri';
import { PiSpinnerBold } from 'react-icons/pi';
import Cookies from 'js-cookie';

const MorePage = ({ setPageHead }) => {
    const [searchParams, setSearchParams] = useSearchParams()
    const { user } = useSelector((state) => state.userAuth)
    const [modal, setModal] = useState({ content: null, title: null, status: false })
    const [loading, setLoading] = useState('')
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [rfsTkn, setRfsTkn] = useState(Cookies.get('_rfs_tkn'));
    const [dvcId, setDvcId] = useState(Cookies.get('DVC_ID'));

    useEffect(() => {
        if (!rfsTkn || !dvcId) {
            navigate('/auth/sign-in')
        }
    }, [rfsTkn, dvcId])

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
            setLoading('out')

            dispatch(clearWorkData())
            dispatch(doLogOut())

            // clear cookie
            Cookies.remove('_acc_tkn');
            Cookies.remove('_rfs_tkn');
            Cookies.set('logged_in', 'no', {
                secure: false,
                // domain: '.domain.com', 
                sameSite: 'lax',
                path: '/',
                expires: 40
            });


            setRfsTkn(null);
            setDvcId(null);
        }
    }


    return (
        <div className="more-page-div">
            <Modal modal={modal} setModal={() => setModal({ status: false })} />
            <div className="section-border">
                <div className="option-div" onClick={() => navigate('/my-account/profile?page=more')}>
                    <div className="left">
                        <IoPersonCircleOutline />
                        <h4>Profile</h4>
                    </div>
                    <div className="right">
                        <IoArrowForwardOutline />
                    </div>
                </div>
                {(user?.punch_type === 'software' || user?.punch_type === 'firstInScanner') &&
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
                <div className="option-div" onClick={() => navigate('/leave-app?page=more')}>
                    <div className="left">
                        <LuFileEdit />
                        <h4>Leave Application</h4>
                    </div>
                    <div className="right">
                        <IoArrowForwardOutline />
                    </div>
                </div>
                <div className="option-div" onClick={() => navigate('/settings?page=more')}>
                    <div className="left">
                        <RiSettingsLine />
                        <h4>Privacy & Settings</h4>
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
                    <div className={loading === 'out' ? "right loading-icon" : 'right '}>
                        {loading === 'out' && <PiSpinnerBold />}
                    </div>
                </div>
            </div>

            <div className="software-info">
                <p>©Alliance water solutions®</p>
                <p>version {ui_version}</p>
            </div>
        </div>
    )
}

export default MorePage