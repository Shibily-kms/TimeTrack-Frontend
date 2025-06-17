import React, { useEffect, useState } from 'react'
import './style.scss'
import { ttSv2Axios } from '../../../config/axios';
import Cookies from 'js-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from '../../../redux/features/user/systemSlice';
import SpinWithMessage from '../../common/spinners/SpinWithMessage';
import Badge from '../../common/badge/Badge';
import { MdArrowForward } from "react-icons/md";
import Modal from '../../common/modal/Modal';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { TbDeviceLaptop, TbDeviceMobile, TbDeviceTablet, TbDevices } from "react-icons/tb";
import DeviceView from '../my-account-sub/DeviceView';
import SingleButton from '../../common/buttons/SingleButton';


const Devices = () => {
    const [loading, setLoading] = useState('')
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { user } = useSelector((state) => state.userAuth)
    const [modal, setModal] = useState({ status: false })
    const [devices, setDevices] = useState([])
    const dvcId = Cookies.get('DVC_ID');
    const [searchParams, setSearchParams] = useSearchParams()

    const doTerminateDevice = (deviceId, deviceType) => {
        const ask = window.confirm('Are you confirm this is not your device ?')
        if (ask) {
            ttSv2Axios.delete(`/worker/${user?.acc_id}/device/${deviceId}`).then(() => {
                setDevices((state) =>
                    state?.map((singleType) => {
                        if (singleType.device_type === deviceType) {
                            const updatedDevices = singleType?.devices?.map((device) => {
                                if (device.dvc_id === deviceId) {
                                    return {
                                        ...device,
                                        terminated: new Date(), // Update the terminated field
                                    };
                                }
                                return device;
                            });

                            return {
                                ...singleType,
                                devices: updatedDevices,
                            };
                        }
                        return singleType;
                    })
                );
                setModal({ status: false })
            }).catch((error) => {
                dispatch(toast.push.error({ message: error.message }))
                setModal({ status: false })
            })

        }
    }

    const fetchDevices = () => {
        setLoading('fetch')
        ttSv2Axios.get(`/worker/${user?.acc_id}/device`).then((response) => {
            setDevices(response.data)
            setLoading('')
        }).catch((error) => {
            dispatch(toast.push.error({ message: error.message }))
            navigate('/?page=home')
            setLoading('')
        })
    }

    useEffect(() => {
        fetchDevices()

        // eslint-disable-next-line
    }, [])

    const openModal = (title, content) => {
        setModal({ status: true, title, content })
    }

    const handleTerminateAll = () => {
        const ask = window.confirm('Are you terminate all inactive sessions ?')
        if (ask) {
            setLoading('terminate')
            ttSv2Axios.delete(`/worker/${user?.acc_id}/device/inactive/terminate?currentDvcId=${searchParams.get('dvcId')}`).then(() => {
                setSearchParams("", "")
                fetchDevices();
                setLoading("");
            }).catch((error) => {
                dispatch(toast.push.error({ message: error?.message }))
                setLoading('')
            })
        }
    }

    return (
        <>
            <Modal modal={modal} setModal={setModal} />
            {loading === 'fetch'
                ? <SpinWithMessage load fullView />
                : <div className="sub-account-div device-comp-div">
                    <p className='smallTD2' style={{ marginBottom: "20px" }}>
                        You're signed in on these devices or have been within the last 28 days. There may be multiple sessions from the same device.
                    </p>
                    {devices?.map((single, idx) => {
                        return <div className="listCard3-div" key={idx}>
                            <div className="listCard3-left-div">
                                <div className="icon-div">
                                    {single.device_type === 'Desktop' && <TbDeviceLaptop />}
                                    {single.device_type === 'Tablet' && <TbDeviceTablet />}
                                    {single.device_type === 'Mobile' && <TbDeviceMobile />}
                                    {(single.device_type === "Other Devices" || !single.device_type) && <TbDevices />}
                                </div>
                            </div>

                            <div className="listCard3-right-div">
                                <div className="list-head-div">
                                    <h3>{single?.devices?.length} Session(s) on {single.device_type}</h3>
                                </div>
                                {single?.devices?.map((device, index) => {
                                    return <div key={index} className="list-item-div"
                                        onClick={() => openModal('', <DeviceView device={device} terminateFunction={doTerminateDevice} />)}>
                                        <div className="list-item">
                                            <div className="item-content">
                                                <h4>{device?.os?.name || 'Unknown'}, {device?.browser?.name || 'Unknown'}</h4>
                                                <p className='d1'>Logged in {device?.geo?.city || 'Unknown'}, {device?.geo?.region || 'Unknown'}/{device?.geo?.country || 'Unknown'}</p>
                                                {device?.terminated
                                                    ? <Badge text={'Terminated'} className={'error-fill'} />
                                                    : device?.sign_out
                                                        ? <Badge text={'Sign Out'} className={'gray-fill'} />
                                                        : dvcId === device.dvc_id
                                                            ? <Badge text={'Current Device'} className={'info-fill'} />
                                                            : <p className='d1'>Last active on {new Date(device?.last_active).toDateString()}</p>}
                                            </div>
                                            <div className="item-right-div">
                                                <MdArrowForward />
                                            </div>
                                        </div>
                                    </div>
                                })}
                            </div>
                        </div>
                    })}

                    {(searchParams.get("dvcId") === dvcId && searchParams.get('session_terminate') === 'profile_status') && <>
                        <div className="listCard2-div" >
                            <div className="listCard2-head-div">
                                <div className="title-section">
                                    <h3>Terminate Inactive Sessions</h3>
                                    <p className='desc'>Terminate inactive device sessions</p>
                                </div>
                                <div className="right-section">

                                </div>
                            </div>
                            <div className="clear-alert-div">
                                <div className="text-div">
                                    <p>Your software allows a maximum of 4 authenticated devices for optimal security.
                                        Additional sign-ins may compromise your account's safety. Please terminate
                                        unwanted or inactive devices.</p>
                                    <p>The "Terminate inactive sessions" button will automatically log out all inactive devices and any
                                        devices exceeding the 4-device limit if all are active.</p>
                                </div>
                                <SingleButton name={'Terminate inactive sessions'} style={{ width: '100%' }} loading={loading === 'terminate'}
                                    classNames={'btn-danger'} onClick={handleTerminateAll} />
                            </div>
                        </div>
                    </>}

                </div >}
        </>
    )
}

export default Devices




