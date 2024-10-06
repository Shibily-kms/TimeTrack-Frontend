import React, { useState } from 'react'
import './style.scss'
import { useDispatch, useSelector } from 'react-redux';
import { FaCheck, FaXmark } from "react-icons/fa6";
import { convertIsoToAmPm, formateDateToDayText, YYYYMMDDFormat } from '../../../assets/javascript/date-helper'
import { ttv2Axios } from '../../../config/axios';
import { toast } from '../../../redux/features/user/systemSlice'
import { PiSpinnerBold } from "react-icons/pi";
import { IoRepeatOutline } from "react-icons/io5";

const TodoItem = ({ data, inWork, newTaskFn, setAllTodo }) => {

    const { internet } = useSelector((state) => state.systemInfo)
    const { user } = useSelector((state) => state?.userAuth)
    const [loading, setLoading] = useState('')
    const dispatch = useDispatch()

    const handleDoWork = (id) => {

        if (data?.deleted_by) {
            return;
        }

        if (!inWork) {
            return dispatch(toast.push.error({ message: 'Please enter to work' }))
        }

        if (internet) {
            setLoading('do' + id)
            ttv2Axios.post(`/todo/task/do`, { task_id: data?._id }).then((response) => {
                setAllTodo((state) => {
                    let currentState = state?.map((task) => {
                        if (task?._id === data?._id) {
                            return {
                                ...task,
                                frequency: 0,
                                interval: 0,
                                periods: [],
                                action_date: new Date(),
                                action_by: user?.acc_id,
                                status: 2
                            }
                        }
                        return task
                    })

                    if (response?.data) {
                        currentState = [response.data, ...currentState]
                    }

                    return currentState
                })
                setLoading('')
            }).catch((error) => {
                setLoading('')
                dispatch(toast.push.error({ message: error.message }))
            })
        } else {
            dispatch(toast.push.error({ message: 'Network is low' }))
        }

    }

    return (
        <div className="todo-item-div">
            <div className="checkbox-todo-div">
                {data?.status === 1 ? <div className={`checkbox priority${data?.priority}`} onClick={() => handleDoWork(data?._id)} >
                    {loading === `do${data._id}`
                        ? <span className='loading-icon'><PiSpinnerBold /></span>
                        : ""}</div> : ""}
                {data?.status === 2 ? <div className="checkbox do-box">{loading === `do${data._id}`
                    ? <span className='loading-icon'><PiSpinnerBold /></span>
                    : <FaCheck />}</div> : ""}
                {data?.status === -1 ? <div className="checkbox wont-box">{loading === `do${data._id}`
                    ? <span className='loading-icon'><PiSpinnerBold /></span>
                    : <FaXmark />}</div> : ""}
            </div>

            <div className="content-todo-div" onClick={() => (newTaskFn(data))}>
                <div className="left-div">
                    <div className='todo-text'>
                        <p>{data?.title}</p>
                    </div>
                </div>
                {data?.due_date ? <div className="right-div">
                    {data?.frequency ? <IoRepeatOutline /> : ''}
                    <p className={[-1, 2].includes(data?.status) ? 'completed'
                        : YYYYMMDDFormat(new Date()) > YYYYMMDDFormat(new Date(data?.due_date))
                            ? 'expire' : ""}>
                        {formateDateToDayText(new Date(data?.due_date))}{!data?.is_daily && ', ' + convertIsoToAmPm(new Date(data?.due_date))}
                    </p>
                </div> : ""}
            </div>

        </div >
    )
}

export default TodoItem