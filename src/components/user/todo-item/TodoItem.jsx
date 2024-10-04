import React, { useState } from 'react'
import './style.scss'
import { useDispatch, useSelector } from 'react-redux';
import { FaCheck, FaXmark } from "react-icons/fa6";
import { convertIsoToAmPm, formateDateToDayText } from '../../../assets/javascript/date-helper'
import { userAxios } from '../../../config/axios';
import { completeRegularWork } from '../../../redux/features/user/dayWorksSlice'
import { toast } from '../../../redux/features/user/systemSlice'
import { PiSpinnerBold } from "react-icons/pi";
import { offlineRegularWork } from '../../../assets/javascript/offline-helper';
import { IoRepeatOutline } from "react-icons/io5";

const TodoItem = ({ data, inWork }) => {

    const { workDetails } = useSelector((state) => state.workData)
    const { internet } = useSelector((state) => state.systemInfo)
    const [loading, setLoading] = useState('')
    const dispatch = useDispatch()

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
        <div className="todo-item-div">
            <div className="left-div">
                {data?.status === 1 ? <div className="checkbox">{loading === `do${data._id}`
                    ? <span className='loading-icon'><PiSpinnerBold /></span>
                    : ""}</div> : ""}
                {data?.status === 2 ? <div className="checkbox do-box">{loading === `do${data._id}`
                    ? <span className='loading-icon'><PiSpinnerBold /></span>
                    : <FaCheck />}</div> : ""}
                {data?.status === -1 ? <div className="checkbox wont-box">{loading === `do${data._id}`
                    ? <span className='loading-icon'><PiSpinnerBold /></span>
                    : <FaXmark />}</div> : ""}

                <div className='todo-text'>
                    <p>{data?.title}</p>
                </div>
            </div>
            {data?.due_date ? <div className="right-div">
                {data?.frequency ? <IoRepeatOutline /> : ''}
                <p className='expire'>{formateDateToDayText(new Date(data?.due_date))} {!data?.is_daily && convertIsoToAmPm(new Date(data?.due_date))}</p>
            </div> : ""}
        </div >
    )
}

export default TodoItem