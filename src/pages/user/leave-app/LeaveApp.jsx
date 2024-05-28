import React, { useEffect, useState } from 'react'
import './leave-app.scss'
import SingleButton from '../../../components/common/buttons/SingleButton'
import SpinWithMessage from '../../../components/common/spinners/SpinWithMessage'
import Modal from '../../../components/common/modal/Modal'
import LeaveReg from '../../../components/user/leave-reg/LeaveReg'
import { FaPlus } from "react-icons/fa6";
import { userAxios } from '../../../config/axios'
import { useDispatch } from 'react-redux'
import { toast } from '../../../redux/features/user/systemSlice'
import { YYYYMMDDFormat } from '../../../assets/javascript/date-helper'
import { TbListDetails } from "react-icons/tb";


const LeaveApp = ({ setPageHead }) => {

    const [modal, setModal] = useState({ status: false })
    const [data, setData] = useState([])
    const [page, setPage] = useState(1)
    const dispatch = useDispatch()
    const [loading, setLoading] = useState('fetch')
    const [count, setCount] = useState(0)
    const [totalLeave, setTotalLeave] = useState(0)

    const handleOpenModal = () => {
        setModal({ status: true, title: "Leave Registration", content: <LeaveReg setModal={setModal} setData={setData} /> })
    }

    const handleCancelLeave = (id) => {
        const ask = window.confirm('Are you cancel this application ?')
        if (ask) {
            setLoading('cancel' + id)
            userAxios.delete(`/leave-application/cancel?_id=${id}&self_cancel=yes`).then(() => {
                setData(data?.map((item) => {
                    if (item._id === id) {
                        return {
                            ...item,
                            leave_status: 'Cancelled',
                            cancelled_date_time: new Date(),
                            self_cancel: true
                        }
                    }
                    return item
                }))
                setLoading('')
                dispatch(toast.push.success({ message: 'Cancelled' }))

            }).catch((error) => {
                dispatch(toast.push.error({ message: error.message }))
                setLoading('')
            })
        }

    }

    useEffect(() => {
        setPageHead({ title: "Leave Application" })
        setLoading('fetch')
        userAxios.get(`/leave-application?page=${page}&count=10`).then((response) => {
            setData([...data, ...response?.data?.list])
            setCount(response.data?.count || 0)
            setLoading('')

            userAxios.get(`/leave-application/total-leave?month=${YYYYMMDDFormat(new Date()).slice(0, 7)}`).then((result) => {
                setTotalLeave(result.data?.total_leave || 0)
            })
        }).catch((error) => {
            dispatch(toast.push.error({ message: error.message }))
            setLoading('')
        })
    }, [page])

    return (
        <div className="leave-app-page-div">
            <Modal modal={modal} setModal={setModal} />
            <div className="report-info-div">
                <h2>{totalLeave}</h2>
                <p>This Month Total Leaves</p>
            </div>
            <div className="item-list-div">

                {data?.map((item) => <div key={item?.token_id} className="item-box">
                    <div className={`left-div ${item?.leave_status}`}>
                        <p>{item?.leave_status}</p>
                    </div>
                    <div className="border-div">
                        <div className="text-list">
                            <p>Token : {item?.token_id}</p>
                            <p>Type : {item?.leave_type} Day</p>
                        </div>
                        <div className="text-list">
                            {item?.apply_leave?.from_date !== item?.apply_leave?.to_date
                                ? <p className='bold-text'>RTP : {new Date(item?.apply_leave?.from_date).toDateString()} to {new Date(item?.apply_leave?.to_date).toDateString()} ({item?.apply_leave?.days} Days)</p>
                                : <p className='bold-text'>RTP : {new Date(item?.apply_leave?.to_date).toDateString()} (Half Day)</p>
                            }

                        </div>
                        <div className="text-list">
                            <p>Reason : </p>
                            <p>{item?.leave_reason}</p>
                        </div>
                        <div className="text-list">
                            <p>Comment : </p>
                            <p>{item?.comment || 'Nill'}</p>
                        </div>
                        <div className="text-list">
                            {item?.leave_status === 'Pending' &&
                                <p className='bold-text reg-text'>Reg Date : {new Date(item?.reg_date_time).toDateString()}</p>}

                            {item?.leave_status === 'Approved' &&
                                <p className='bold-text approve-text'>ATP : {new Date(item?.approved_leave?.from_date).toDateString()} to {new Date(item?.approved_leave?.to_date).toDateString()} ({item?.approved_leave?.days}d)</p>}

                            {item?.leave_status === 'Rejected' &&
                                <p className='bold-text reject-text'>Reject Date : {new Date(item?.rejected_date_time).toDateString()}</p>}

                            {item?.leave_status === 'Cancelled' &&
                                <p className='bold-text reject-text'>Cancel Date : {new Date(item?.cancelled_date_time).toDateString()} {item?.self_cancel && '(Self Cancelling)'}</p>}
                        </div>
                    </div>
                    {(item?.leave_status === 'Pending' || (item?.leave_status === 'Approved' && YYYYMMDDFormat(new Date()) <= item?.approved_leave?.from_date)) &&
                        <div className="action-div">
                            <SingleButton name={'Cancel'} classNames={'sm'} onClick={() => handleCancelLeave(item?._id)} loading={loading === `cancel${item._id}`} />
                        </div>
                    }
                </div>)}
                {loading === 'fetch' || !data?.[0]
                    ? <SpinWithMessage load={loading === 'fetch'} message='Empty letters' height={'300px'} icon={<TbListDetails />} />
                    : <>
                        {count > page * 10
                            ? < SingleButton name={'Show more'} style={{ width: '100%' }} classNames={'lg btn-secondary'} onClick={() => setPage(page + 1)} />
                            : <p style={{ textAlign: 'center', fontSize: '12px' }}>No more data available</p>}
                    </>}
            </div>

            <div className="app-icon-div">
                <SingleButton title={'Register leave'} stIcon={<FaPlus />} classNames={'icon-only btn-tertiary'} style={{ padding: '15px', fontSize: '25px', borderRadius: '100px' }}
                    onClick={handleOpenModal} />
            </div>
        </div>
    )
}

export default LeaveApp