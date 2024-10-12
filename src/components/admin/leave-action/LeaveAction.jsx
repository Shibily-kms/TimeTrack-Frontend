import React, { useEffect, useState } from 'react'
import './leave-action.scss'
import SingleButton from '../../common/buttons/SingleButton'
import { adminAxios, leaveAxios, ttCv2Axios, ttSv2Axios } from '../../../config/axios'
import { YYYYMMDDFormat } from '../../../assets/javascript/date-helper'
import { toast } from '../../../redux/features/user/systemSlice'
import { useDispatch, useSelector } from 'react-redux'
import { GoTrash } from 'react-icons/go'
import { TbAlertTriangle, TbCheck, TbX } from 'react-icons/tb'

const LeaveAction = ({ singleData, setData, setModal }) => {
    const dispatch = useDispatch()
    const [totalLeave, setTotalLeave] = useState(null)
    const [form, setForm] = useState(singleData?.requested_days || [])
    const [loading, setLoading] = useState('')
    const { user } = useSelector((state) => state.userAuth)

    const months = ['Jun', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    const handleChangeDate = (e, dayIndex) => {

        if (new Date(e.target.value).getDay() === 0) {
            return dispatch(toast.push.error({ message: "You can't select Sunday" }))
        }

        setForm((state) => {
            const newState = [...state]; // Create a copy of the current state
            newState[dayIndex] = [...newState[dayIndex]]; // Create a copy of the specific day array
            newState[dayIndex][0] = e.target.value; // Update the value at the specified index
            return newState; // Return the updated state
        });
    }

    const handleChangeTime = (e, dayIndex) => {
        setForm((state) => {
            const newState = [...state]; // Create a copy of the current state
            newState[dayIndex] = [...newState[dayIndex]]; // Create a copy of the specific day array
            switch (e.target.value) {
                case '1':
                    newState[dayIndex][2] = '09:30';
                    newState[dayIndex][3] = '13:00';
                    break;
                case '2':
                    newState[dayIndex][2] = '13:30';
                    newState[dayIndex][3] = '17:30';
                    break;
                case '3':
                    newState[dayIndex][2] = '09:30';
                    newState[dayIndex][3] = '17:30';
                    break;

                default:
                    newState[dayIndex][2] = '';
                    newState[dayIndex][3] = '';
                    break;
            }

            return newState; // Return the updated state
        });
    }

    const handleDayDelete = (index) => {
        setForm((state) => state.filter((value, idx) => idx !== index))
    }

    const handleApprove = (e) => {
        e.preventDefault();

        if (user?.allowed_origins.includes('ttcr_l2_write')) {
            const ask = window.confirm('Approve this application ?')
            if (ask) {
                setLoading('approve')
                ttCv2Axios.put('/L2/action/approve', { days: form, _id: singleData._id }).then(() => {

                    setModal({ status: false });
                    setLoading('')

                    setData((prevData) => {
                        const updatedData = prevData.map(item => {
                            if (item._id === singleData._id) {
                                return {
                                    ...item,
                                    leave_status: 'Approved',
                                    approved_days: form,
                                    action_date_time: new Date(),
                                    action_by: 'You'
                                };
                            }
                            return item;
                        });

                        return updatedData;
                    });

                }).catch((error) => {
                    dispatch(toast.push.error({ message: error.message }))
                    setLoading('')
                })
            }
        }
    }

    const handleReject = () => {

        const ask = window.confirm('Reject this application ?')
        if (ask) {
            setLoading('reject')
            ttCv2Axios.put('/L2/action/reject', { _id: singleData._id }).then(() => {
                setData((state) => {
                    const updatedData = state.map((item) => {
                        if (item._id === singleData._id) {
                            return {
                                ...item,
                                leave_status: 'Rejected',
                                action_date_time: new Date(),
                                action_by: 'You'
                            };
                        }
                        return item;
                    });
                    return [...updatedData];
                });
                setModal({ status: false })
                setLoading('')
            }).catch((error) => {
                dispatch(toast.push.error({ message: error.message }))
                setLoading('')
            })
        }
    }

    const handleCancel = () => {

        const ask = window.confirm('Cancel this application ?')
        if (ask) {
            setLoading('cancel')
            ttCv2Axios.delete(`/L2/action/cancel?_id=${singleData._id}`).then(() => {
                setData((state) => state.map((item) => {
                    if (item._id === singleData._id) {
                        return {
                            ...item,
                            leave_status: 'Cancelled',
                            action_date_time: new Date(),
                            action_by: 'You'
                        }
                    }
                    return item
                }))

                setModal({ status: false })
                setLoading('')
            }).catch((error) => {
                dispatch(toast.push.error({ message: error.message }))
                setLoading('')
            })
        }
    }

    useEffect(() => {
        if (singleData?.leave_status === 'Pending' || singleData?.leave_status === 'Approved') {
            ttSv2Axios.get(`/L2/staff/total-leave?staff_id=${singleData?.staff_id}&month=${YYYYMMDDFormat(new Date()).slice(0, 7)}`).then((response) => {
                setTotalLeave(response?.data?.total_leave || 0)
            })
        }
    }, [])


    return (
        <div className="leave-action-div">
            {(singleData?.leave_status === 'Pending' || singleData?.leave_status === 'Approved') && <div className="list-item bold-text">
                <p>{months[new Date().getMonth()]} Total Leave</p>
                <p>{totalLeave === null ? '...' : `${totalLeave} Day(s)`}</p>
            </div>}
            <div className="list-item">
                <p>Reason</p>
                <p>{singleData?.leave_reason}</p>
            </div>
            <div className="list-item">
                <p>Comment</p>
                <p>{singleData?.comment || 'Nill'}</p>
            </div>
            <form action="" onSubmit={handleApprove} >
                {singleData?.leave_status !== 'Approved' && <div className="section-div">
                    <h4>Requested days</h4>
                    <div className="list-days">
                        {form?.map((day, index) => {
                            return <div className="list" key={day[0]}>
                                <input name='date' type='date' value={day[0]} disabled={singleData?.leave_status !== 'Pending'}
                                    required onChange={(e) => handleChangeDate(e, index)} />
                                <select name='type' disabled={singleData?.leave_status !== 'Pending'} onChange={(e) => handleChangeTime(e, index)} required>
                                    <option value={''}>Select...</option>
                                    {day[1] === '0.5' && <option value={1} selected={day[1] === '0.5' && day[2] === '09:30'}>Before noon</option>}
                                    {day[1] === '0.5' && <option value={2} selected={day[1] === '0.5' && day[2] === '13:30'}>After noon</option>}
                                    {day[1] === '1' && <option value={3} selected={day[1] === '1'}>Full day</option>}
                                </select>
                                {form[1] && singleData?.leave_status === 'Pending' &&
                                    <div className="icon reject" onClick={() => handleDayDelete(index)}> <GoTrash /></div>}
                            </div>
                        })}
                    </div>
                </div>}

                {user?.allowed_origins.includes('ttcr_l2_write') &&
                    <div className="button-div">
                        {singleData?.leave_status === 'Pending' &&
                            < SingleButton type={'button'} name={'Reject'} classNames={'btn-danger'} loading={loading === 'reject'} onClick={handleReject} />}

                        {singleData?.leave_status === 'Pending' &&
                            <SingleButton type={'submit'} name={'Approve'} classNames={'btn-success'} loading={loading === 'approve'} />}
                    </div>
                }

            </form>

            {singleData?.leave_status === 'Approved' && <div className="section-div">
                <h4>Approved days</h4>
                <div className="list-days">
                    {singleData?.approved_days?.map((day, index) => {
                        return <div className="list" key={day[0]}>
                            <input name='date' type='date' value={day[0]} disabled />
                            <select name='type' disabled >
                                {day[1] === '0.5' && <option value={1} selected={day[1] === '0.5' && day[2] === '09:30'}>Before noon</option>}
                                {day[1] === '0.5' && <option value={2} selected={day[1] === '0.5' && day[2] === '13:30'}>After noon</option>}
                                {day[1] === '1' && <option value={3} selected={day[1] === '1'}>Full day</option>}
                            </select>
                        </div>
                    })}
                </div>
            </div>}


            {singleData?.leave_status !== 'Pending' &&
                < div className="status-view-bar">
                    <div className={`icon-status ${singleData?.leave_status} ${singleData.edited && 'Edited'}`}>
                        {singleData?.leave_status === 'Approved' && <TbCheck />}
                        {singleData?.leave_status === 'Rejected' && <TbAlertTriangle />}
                        {singleData?.leave_status === 'Cancelled' && <TbX />}
                        <h4>{singleData.edited && 'Modified and'}{singleData.self_action && 'Self'} {singleData?.leave_status}</h4>
                    </div>
                    <p>{singleData.self_action ? 'Self' : singleData?.action_by} {singleData?.leave_status} on {new Date(singleData?.action_date_time).toDateString()}</p>
                </div>}


            {user?.allowed_origins.includes('ttcr_l2_write') &&
                <div className="button-div">
                    {singleData?.leave_status === 'Approved'
                        && < SingleButton name={'Cancel'} loading={loading === 'cancel'} onClick={handleCancel} />}
                </div>}
        </div >
    )
}

export default LeaveAction