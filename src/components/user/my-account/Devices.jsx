import React, { useEffect, useState } from 'react'
import './style.scss'
import { userAxios } from '../../../config/axios';
import Cookies from 'js-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from '../../../redux/features/user/systemSlice';
import SpinWithMessage from '../../common/spinners/SpinWithMessage';
import Badge from '../../common/badge/Badge';
import { MdArrowForward } from "react-icons/md";
import Modal from '../../common/modal/Modal';
import { useNavigate } from 'react-router-dom';
import { TbDeviceLaptop, TbDeviceMobile, TbDeviceTablet, TbDevices } from "react-icons/tb";
import DeviceView from '../my-account-sub/DeviceView';


const Devices = () => {
    const [loading, setLoading] = useState('')
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { user } = useSelector((state) => state.userAuth)
    const [modal, setModal] = useState({ status: false })
    const [devices, setDevices] = useState([])
    const dvcId = Cookies.get('DVC_ID');

    const doTerminateDevice = (deviceId, deviceType) => {
        const ask = window.confirm('Are you confirm this is not your device ?')
        if (ask) {
            userAxios.delete(`/v2/worker/${user?.acc_id}/device/${deviceId}`).then(() => {
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

    useEffect(() => {
        setLoading('fetch')
        userAxios.get(`/v2/worker/${user?.acc_id}/device`).then((response) => {
            setDevices(response.data)
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
                                    {single.device_type === 'Other' && <TbDevices />}
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
                                                <h4>{device?.os?.name} {device?.os?.version}, {device?.browser?.name}</h4>
                                                <p className='d1'>Logged in {device?.geo?.city}, {device?.geo?.region}/{device?.geo?.country}</p>
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



                </div >}
        </>
    )
}

export default Devices




{/* <div className="listCard2-listing">
<div className="listing-icon">
    <AiFillAndroid />
</div>
<div className="listing-item">
    <div className="listing-label">
        <p>Date of Birth</p>
    </div>
    <div className="listing-value">
        <p>{new Date(userData?.dob).toDateString()} {userData?.dob && `(${findAgeFromDate(userData?.dob)} age)`}</p>
    </div>
</div>
<div className="listing-right">
    <AiFillAndroid />
</div>
</div> */}