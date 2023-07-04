import React from 'react'
import './punching.scss'
import { userAxios } from '../../../config/axios'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import {
    offlineStartBreak, offlineEndBreak, offlineStartLunchBreak, offlineEndLunchBreak
} from '../../../assets/javascript/offline-helper'
import {
    setWorkData, doStartBreak, doEndBreak, clearWorkData, doLunchBreak
} from '../../../redux/features/user/workdataSlice'
import { setRegularWork } from '../../../redux/features/user/dayWorksSlice'

function Punching({ punchIn, punchOut, startBreak, endBreak, startLunchBreak, endLunchBreak }) {
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.userAuth)
    const { internet } = useSelector((state) => state.network)
    const { workDetails } = useSelector((state) => state.workData)

    // Handle PunchIn
    const handlePunchIn = () => {
        if (!punchIn) {
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
        if (!punchOut) {
            let confirm = window.confirm('Are you Punching out?')
            if (confirm) {
                if (internet) {
                    userAxios.post('/punch-out', { id: workDetails._id }).then((response) => {
                        dispatch(clearWorkData())
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
        if (punchIn && !punchOut) {
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
        if (punchIn && startBreak && !endBreak) {
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

        if (punchIn && !punchOut && !startBreak) {
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

    const handleEndLunchBreak = () => {
        if (punchIn && startLunchBreak && !endLunchBreak) {
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

    return (
        <div className='punching' >
            <div className="boader">
                <button className={punchIn ? "opacity punch" : "punch"} onClick={handlePunchIn}>
                    PUNCH IN</button>

                <button className={punchOut ? "opacity punch" : "punch"} onClick={handlePunchOut}>
                    PUNCH OUT</button>

                <button className={startBreak ? "opacity break" : "break"} onClick={handleStartBreak}>
                    START BREAK</button>

                <button className={endBreak ? "opacity break" : "break"} onClick={handleEndBreak}>
                    END BREAK</button>

                <button className={startLunchBreak ? "opacity break" : "break"} onClick={handleStartLunchBreak}>
                    START LUNCH BREAK</button>

                <button className={endLunchBreak ? "opacity break" : "break"} onClick={handleEndLunchBreak}>
                    END LUNCH BREAK</button>


            </div>
        </div >
    )
}

export default Punching