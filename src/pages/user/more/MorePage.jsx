import React, { useEffect, useState } from 'react'
import './more.scss'
import Modal from '../../../components/common/modal/Modal'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { IoArrowForwardOutline, IoPersonCircleOutline } from "react-icons/io5";
import { LuArrowUpRight, LuFileEdit } from "react-icons/lu";
import { IoMdLogOut } from "react-icons/io";
import { BsQrCodeScan } from "react-icons/bs";
import { clearWorkData } from '../../../redux/features/user/workdataSlice';
import { doLogOut } from '../../../redux/features/user/authSlice'
import { useDispatch, useSelector } from 'react-redux';
import { ui_version } from '../../../assets/javascript/const-data'
import { RiSettingsLine } from 'react-icons/ri';
import { TbFileUpload, TbHelpSquareRounded, TbUserSearch } from 'react-icons/tb';
import { YYYYMMDDFormat } from '../../../assets/javascript/date-helper';
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

    const helpFormNavigate = () => {
        window.open(`https://docs.google.com/forms/d/e/1FAIpQLSfHzaBzc0SLS9BFJ_yGgtQsX290fiZrjymAK0tAIMDFmnSazw/viewform?usp=pp_url&entry.2086004218=${user?.dvc_id}&entry.1229166839=${user?.acc_id}&entry.319667061=${user?.first_name} ${user?.last_name}&entry.1265184055=Time+Track+(Attendance+Software)`, '_blank')
    }

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
            console.log('Cookies before logout:', Cookies.get());
            ['_acc_tkn', '_rfs_tkn'].forEach(cookie =>
                Cookies.remove(cookie, { path: '/', domain: '.alliancewatersolutions.com', secure: true, sameSite: 'None' })
            );
            console.log('Cookies after logout:', Cookies.get());

            Cookies.set('logged_in', 'no', {
                secure: true,
                domain: '.alliancewatersolutions.com',
                sameSite: 'None',
                path: '/',
                expires: new Date(new Date().setMonth(new Date().getMonth() + 6))
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
                <div className="option-div" onClick={() => navigate(`/my-prospects?month=${YYYYMMDDFormat(new Date()).slice(0, 7)}`)}>
                    <div className="left">
                        <TbFileUpload />
                        <h4>My Prospects</h4>
                    </div>
                    <div className="right">
                        <IoArrowForwardOutline />
                    </div>
                </div>
                {user?.allowed_origins?.some(access => ['ttur_customer_read', 'ttur_customer_download'].includes(access)) &&
                    <div className="option-div" onClick={() => navigate('/customer/search')}>
                        <div className="left">
                            <TbUserSearch />
                            <h4>Search Customer</h4>
                        </div>
                        <div className="right">
                            <IoArrowForwardOutline />
                        </div>
                    </div>}
                <div className="option-div" onClick={() => navigate('/settings?page=more')}>
                    <div className="left">
                        <RiSettingsLine />
                        <h4>Privacy & Settings</h4>
                    </div>
                    <div className="right">
                        <IoArrowForwardOutline />
                    </div>
                </div>
                <div className="option-div" onClick={() => helpFormNavigate()}>
                    <div className="left">
                        <TbHelpSquareRounded />
                        <h4>Help center</h4>
                    </div>
                    <div className="right">
                        <LuArrowUpRight />
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
        </div >
    )
}

export default MorePage