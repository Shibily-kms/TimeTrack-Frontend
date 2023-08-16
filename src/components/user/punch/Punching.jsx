import React, { useState } from 'react'
import './punching.scss'
import { userAxios } from '../../../config/axios'
import { toast } from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import {
    offlineStartBreak, offlineEndBreak, offlineStartLunchBreak, offlineEndLunchBreak
} from '../../../assets/javascript/offline-helper'
import {
    setWorkData, doStartBreak, doEndBreak, doLunchBreak, doStartOverTime, doStopOverTime
} from '../../../redux/features/user/workdataSlice'
import { setRegularWork } from '../../../redux/features/user/dayWorksSlice'
import { TbClockStop } from 'react-icons/tb'
import { MdLogin, MdLogout, MdLunchDining, MdMoreTime, MdOutlineTimerOff } from 'react-icons/md'
import { BiLoaderAlt } from 'react-icons/bi'

function Punching({ punch, theBreak, lunchBreak, overTime }) {
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.userAuth)
    const { internet } = useSelector((state) => state.network)
    const { workDetails } = useSelector((state) => state.workData)
    const [loading, setLoading] = useState('')

    // Handle PunchIn
    const handlePunchIn = () => {
        if (!workDetails?.punch_in) {
            let confirm = window.confirm('Are you punching?')
            if (confirm) {
                if (internet) {
                    setLoading('punchIn')
                    userAxios.post('/punch-in', { designation: user?.designation?.designation }).then((response) => {
                        userAxios.get('/works/' + user?.designation?._id).then((works) => {
                            response.data.data.offBreak = []
                            response.data.data.lunch_break = {}
                            dispatch(setRegularWork(works.data.data))
                            dispatch(setWorkData(response.data.data))
                            toast.success(response.data.message)
                            setLoading('')
                        })
                    }).catch((error) => {
                        setLoading('')
                        toast.error(error.response.data.message)
                    })
                } else {
                    toast.error('Must have Internet')
                }
            }
        }
    }
    // Handle PunchOut
    const handlePunchOut = () => {
        if (!workDetails?.punch_out) {
            let confirm = window.confirm('Are you Punching out?')
            if (confirm) {
                if (internet) {
                    setLoading('punchOut')
                    userAxios.post('/punch-out', { id: workDetails._id }).then((response) => {
                        dispatch(setWorkData({
                            ...workDetails,
                            punch_out: response.data.data.punch_out
                        }))
                        toast.success(response.data.message)
                        setLoading('')
                    }).catch((error) => {
                        toast.error(error.response.data.message)
                        setLoading('')
                    })
                } else {
                    toast.error('Must have Internet')
                }
            }
        }
    }
    // Handle Start break
    const handleStartBreak = () => {
        if ((workDetails.punch_in && !workDetails.punch_out) || (workDetails.over_time.in && !workDetails.over_time.out)) {
            let confirm = window.confirm('Are you starting a break?')
            if (confirm) {
                setLoading('breakStart')
                if (internet) {
                    userAxios.post('/start-break', { id: workDetails._id }).then((response) => {
                        dispatch(doStartBreak(response.data.data))
                        toast.success(response.data.message)
                        setLoading('')
                    }).catch((error) => {
                        setLoading('')
                        toast.error(error.response.data.message)
                    })
                } else {
                    const oneBreak = offlineStartBreak()
                    dispatch(doStartBreak(oneBreak))
                    toast.success('Break Started')
                    setLoading('')
                }
            }
        }
    }
    // Handle End Break
    const handleEndBreak = () => {
        if ((workDetails.punch_in || workDetails.over_time.in) && workDetails.break.start && !workDetails.break.end) {
            let confirm = window.confirm('Are you ending a break?')
            if (confirm) {
                setLoading('breakEnd')
                if (internet) {
                    userAxios.post('/end-break', { id: workDetails._id, break_id: workDetails.break._id }).then((response) => {
                        dispatch(doEndBreak(response.data.data))
                        toast.success(response.data.message)
                        setLoading('')
                    }).catch((error) => {
                        setLoading('')
                        toast.error(error.response.data.message)
                    })
                } else {
                    const oneBreak = offlineEndBreak(workDetails.break)
                    dispatch(doEndBreak(oneBreak))
                    toast.success('Break Ended')
                    setLoading('')
                }
            }
        }
    }
    // Handle Start Lunch break
    const handleStartLunchBreak = () => {

        if ((workDetails.punch_in && !workDetails.punch_out) || (workDetails.over_time.in && !workDetails.over_time.out)) {
            let confirm = window.confirm('Are you starting lunch break?')
            if (confirm) {
                if (internet) {
                    setLoading('lunchStart')
                    userAxios.post('/start-lunch-break', { id: workDetails._id }).then((response) => {
                        dispatch(doLunchBreak({ ...response.data.data, save: true }))
                        toast.success(response.data.message)
                        setLoading('')
                    }).catch((error) => {
                        setLoading('')
                        toast.error(error.response.data.message)
                    })
                } else {
                    const oneBreak = offlineStartLunchBreak()
                    dispatch(doLunchBreak({ ...oneBreak, save: false }))
                    toast.success('Break Started')
                    setLoading('')
                }
            }
        }
    }
    // Handle End Lunch break
    const handleEndLunchBreak = () => {
        if ((workDetails.punch_in || workDetails.over_time.in) && workDetails?.lunch_break?.start && !workDetails?.lunch_break?.end) {
            let confirm = window.confirm('Are you ending lunch break?')
            if (confirm) {
                setLoading('lunchEnd')
                if (internet) {
                    userAxios.post('/end-lunch-break', { id: workDetails._id }).then((response) => {
                        dispatch(doLunchBreak(response.data.data))
                        toast.success(response.data.message)
                        setLoading('')
                    }).catch((error) => {
                        toast.error(error.response.data.message)
                        setLoading('')
                    })
                } else {
                    const oneBreak = offlineEndLunchBreak(workDetails.lunch_break)
                    dispatch(doLunchBreak(oneBreak))
                    toast.success('Break Ended')
                    setLoading('')
                }
            }
        }
    }
    // Handle Over Time In
    const handleOverTimeIn = () => {
        if (workDetails.punch_out) {
            let confirm = window.confirm('Are you start over time?')
            if (confirm) {
                if (internet) {
                    setLoading('overIn')
                    userAxios.post('/start-over-time', { id: workDetails._id }).then((response) => {
                        dispatch(doStartOverTime())
                        toast.success('Over time Started')
                        setLoading('')
                    }).catch((error) => {
                        toast.error(error.response.data.message)
                        setLoading('')
                    })
                } else {
                    toast.error('Must have Internet')
                }
            }
        }
    }
    // Handle Over Time Out
    const handleOverTimeOut = () => {
        let confirm = window.confirm('Are you stop over time?')
        if (confirm) {
            if (internet) {
                setLoading('overOut')
                userAxios.post('/stop-over-time', { id: workDetails._id }).then((response) => {
                    dispatch(doStopOverTime())
                    toast.success('Over time Stopped')
                    setLoading('')
                }).catch((error) => {
                    toast.error(error.response.data.message)
                    setLoading('')
                })
            } else {
                toast.error('Must have Internet')
            }
        }
    }

    return (
        <div className='punching' >
            <div className="boader">
                {/* Punch */}
                <button className={punch?.in ? "punch" : "opacity punch"} onClick={handlePunchIn}>
                    <span className={loading === 'punchIn' && 'loading-icon'}>{loading === 'punchIn' ? <BiLoaderAlt /> : <MdLogin />}</span>
                    <span>PUNCH IN </span></button>
                <button className={punch?.out ? "punch" : "opacity punch"} onClick={handlePunchOut}>
                    <span className={loading === 'punchOut' && 'loading-icon'}>{loading === 'punchOut' ? <BiLoaderAlt /> : <MdLogout />}</span>
                    <span>PUNCH OUT </span></button>

                {/* Over Time */}
                <button className={overTime?.in ? "punch" : "opacity punch"} onClick={handleOverTimeIn}>
                    <span className={loading === 'overIn' && 'loading-icon'}>{loading === 'overIn' ? <BiLoaderAlt /> : <MdMoreTime />}</span>
                    <span>OVER TIME IN </span></button>
                <button className={overTime?.out ? "punch" : "opacity punch"} onClick={handleOverTimeOut}>
                    <span className={loading === 'overOut' && 'loading-icon'}>{loading === 'overOut' ? <BiLoaderAlt /> : <MdOutlineTimerOff />}</span>
                    <span>OVER TIME OUT </span></button>

                {/* Break */}
                <button className={theBreak?.start ? "break" : "opacity break"} onClick={handleStartBreak}>
                    <span className={loading === 'breakStart' && 'loading-icon'}>{loading === 'breakStart' ? <BiLoaderAlt /> : <TbClockStop />}</span>
                    <span>START BREAK </span></button>

                <button className={theBreak?.end ? "break" : "opacity break"} onClick={handleEndBreak}>
                    <span className={loading === 'breakEnd' && 'loading-icon'}>{loading === 'breakEnd' ? <BiLoaderAlt /> : <TbClockStop />}</span>
                    <span>END BREAK </span></button>

                {/* Lunch Break */}
                <button className={lunchBreak?.start ? "break" : "opacity break"} onClick={handleStartLunchBreak}>
                    <span className={loading === 'lunchStart' && 'loading-icon'}>{loading === 'lunchStart' ? <BiLoaderAlt /> : <MdLunchDining />} </span>
                    <span>START LUNCH BREAK </span></button>
                <button className={lunchBreak?.end ? "break" : "opacity break"} onClick={handleEndLunchBreak}>
                    <span className={loading === 'lunchEnd' && 'loading-icon'}>{loading === 'lunchEnd' ? <BiLoaderAlt /> : <MdLunchDining />}</span>
                    <span>END LUNCH BREAK </span></button>

            </div>
        </div >
    )
}

export default Punching