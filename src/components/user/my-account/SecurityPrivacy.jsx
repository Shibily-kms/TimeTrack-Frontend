import React, { useEffect, useState } from 'react'
import './style.scss'
import { userAxios } from '../../../config/axios';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from '../../../redux/features/user/systemSlice';
import SpinWithMessage from '../../common/spinners/SpinWithMessage';
import Badge from '../../common/badge/Badge';
import { MdArrowForward } from "react-icons/md";
import Modal from '../../common/modal/Modal';
import { useNavigate } from 'react-router-dom';
import { MdOutlinePassword } from "react-icons/md";
import { IoMdWarning } from "react-icons/io";
import ChangePassword from '../my-account-sub/ChangePassword';

const SecurityPrivacy = () => {
    const [loading, setLoading] = useState('fetch')
    const [userData, setUserData] = useState({})
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { user } = useSelector((state) => state.userAuth)
    const [modal, setModal] = useState({ status: false })

    useEffect(() => {
        setLoading('fetch')
        userAxios.get(`/v2/worker/account/${user?.acc_id}`).then((response) => {
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
                    {/* How to sign in */}
                    <div className="listCard2-div">
                        <div className="listCard2-head-div">
                            <div className="title-section">
                                <h3>How to sign in</h3>
                                <p className='desc'>Ensure continuous access to your Account by keeping your information up to date.</p>
                            </div>
                            <div className="right-section">

                            </div>
                        </div>
                        <div className="listCard2listing-div">
                            <div className="listCard2-listing action-allow"
                                onClick={() => openModal('Password', <ChangePassword setModal={setModal} setUserData={setUserData} />)}>
                                <div className="listing-icon">
                                    <MdOutlinePassword />
                                </div>
                                <div className="listing-item">
                                    <div className="listing-label">
                                        <p>Password</p>
                                    </div>
                                    <div className="listing-value">
                                        <p>{userData?.last_tp_changed
                                            ? `Last changed at ${new Date(userData?.last_tp_changed).toDateString()}`
                                            : <Badge text={'Update credentials for security.'} icon={<IoMdWarning />} className={'warning-fill'} />}</p>
                                    </div>
                                </div>
                                <div className="listing-right">
                                    <MdArrowForward />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>}
        </>
    )
}

export default SecurityPrivacy
