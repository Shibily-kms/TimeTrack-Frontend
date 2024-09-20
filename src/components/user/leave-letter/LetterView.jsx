import React from 'react'
import './letter-view.scss'
import { TbAlertTriangle, TbCheck, TbClock24, TbX } from 'react-icons/tb'
import SingleButton from '../../common/buttons/SingleButton'
import { YYYYMMDDFormat } from '../../../assets/javascript/date-helper'

const LetterView = ({ data, cancelLeave }) => {

    return (
        <div className="letter-view-sub-div">
            <div className="status-view-bar">
                <div className={`icon-status ${data?.leave_status} ${data.edited && 'Edited'}`}>
                    {data?.leave_status === 'Pending' && <TbClock24 />}
                    {data?.leave_status === 'Approved' && <TbCheck />}
                    {data?.leave_status === 'Rejected' && <TbAlertTriangle />}
                    {data?.leave_status === 'Cancelled' && <TbX />}
                    <h4>{data.edited && 'Modified and'}{data.self_action && 'Self'} {data?.leave_status}</h4>
                </div>
                <p>On {data?.action_date_time ? new Date(data?.action_date_time).toDateString() : new Date(data?.reg_date_time).toDateString()}</p>
            </div>
            <div className="letter-content-div">
                <div className="date-div">
                    {data?.leave_status === 'Approved'
                        ? <>
                            {data?.edited && <p>{new Date(data?.requested_days?.[0]?.[0]).toDateString()} {data?.requested_days?.length > 1 && `to ${new Date(data?.requested_days?.[data?.requested_days?.length - 1]?.[0]).toDateString()}`}</p>}
                            <p>{new Date(data?.approved_days?.[0]?.[0]).toDateString()} {data?.approved_days?.length > 1 && `to ${new Date(data?.approved_days?.[data?.approved_days?.length - 1]?.[0]).toDateString()}`}</p>
                        </>
                        : <p>{new Date(data?.requested_days?.[0]?.[0]).toDateString()} {data?.requested_days?.length > 1 && `to ${new Date(data?.requested_days?.[data?.requested_days?.length - 1]?.[0]).toDateString()}`}</p>}

                    {data?.leave_status === 'Approved'
                        ?
                        <p>
                            {data?.edited && <span className='reject'>{data?.requested_days?.length > 1 ? `${data?.requested_days?.length} Days` : data?.requested_days?.[0]?.[1] < 1 ? data?.requested_days?.[0]?.[2] === '09:30' ? 'Before noon' : 'After noon' : '1 Day'}</span>}
                            <span>{data?.approved_days?.length > 1 ? `${data?.approved_days?.length} Days` : data?.approved_days?.[0]?.[1] < 1 ? data?.approved_days?.[0]?.[2] === '09:30' ? 'Before noon' : 'After noon' : '1 Day'}</span>
                        </p>
                        : <p> <span>{data?.requested_days?.length > 1 ? `${data?.requested_days?.length} Days` : data?.requested_days?.[0]?.[1] < 1 ? data?.requested_days?.[0]?.[2] === '09:30' ? 'Before noon' : 'After noon' : '1 Day'}</span>  </p>
                    }
                </div>

                <p className='texts'>Reason : {data?.leave_reason}</p>
                {data?.comment && <p className='texts'>{data?.comment || 'Nill'}</p>}
            </div>

            {(data?.leave_status === 'Pending' || (data?.leave_status === 'Approved' && data?.approved_days?.[0]?.[0] <= YYYYMMDDFormat(new Date()))) && <div className="action-div">
                <p>Do you want to cancel this leave?</p>
                <SingleButton name={'Cancel'} style={{ width: '100%' }} onClick={() => cancelLeave(data?._id)} />
            </div>}
        </div >
    )
}

export default LetterView