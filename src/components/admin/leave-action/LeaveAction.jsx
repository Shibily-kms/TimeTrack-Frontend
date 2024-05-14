import React, { useEffect, useState } from 'react'
import './leave-action.scss'
import NormalInput from '../../common/inputs/NormalInput'
import SingleButton from '../../common/buttons/SingleButton'
import { adminAxios } from '../../../config/axios'
import { YYYYMMDDFormat } from '../../../assets/javascript/date-helper'
import { toast } from '../../../redux/features/user/systemSlice'
import { useDispatch } from 'react-redux'

const LeaveAction = ({ data, setData, setModal }) => {
    const dispatch = useDispatch()
    const [totalLeave, setTotalLeave] = useState(0)
    const [form, setForm] = useState({ from_date: data?.apply_leave?.from_date, to_date: data?.apply_leave?.to_date })
    const [loading, setLoading] = useState('')

    const months = ['Jun', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleApprove = () => {
        if (!form?.from_date || !form?.to_date) {
            dispatch(toast.push.error({ message: 'Fill the inputs' }))
            return;
        }

        if (form?.from_date > form?.to_date) {
            dispatch(toast.push.error({ message: 'End date is not valid' }))
            return;
        }

        const ask = window.confirm('Approve this application ?')
        if (ask) {
            setLoading('approve')
            adminAxios.post('/leave-application/approve', { ...form, _id: data._id, leave_type: data?.leave_type }).then(() => {
                dispatch(toast.push.success({ message: 'Leave Approved' }))
                const betweenDays = Math.round((new Date(form?.to_date) - new Date(form?.from_date)) / (1000 * 60 * 60 * 24)) + 1
                setData((state) => state.map((item) => {
                    if (item._id === data._id) {
                        return {
                            ...item,
                            leave_status: 'Approved',
                            approved_leave: {
                                from_date: form?.from_date,
                                to_date: data?.leave_type === 'Full' ? form?.to_date : form?.from_date,
                                days: data?.leave_type === 'Full' ? betweenDays : .5  // .5 === 0.5
                            },
                            approved_date_time: new Date()
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

    const handleReject = () => {

        const ask = window.confirm('Reject this application ?')
        if (ask) {
            setLoading('reject')
            adminAxios.post('/leave-application/reject', { _id: data._id }).then(() => {
                dispatch(toast.push.success({ message: 'Leave Rejected' }))

                setData((state) => state.map((item) => {
                    if (item._id === data._id) {
                        return {
                            ...item,
                            leave_status: 'Rejected',
                            rejected_date_time: new Date()
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

    const handleCancel = () => {

        const ask = window.confirm('Cancel this application ?')
        if (ask) {
            setLoading('cancel')
            adminAxios.delete(`/leave-application/cancel?_id=${data._id}`).then(() => {
                dispatch(toast.push.success({ message: 'Leave Cancelled' }))

                setData((state) => state.map((item) => {
                    if (item._id === data._id) {
                        return {
                            ...item,
                            leave_status: 'Cancelled',
                            cancelled_date_time: new Date()
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
        if (data?.leave_status === 'Pending' || data?.leave_status === 'Approved') {
            adminAxios.get(`/leave-application/total-leave?staff_id=${data?.staff_id}&month=${YYYYMMDDFormat(new Date()).slice(0, 7)}`).then((response) => {
                setTotalLeave(response?.data?.total_leave || 0)
            })
        }
    }, [])


    return (
        <div className="leave-action-div">
            {(data?.leave_status === 'Pending' || data?.leave_status === 'Approved') && <div className="list-item bold-text">
                <p>{months[new Date().getMonth()]} Total Leave</p>
                <p>{totalLeave} Days</p>
            </div>}
            <div className="list-item">
                <p>Leave Type</p>
                <p>{data?.leave_type} Day</p>
            </div>
            <div className="list-item">
                <p>Request {data?.leave_type === 'Full' && 'From'} Date</p>
                <p>{new Date(data?.apply_leave?.from_date).toDateString()}</p>
            </div>
            {data?.leave_type === 'Full' && <div className="list-item">
                <p>Request End Date</p>
                <p>{new Date(data?.apply_leave?.to_date).toDateString()}</p>
            </div>}
            <div className="list-item">
                <p>Request Days</p>
                <p>{data?.apply_leave?.days}d</p>
            </div>
            {data?.leave_status === 'Approved' && <>
                <div className="list-item">
                    <p>Approved {data?.leave_type === 'Full' && 'From'} Date</p>
                    <p>{new Date(data?.approved_leave?.from_date).toDateString()}</p>
                </div>
                {data?.leave_type === 'Full' && <div className="list-item">
                    <p>Approved End Date</p>
                    <p>{new Date(data?.approved_leave?.to_date).toDateString()}</p>
                </div>}
                <div className="list-item">
                    <p>Approved Days</p>
                    <p>{data?.approved_leave?.days}d</p>
                </div>
            </>}
            <div className="list-item">
                <p>Reason</p>
                <p>{data?.leave_reason}</p>
            </div>
            <div className="list-item">
                <p>Comment</p>
                <p>{data?.comment || 'Nill'}</p>
            </div>
            {data?.leave_status !== 'Pending' && <div className={data?.leave_status === 'Approved'
                ? "info-item approve"
                : data?.leave_status === 'Pending'
                    ? 'info-item pending'
                    : 'info-item reject'}>
                <p>{data?.leave_status} On {new Date(data?.cancelled_date_time || data?.rejected_date_time || data?.approved_date_time).toDateString()}</p>
            </div>}
            {data?.leave_status === 'Pending' && <div className="form-inputs">
                <NormalInput label={data?.leave_type === 'Full' ? 'From Date' : 'Date'} name='from_date' type='date'
                    value={form?.from_date} style={{ width: '100%' }} onChangeFun={handleChange} />
                {data?.leave_type === 'Full' && <NormalInput label='End Date' name='to_date' type='date'
                    value={form?.to_date} onChangeFun={handleChange} min={form?.from_date} />}
            </div>}
            <div className="button-div">
                {data?.leave_status === 'Pending' && < SingleButton name={'Reject'} classNames={'btn-danger'}
                    loading={loading === 'reject'} onClick={handleReject} />}
                {data?.leave_status === 'Pending' && <SingleButton name={'Approve'} classNames={'btn-success'}
                    onClick={handleApprove} loading={loading === 'approve'} />}
                {data?.leave_status === 'Pending' || data?.leave_status === 'Approved'
                    && < SingleButton name={'Cancel'} loading={loading === 'cancel'} onClick={handleCancel} />}
            </div>
        </div>
    )
}

export default LeaveAction