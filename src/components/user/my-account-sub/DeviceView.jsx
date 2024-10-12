import React from 'react'
import './device-view.scss'
import Cookies from 'js-cookie';
import { TbDeviceLaptop, TbDeviceMobile, TbDevices, TbDeviceTablet } from 'react-icons/tb'
import Badge from '../../common/badge/Badge'
import { convertIsoToAmPm } from '../../../assets/javascript/date-helper'
import SingleButton from '../../common/buttons/SingleButton';

const DeviceView = ({ device, terminateFunction }) => {
    const dvcId = Cookies.get('DVC_ID');

    return (
        <div className="device-view-sub-div">
            <div className="device-view-head-div">
                <div className="icon-div">
                    {device.device_type === 'Desktop' && <TbDeviceLaptop />}
                    {device.device_type === 'Tablet' && <TbDeviceTablet />}
                    {device.device_type === 'Mobile' && <TbDeviceMobile />}
                    {(device.device_type === 'Other' || !device.device_type) && <TbDevices />}
                </div>
                <div className="title-div">
                    <h4>{device?.os?.name || 'Unknown'} {device?.os?.version}, {device?.browser?.name || 'Unknown'}</h4>
                    <p className='d1'>Logged in {device?.geo?.city || 'Unknown'}, {device?.geo?.region || 'Unknown'}/{device?.geo?.country || 'Unknown'}</p>
                </div>
            </div>
            <div className="content-div">
                <p className='d1'>Logged at {new Date(device?.created_at).toDateString()}, {convertIsoToAmPm(new Date(device?.created_at))}</p>
                {device?.terminated
                    ? <Badge text={'Terminated'} className={'lg error-fill'} />
                    : device?.sign_out
                        ? <Badge text={'Sign Out'} className={'lg gray-fill'} />
                        : dvcId === device.dvc_id
                            ? <Badge text={'Current Device'} className={'lg info-fill'} />
                            : <p className='d1'>Last active on {new Date(device?.last_active).toDateString()}, {convertIsoToAmPm(new Date(device?.last_active))}</p>}
            </div>
            <div className="action-div">
                {!device?.terminated && dvcId !== device.dvc_id && <SingleButton name={'This is not my device'} style={{ marginTop: '15px', width: '100%' }}
                    classNames={'lg btn-tertiary'} onClick={() => terminateFunction(device.dvc_id, device.device_type)} />}

            </div>

        </div>
    )
}

export default DeviceView