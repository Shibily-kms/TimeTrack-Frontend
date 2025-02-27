import React, { useState } from 'react'
import './style.scss';
import NormalInput from '../../common/inputs/NormalInput'
import SelectInput from '../../common/inputs/SelectInput'
import SingleButton from '../../common/buttons/SingleButton';
import { toast } from '../../../redux/features/user/systemSlice'
import { useDispatch, useSelector } from 'react-redux';
import { ttCv2Axios, ttSv2Axios } from '../../../config/axios';
import { GoTrash } from 'react-icons/go';
import { LuPencil } from 'react-icons/lu';
import { HiCheck, HiFlag } from 'react-icons/hi';
import { GrUndo } from "react-icons/gr";
import { FaXmark } from 'react-icons/fa6';
import { IoRepeatOutline } from 'react-icons/io5';
import { convertIsoToAmPm, formateDateToDayText, YYYYMMDDFormat } from '../../../assets/javascript/date-helper';
import { PiSpinnerBold } from 'react-icons/pi';
import { AiOutlineClear } from 'react-icons/ai';

const AddEditTodo = ({ updateData, withData, setModal, admin, staff_id, setData, inWork }) => {

    const [form, setForm] = useState({
        title: updateData?.title || '',
        content: updateData?.content || '',
        frequency: updateData?.frequency || 0,
        periods: updateData?.periods || [],
        start_date: updateData?.due_date ? YYYYMMDDFormat(new Date(updateData?.due_date)) : '',
        start_time: (!updateData?.is_daily && updateData?.due_date) ? new Date(updateData?.due_date).toLocaleTimeString('en-US', {
            hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit'
        }) : "",
        priority: updateData?.priority || 0
    })
    const dispatch = useDispatch()
    const [loading, setLoading] = useState('')
    const [enableEdit, setEnableEdit] = useState(false)
    const { internet } = useSelector((state) => state.systemInfo)
    const { user } = useSelector((state) => state.userAuth)


    const repeatTypes = [
        { option: 'No repeat', value: 0, selected: updateData?.frequency === 0 },
        { option: 'Daily', value: 1, selected: updateData?.frequency === 1 },
        { option: 'Weekly', value: 2, selected: updateData?.frequency === 2 },
        { option: 'Monthly', value: 3, selected: updateData?.frequency === 3 }
    ]

    const weeks = [0, 1, 2, 3, 4, 5, 6]
    const days = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const FullNameDaysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const handleChange = (e) => {
        if (e.target.name === 'frequency') {
            setForm({
                ...form,
                [e.target.name]: Number(e.target.value),
                periods: [],
                start_date: '',
                start_time: ''
            })
            return;
        }

        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleDaySelect = (selectedDay) => {
        if (form?.periods.includes(selectedDay)) {
            setForm({
                ...form,
                periods: form?.periods.filter((day) => day !== selectedDay)
            })
        } else {
            setForm({
                ...form,
                periods: [...form.periods, selectedDay]
            })
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if ([2, 3].includes(form?.frequency) && form?.periods.length < 1) {
            dispatch(toast.push.error({ message: 'Select any days' }))
            return;
        }

        setLoading('submit')

        // Create new one
        const todoAxios = admin ? ttCv2Axios : ttSv2Axios

        if (!withData) {
            todoAxios.post('/todo/task', { ...form, staff_id }).then((response) => {
                setData((state) => [response.data, ...state])
                setModal({ status: false })
                setLoading('')
            }).catch((error) => {
                setLoading('')
                dispatch(toast.push.error({ message: error.message }))
            })
        }

        if (withData) {
            todoAxios.put(`/todo/task/${updateData?._id}`, form).then((response) => {
                setData((state) => state?.map((task) => {
                    if (task._id === updateData?._id) {
                        return response?.data
                    }
                    return task
                }))
                setModal({ status: false })
                setLoading('')
            }).catch((error) => {
                setLoading('')
                dispatch(toast.push.error({ message: error.message }))
            })
        }
    }

    // Actions
    const handleDoWork = (id) => {

        // if (!inWork) {
        //     return dispatch(toast.push.error({ message: 'Please enter to work' }))
        // }

        if (internet) {
            setLoading('do')
            ttSv2Axios.post(`/todo/task/do`, { task_id: id }).then((response) => {
                setData((state) => {
                    let currentState = state?.map((task) => {
                        if (task?._id === id) {
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
                setModal({ status: false })
                setLoading('')
            }).catch((error) => {
                setLoading('')
                dispatch(toast.push.error({ message: error.message }))
            })
        } else {
            dispatch(toast.push.error({ message: 'Network is low' }))
        }

    }

    const handleUndo = (id) => {
        // if (!inWork) {
        //     return dispatch(toast.push.error({ message: 'Please enter to work' }))
        // }

        if (internet) {
            setLoading('undo')
            ttSv2Axios.post(`/todo/task/undo`, { task_id: id }).then(() => {
                setData((state) => {
                    let currentState = state?.map((task) => {
                        if (task?._id === id) {
                            return {
                                ...task,
                                action_date: null,
                                action_by: null,
                                status: 1
                            }
                        }
                        return task
                    })
                    return currentState
                })
                setModal({ status: false })
                setLoading('')
            }).catch((error) => {
                setLoading('')
                dispatch(toast.push.error({ message: error.message }))
            })
        } else {
            dispatch(toast.push.error({ message: 'Network is low' }))
        }
    }

    const handleWontDoWork = (id) => {

        // if (!inWork) {
        //     return dispatch(toast.push.error({ message: 'Please enter to work' }))
        // }

        if (internet) {
            setLoading('wontDo')
            ttSv2Axios.post(`/todo/task/wont-do`, { task_id: id }).then((response) => {
                setData((state) => {
                    let currentState = state?.map((task) => {
                        if (task?._id === id) {
                            return {
                                ...task,
                                frequency: 0,
                                interval: 0,
                                periods: [],
                                action_date: new Date(),
                                action_by: user?.acc_id,
                                status: -1
                            }
                        }
                        return task
                    })

                    if (response?.data) {
                        currentState = [response.data, ...currentState]
                    }

                    return currentState
                })
                setModal({ status: false })
                setLoading('')
            }).catch((error) => {
                setLoading('')
                dispatch(toast.push.error({ message: error.message }))
            })
        } else {
            dispatch(toast.push.error({ message: 'Network is low' }))
        }

    }

    const handleRemove = (id) => {
        if (internet) {

            if (admin) {
                const ask = window.confirm('Are you remove permanently ?')
                if (ask) {
                    setLoading('remove')
                    ttCv2Axios.delete(`/todo/task/erase?task_id=${id}`).then(() => {
                        setData((state) => state?.filter((task) => task?._id !== id))
                        setModal({ status: false })
                        setLoading('')
                    }).catch((error) => {
                        setLoading('')
                        dispatch(toast.push.error({ message: error.message }))
                    })
                }

            } else {
                setLoading('remove')
                ttSv2Axios.delete(`/todo/task/${id}`).then(() => {
                    setData((state) => state?.filter((task) => task?._id !== id))
                    setModal({ status: false })
                    setLoading('')
                }).catch((error) => {
                    setLoading('')
                    dispatch(toast.push.error({ message: error.message }))
                })
            }
        } else {
            dispatch(toast.push.error({ message: 'Network is low' }))
        }
    }

    const handleRestore = (id) => {

        if (internet) {
            setLoading('undo')
            ttSv2Axios.post(`/todo/task/restore`, { task_id: id }).then(() => {
                setData((state) => state?.filter((task) => task?._id !== id))
                setModal({ status: false })
                setLoading('')
            }).catch((error) => {
                setLoading('')
                dispatch(toast.push.error({ message: error.message }))
            })
        } else {
            dispatch(toast.push.error({ message: 'Network is low' }))
        }
    }

    const handleErase = (id) => {

        if (internet) {
            setLoading('remove')
            ttSv2Axios.delete(`/todo/task/erase?task_id=${id}`).then(() => {
                setData((state) => state?.filter((task) => task?._id !== id))
                setModal({ status: false })
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
        <div className="add-edit-todo-div">

            {/* For Active */}
            {(withData && !enableEdit && !updateData?.deleted_by) && <div className="action-buttons-div">
                {updateData?.status !== 2 && !admin && <button className='do-button' onClick={() => handleDoWork(updateData?._id)}>
                    {loading === 'do'
                        ? <span className='loading-icon'><PiSpinnerBold /></span>
                        : <span><HiCheck /></span>}
                    <span>Do</span>
                </button>}
                {(updateData?.status === 2 || updateData?.status === -1) && !admin && <button className='undo-button' onClick={() => handleUndo(updateData?._id)}>
                    {loading === 'undo'
                        ? <span className='loading-icon'><PiSpinnerBold /></span>
                        : <span><GrUndo /></span>}
                    <span>Undo</span>
                </button>}
                {updateData?.status !== -1 && !admin && <button className='wont-button' onClick={() => handleWontDoWork(updateData?._id)}>
                    {loading === 'wontDo'
                        ? <span className='loading-icon'><PiSpinnerBold /></span>
                        : <span><FaXmark /></span>}
                    <span>Wont'do</span>
                </button>}
                {((updateData?.created_by === user?.acc_id) || (updateData?.created_by !== staff_id && admin)) && <>
                    <button className='edit-button' onClick={() => setEnableEdit(true)}><span><LuPencil /></span><span>Edit</span></button>
                    <button className='delete-button' onClick={() => handleRemove(updateData?._id)}>
                        {loading === 'remove'
                            ? <span className='loading-icon'><PiSpinnerBold /></span>
                            : <span><GoTrash /></span>}
                        <span>Remove</span>
                    </button>
                </>}
            </div>}

            {/* For Remove */}
            {(withData && !enableEdit && updateData?.deleted_by) && <div className="remove-buttons-div">
                <button className='undo-button' onClick={() => handleRestore(updateData?._id)}>
                    {loading === 'undo'
                        ? <span className='loading-icon'><PiSpinnerBold /></span>
                        : <span><GrUndo /></span>}
                    <span>Restore</span>
                </button>
                <button className='delete-button' onClick={() => handleErase(updateData?._id)}>
                    {loading === 'remove'
                        ? <span className='loading-icon'><PiSpinnerBold /></span>
                        : <span><AiOutlineClear /></span>}
                    <span>Erase</span>
                </button>
            </div>}

            {(!withData || enableEdit) &&
                <form onSubmit={handleSubmit}>
                    <NormalInput label='Title' name='title' type={'text'} value={form?.title} onChangeFun={handleChange} />
                    <NormalInput label='Content' name='content' type={'text'} value={form?.content} onChangeFun={handleChange} isRequired={false} />

                    <div className="priority-inputs">
                        <SingleButton type={'button'} stIcon={<HiFlag />} classNames={`icon-only ${!form?.priority && 'active'}`}
                            onClick={() => setForm({ ...form, priority: 0 })} />
                        <SingleButton type={'button'} stIcon={<HiFlag />} classNames={`icon-only priority1 ${form?.priority === 1 && 'active'}`}
                            onClick={() => setForm({ ...form, priority: 1 })} />
                        <SingleButton type={'button'} stIcon={<HiFlag />} classNames={`icon-only priority2 ${form?.priority === 2 && 'active'}`}
                            onClick={() => setForm({ ...form, priority: 2 })} />
                        <SingleButton type={'button'} stIcon={<HiFlag />} classNames={`icon-only priority3 ${form?.priority === 3 && 'active'}`}
                            onClick={() => setForm({ ...form, priority: 3 })} />
                    </div>

                    <SelectInput label='Repeat' values={repeatTypes} name='frequency' onChangeFun={handleChange} isRequired={false} />

                    {[2, 3].includes(form.frequency) && <div className="select-button-option-div">
                        {/* Weekly */}
                        {form.frequency === 2 && weeks.map((day, index) => <div key={day} className={form?.periods.includes(day) ? "option-div selected" : "option-div"}>
                            <div onClick={() => handleDaySelect(day)}>
                                {daysOfWeek[day]}
                            </div>
                        </div>)}
                        {/* Monthly */}
                        {form.frequency === 3 && days.map((day, index) => <div key={day} className={form?.periods.includes(day) ? "option-div selected" : "option-div"}>
                            <div onClick={() => handleDaySelect(day)}>
                                {day}
                            </div>
                        </div>)}
                    </div>}

                    <div className="form-group-div">

                        <NormalInput label={form.frequency ? 'Start on' : 'Date'} name='start_date' type={'date'} value={form?.start_date} onChangeFun={handleChange} isRequired={false} />
                        <NormalInput label='Time' name='start_time' type={'time'} value={form?.start_time} onChangeFun={handleChange} isRequired={false} />
                    </div>

                    <SingleButton type={'submit'} style={{ width: '100%' }} classNames={'lg btn-tertiary'} name={'Submit'}
                        loading={loading === 'submit'} />
                </form>}



            {/* View */}
            {(!enableEdit && withData) &&
                <div className="task-single-view-div">
                    <h3>{updateData?.title}</h3>
                    {updateData?.content && <p className='content'>{updateData?.content}</p>}
                    <div className="sub">
                        <div className="s-one">
                            {updateData?.due_date && <p className={YYYYMMDDFormat(new Date()) > YYYYMMDDFormat(new Date(updateData?.due_date)) ? 'expire' : ''}>
                                {formateDateToDayText(new Date(updateData?.due_date))}{!updateData?.is_daily && ', ' + convertIsoToAmPm(new Date(updateData?.due_date))}
                            </p>}
                            {updateData?.frequency === 3 && <small>Repeat every {updateData?.periods?.length === 31 ? "days of month" : [...updateData?.periods]?.sort((a, b) => a - b)?.map((day) => (`${day}, `))}</small>}
                            {updateData?.frequency === 2 && <small>Repeat every {updateData?.periods?.length === 7 ? "days of week" : [...updateData.periods].sort((a, b) => a - b).map(day => `${FullNameDaysOfWeek[day]}, `)}</small>}
                            {updateData?.frequency === 1 && <small>Repeat every days</small>}
                        </div>
                        <div className="s-two">
                            <span className='repeat'>
                                {updateData.frequency ? <IoRepeatOutline /> : ''}
                                {updateData?.frequency === 1 && <p>Daily</p>}
                                {updateData?.frequency === 2 && <p>Weekly</p>}
                                {updateData?.frequency === 3 && <p>Monthly</p>}
                            </span>
                            <span className={`priority${updateData?.priority}`}>
                                {updateData?.priority ? <HiFlag /> : ""}
                            </span>
                        </div>
                    </div>
                </div>}
        </div >
    )
}

export default AddEditTodo