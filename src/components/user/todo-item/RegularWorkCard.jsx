import React, { useState } from 'react'
import './style.scss'
import { useDispatch, useSelector } from 'react-redux';
import { FaCheck, FaTrash, FaPencil, FaCircleInfo } from "react-icons/fa6";
import { GoDotFill } from "react-icons/go";
import { convertIsoToAmPm } from '../../../assets/javascript/date-helper'
import { adminAxios, userAxios } from '../../../config/axios';
import { deleteRegularWork, completeRegularWork } from '../../../redux/features/user/dayWorksSlice'
import { toast } from '../../../redux/features/user/systemSlice'
import { PiSpinnerBold } from "react-icons/pi";
import { offlineRegularWork } from '../../../assets/javascript/offline-helper';

const RegularWorkCard = ({ allWork, data, setData, openWorkModal, inWork, admin }) => {
    const baseApiAxios = admin ? adminAxios : userAxios
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const { workDetails } = useSelector((state) => state.workData)
    const { internet } = useSelector((state) => state.systemInfo)
    const [loading, setLoading] = useState('')
    const dispatch = useDispatch()

    const handleDelete = (id) => {
        const ask = window.confirm('Are you delete this todo ?')
        if (ask) {
            setLoading('delete' + id)
            baseApiAxios.delete(`/regular-work?work_id=${id}`).then(() => {
                if (admin) {
                    setData((state) => state.filter((item) => item._id !== data._id))
                } else {
                    dispatch(deleteRegularWork(id))
                }
                setLoading('')
                dispatch(toast.push.success({ message: 'Removed form list' }))
            }).catch((error) => {
                setLoading('')
                dispatch(toast.push.error({ message: error.message }))
            })
        }
    }

    const handleDoWork = (id) => {
        const ask = window.confirm('Are you check the todo ?')
        if (ask) {
            if (!inWork) {
                return dispatch(toast.push.error({ message: 'Please enter to work' }))
            }

            setLoading('do' + id)
            if (internet) {
                userAxios.get(`/regular-work/${workDetails._id}/do?work=${data.title}`).then((response) => {
                    setLoading('')
                    dispatch(completeRegularWork(response.data))
                    dispatch(toast.push.success({ message: 'Successfully completed' }))
                }).catch((error) => {
                    setLoading('')
                    dispatch(toast.push.error({ message: error.message }))
                })
            } else {
                const oneRegWork = offlineRegularWork(data?.title)
                dispatch(completeRegularWork(oneRegWork))
                dispatch(toast.push.success({ message: 'Regular work added' }))
                setLoading('')
            }
        }
    }

    return (
        <div className="regular-work-card-div">
            <div className="left-div">
                {!allWork && <>
                    {data?.finished
                        ? <div className="checkbox selected-box"><FaCheck /></div>
                        : <div className="checkbox" onClick={() => handleDoWork(data?._id)}>
                            {loading === `do${data._id}`
                                ? <span className='loading-icon'><PiSpinnerBold /></span>
                                : <GoDotFill />}
                        </div>
                    }
                </>
                }
                <div>
                    <p>{data?.title}</p>
                    {allWork && <>
                        {data?.repeat_type === 'monthly' && <small>Monthly : {data?.monthly?.length === 31 ? "All Days" : [...data?.monthly]?.sort((a, b) => a - b)?.map((day) => (`${day}, `))}</small>}
                        {data?.repeat_type === 'weekly' && <small>Weekly : {data?.weekly?.length === 7 ? "All Days" : [...data.weekly].sort((a, b) => a - b).map(day => `${daysOfWeek[day]}, `)}</small>}
                        {data?.repeat_type === 'daily' && <small>Daily : Interval : 1</small>}
                        {(data?.one_time && !data?.one_time_scheduled) && <small>No Repeat</small>}
                        {(data?.one_time && data?.one_time_scheduled) && <small>Scheduled to {new Date(data?.one_time_scheduled).toDateString()}</small>}
                    </>
                    }
                </div>
            </div>
            <div className="right-div">
                {!allWork && data?.do_time && <p>{convertIsoToAmPm(new Date(data?.do_time))}</p>}
                {allWork && <>
                    {data?.finished
                        ? <p><FaCircleInfo /> Attended</p>
                        : ((admin && !data?.self_start) || (!admin && data?.self_start)) ? <>
                            <FaPencil onClick={() => openWorkModal('Update Regular Work', data)} />
                            {loading === `delete${data._id}`
                                ? <span className='loading-icon'><PiSpinnerBold /></span>
                                : <FaTrash onClick={() => handleDelete(data?._id)} />}
                        </> : <p><FaCircleInfo /> {admin ? "Staff Only" : "Admin only"}</p>}
                </>}
            </div>
        </div >
    )
}

export default RegularWorkCard