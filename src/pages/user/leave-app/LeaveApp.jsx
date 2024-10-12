import React, { useEffect, useState } from 'react'
import './leave-app.scss'
import SingleButton from '../../../components/common/buttons/SingleButton'
import SpinWithMessage from '../../../components/common/spinners/SpinWithMessage'
import Modal from '../../../components/common/modal/Modal'
import LeaveReg from '../../../components/user/leave-letter/LeaveReg'
import { FaPlus } from "react-icons/fa6";
import { ttSv2Axios, userAxios } from '../../../config/axios'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from '../../../redux/features/user/systemSlice'
import { YYYYMMDDFormat } from '../../../assets/javascript/date-helper'
import { TbFileText } from "react-icons/tb";
import { TbClock24, TbCheck, TbAlertTriangle, TbX } from "react-icons/tb";
import { MdOutlineArrowForwardIos } from "react-icons/md";
import LetterView from '../../../components/user/leave-letter/LetterView'
import { readTheLetters } from '../../../assets/javascript/l2-helper'


const LeaveApp = ({ setPageHead }) => {

    const limit = 10
    const [modal, setModal] = useState({ status: false })
    const [data, setData] = useState([])
    const [page, setPage] = useState(1)
    const dispatch = useDispatch()
    const [loading, setLoading] = useState('fetch')
    const [count, setCount] = useState(0)
    const [totalLeave, setTotalLeave] = useState(0)
    const { user } = useSelector((state) => state.userAuth)

    const handleOpenModal = (title, content) => {
        setModal({ status: true, title, content })
    }

    const handleCancelLeave = (id) => {
        const ask = window.confirm('Are you cancel this application ?')
        if (ask) {
            ttSv2Axios.delete(`/L2/action/cancel?_id=${id}&self_cancel=yes`).then(() => {
                setData(data?.map((item) => {
                    if (item._id === id) {
                        return {
                            ...item,
                            leave_status: 'Cancelled',
                            action_date_time: new Date(),
                            self_action: true
                        }
                    }
                    return item
                }))
                setModal({ status: false })
            }).catch((error) => {
                dispatch(toast.push.error({ message: error.message }))
            })
        }

    }

    const findDays = (status) => {
        return status === 'Approved' ? 'approved_days' : 'requested_days';
    };

    useEffect(() => {
        setPageHead({ title: "Leave Application" })
        setLoading('fetch')
        ttSv2Axios.get(`/L2/leaves?page=${page}&limit=${limit}&staff_id=${user?.acc_id}`).then((response) => {
            const letters = readTheLetters(response?.data?.list || [])
            setData([...data, ...letters])
            setCount(response.data?.count || 0)
            setLoading('')

            ttSv2Axios.get(`/L2/staff/total-leave?month=${YYYYMMDDFormat(new Date()).slice(0, 7)}`).then((result) => {
                setTotalLeave(result.data?.total_leave || 0)
            })
        }).catch((error) => {
            dispatch(toast.push.error({ message: error.message }))
            setLoading('')
        })

        // eslint-disable-next-line
    }, [page])

    return (
        <div className="leave-app-page-div">
            <Modal modal={modal} setModal={setModal} />
            {data?.[0] && <div className="report-info-div">
                <h2>{totalLeave}</h2>
                <p>This Month Total Leaves</p>
            </div>}
            <div className="item-list-div">
                {data?.map((item) => <div key={item?.token_id} className="item-box" onClick={() => handleOpenModal(item?.token_id, <LetterView data={item} cancelLeave={handleCancelLeave} />)}>
                    <div className={`item-icon-status ${item?.leave_status} ${item.edited && 'Edited'}`}>
                        {item?.leave_status === 'Pending' && <TbClock24 />}
                        {item?.leave_status === 'Approved' && <TbCheck />}
                        {item?.leave_status === 'Rejected' && <TbAlertTriangle />}
                        {item?.leave_status === 'Cancelled' && <TbX />}
                    </div>
                    <div className={`item-text-div`}>
                        <p>{item?.token_id} | {new Date(item?.reg_date_time).toDateString()}</p>
                        {item?.[findDays(item?.leave_status)]?.length > 1
                            ? <h4>{new Date(item?.[findDays(item?.leave_status)]?.[0]?.[0]).toDateString()} to {new Date(item?.[findDays(item?.leave_status)]?.[item?.[findDays(item?.leave_status)]?.length - 1]?.[0]).toDateString()} ({item?.[findDays(item?.leave_status)]?.length} Days)</h4>
                            : <h4>{new Date(item?.[findDays(item?.leave_status)]?.[0]?.[0]).toDateString()} ({Number(item?.[findDays(item?.leave_status)]?.[0]?.[1]) < 1 ? item?.[findDays(item?.leave_status)]?.[0]?.[2] === '09:30' ? 'Before noon' : 'After noon' : '1 Day'})</h4>}
                        {item?.leave_status === 'Pending' && <p className='action-text'>Action will be taken within 24 hours</p>}
                    </div>
                    <div className="arrow-icon-div">
                        <MdOutlineArrowForwardIos />
                    </div>
                </div>)}

                {/* See More */}
                {count > page * limit
                    && < SingleButton name={'Show more'} style={{ width: '100%' }} classNames={'lg btn-secondary'} onClick={() => setPage(page + 1)} />}

            </div>

            {/* Loading */}
            {loading === 'fetch' && !data[0] &&
                <SpinWithMessage height={'400px'} load />
            }

            {/* If any leave  */}
            {data?.[0] && <div className="app-icon-div">
                <SingleButton title={'Register leave'} stIcon={<FaPlus />} classNames={'icon-only btn-tertiary'} style={{ padding: '15px', fontSize: '25px', borderRadius: '100px' }}
                    onClick={() => handleOpenModal("Leave Registration", <LeaveReg setModal={setModal} setData={setData} />)} />
            </div>}

            {/* If not leaves */}
            {!data?.[0] && loading !== 'fetch' &&
                <>
                    <SpinWithMessage message='Start your first leave request easily with this button.' height={'400px'} icon={<TbFileText />} bottomContent={
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <SingleButton name={'Apply leave letter'} classNames={'btn-tertiary'} onClick={() => handleOpenModal("Leave Registration", <LeaveReg setModal={setModal} setData={setData} />)} />
                        </div>
                    } />
                </>
            }
        </div>
    )
}

export default LeaveApp