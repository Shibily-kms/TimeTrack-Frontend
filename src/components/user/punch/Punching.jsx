import React, { useEffect } from 'react'
import './punching.scss'
import { userAxios } from '../../../config/axios'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import {
    offlineStartBreak, offlineEndBreak, offlineStartLunchBreak, offlineEndLunchBreak
} from '../../../assets/javascript/offline-helper'
import {
    setWorkData, doStartBreak, doEndBreak, doLunchBreak, doStartOverTime, doStopOverTime
} from '../../../redux/features/user/workdataSlice'
import { setRegularWork } from '../../../redux/features/user/dayWorksSlice'

function Punching({ punch, theBreak, lunchBreak, overTime }) {
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.userAuth)
    const { internet } = useSelector((state) => state.network)
    const { workDetails } = useSelector((state) => state.workData)

    // Handle PunchIn
    const handlePunchIn = () => {
        if (!workDetails?.punch_in) {
            let confirm = window.confirm('Are you punching?')
            if (confirm) {
                if (internet) {
                    userAxios.post('/punch-in').then((response) => {
                        userAxios.get('/works/' + user?.designation?.id).then((works) => {
                            response.data.work_details.offBreak = []
                            response.data.work_details.lunch_break = {}
                            dispatch(setRegularWork(works.data.works))
                            dispatch(setWorkData(response.data.work_details))
                            toast.success(response.data.message)
                        })
                    }).catch((error) => {
                        toast.error(error.response.data.message)
                    })
                } else {
                    toast.warning('Must have Internet')
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
                    userAxios.post('/punch-out', { id: workDetails._id }).then((response) => {
                        dispatch(setWorkData({
                            ...workDetails,
                            punch_out: new Date()
                        }))
                        toast.success(response.data.message)
                    }).catch((error) => {
                        toast.error(error.response.data.message)
                    })
                } else {
                    toast.warning('Must have Internet')
                }
            }
        }
    }
    // Handle Start break
    const handleStartBreak = () => {
        if ((workDetails.punch_in && !workDetails.punch_out) || (workDetails.over_time.in && !workDetails.over_time.out)) {
            let confirm = window.confirm('Are you starting a break?')
            if (confirm) {
                if (internet) {
                    userAxios.post('/start-break', { id: workDetails._id }).then((response) => {
                        dispatch(doStartBreak(response.data.break))
                        toast.success(response.data.message)
                    }).catch((error) => {
                        toast.error(error.response.data.message)
                    })
                } else {
                    const oneBreak = offlineStartBreak()
                    dispatch(doStartBreak(oneBreak))
                    toast.success('Break Started')
                }
            }
        }
    }
    // Handle End Break
    const handleEndBreak = () => {
        if ((workDetails.punch_in || workDetails.over_time.in) && workDetails.break.start && !workDetails.break.end) {
            let confirm = window.confirm('Are you ending a break?')
            if (confirm) {
                if (internet) {
                    userAxios.post('/end-break', { id: workDetails._id, break_id: workDetails.break._id }).then((response) => {
                        dispatch(doEndBreak(response.data.break))
                        toast.success(response.data.message)
                    }).catch((error) => {
                        toast.error(error.response.data.message)
                    })
                } else {
                    const oneBreak = offlineEndBreak(workDetails.break)
                    dispatch(doEndBreak(oneBreak))
                    toast.success('Break Ended')
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
                    userAxios.post('/start-lunch-break', { id: workDetails._id }).then((response) => {
                        dispatch(doLunchBreak(response.data.lunch_break))
                        toast.success(response.data.message)
                    }).catch((error) => {
                        toast.error(error.response.data.message)
                    })
                } else {
                    const oneBreak = offlineStartLunchBreak()
                    dispatch(doLunchBreak(oneBreak))
                    toast.success('Break Started')
                }
            }
        }
    }
    // Handle End Lunch break
    const handleEndLunchBreak = () => {
        if ((workDetails.punch_in || workDetails.over_time.in) && workDetails?.lunch_break?.start && !workDetails?.lunch_break?.end) {
            let confirm = window.confirm('Are you ending lunch break?')
            if (confirm) {
                if (internet) {
                    userAxios.post('/end-lunch-break', { id: workDetails._id }).then((response) => {
                        dispatch(doLunchBreak(response.data.lunch_break))
                        toast.success(response.data.message)
                    }).catch((error) => {
                        toast.error(error.response.data.message)
                    })
                } else {
                    const oneBreak = offlineEndLunchBreak(workDetails.lunch_break)
                    dispatch(doLunchBreak(oneBreak))
                    toast.success('Break Ended')
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
                    userAxios.post('/start-over-time', { id: workDetails._id }).then((response) => {
                        dispatch(doStartOverTime())
                        toast.success('Over time Started')
                    }).catch((error) => {
                        toast.error(error.response.data.message)
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
                userAxios.post('/stop-over-time', { id: workDetails._id }).then((response) => {
                    dispatch(doStopOverTime())
                    toast.success('Over time Stopped')
                }).catch((error) => {
                    toast.error(error.response.data.message)
                })
            } else {
                toast.error('Must have internet')
            }
        }
    }

    return (
        <div className='punching' >
            <div className="boader">
                {/* Punch */}
                <button className={punch?.in ? "punch" : "opacity punch"} onClick={handlePunchIn}>
                    PUNCH IN</button>
                <button className={punch?.out ? "punch" : "opacity punch"} onClick={handlePunchOut}>
                    PUNCH OUT</button>

                {/* Over Time */}
                <button className={overTime?.in ? "punch" : "opacity punch"} onClick={handleOverTimeIn}>
                    OVER TIME IN</button>
                <button className={overTime?.out ? "punch" : "opacity punch"} onClick={handleOverTimeOut}>
                    OVER TIME OUT</button>

                {/* Break */}
                <button className={theBreak?.start ? "break" : "opacity break"} onClick={handleStartBreak}>
                    START BREAK</button>

                <button className={theBreak?.end ? "break" : "opacity break"} onClick={handleEndBreak}>
                    END BREAK</button>

                {/* Lunch Break */}
                <button className={lunchBreak?.start ? "break" : "opacity break"} onClick={handleStartLunchBreak}>
                    START LUNCH BREAK</button>
                <button className={lunchBreak?.end ? "break" : "opacity break"} onClick={handleEndLunchBreak}>
                    END LUNCH BREAK</button>


            </div>
        </div >
    )
}

export default Punching