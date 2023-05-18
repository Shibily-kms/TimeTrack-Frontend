import React from 'react'
import './punching.scss'
import { userAxios } from '../../../config/axios'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { offlineStartBreak, offlineEndBreak } from '../../../assets/javascript/offline-helper'
import { setWorkData, doStartBreak, doEndBreak, clearWorkData } from '../../../redux/features/user/workdataSlice'

function Punching({ punchDetails, setPunchDetails, punchIn, punchOut, startBreak, endBreak }) {
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.userAuth)
    const { internet } = useSelector((state) => state.network)
    const { workDetails } = useSelector((state) => state.workData)
    // Handle PunchIn
    const handlePunchIn = () => {
        if (!punchIn) {
            userAxios.post('/punch-in').then((response) => {
                userAxios.get('/works/' + user?.designation?.id).then((works) => {
                    localStorage.setItem('day_works', JSON.stringify(works.data.works));
                    response.data.work_details.offBreak = []
                    dispatch(setWorkData(response.data.work_details))
                    // setPunchDetails(response.data.work_details)
                    toast.success(response.data.message)
                })
            }).catch((error) => {
                toast.error(error.response.data.message)
            })
        }
    }
    // Handle PunchOut
    const handlePunchOut = () => {
        if (!punchOut) {
            userAxios.post('/punch-out', { id: workDetails._id }).then((response) => {
                dispatch(clearWorkData())
                toast.success(response.data.message)
            }).catch((error) => {
                toast.error(error.response.data.message)
            })
        }
    }
    // Handle Start break
    const handleStartBreak = () => {
        if (internet) {
            if (punchIn && !punchOut) {
                userAxios.post('/start-break', { id: workDetails._id }).then((response) => {
                    dispatch(doStartBreak(response.data.break))
                    toast.success(response.data.message)
                }).catch((error) => {
                    toast.error(error.response.data.message)
                })
            }
        } else {
            const oneBreak = offlineStartBreak()
            dispatch(doStartBreak(oneBreak))
            toast.success('Break Started')
        }
    }

    // Handle End Break
    const handleEndBreak = () => {
        if (punchIn && startBreak) {
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

    return (
        <div className='punching' >
            <div className="boader">
                <button className={punchIn ? "opacity" : ""} onClick={handlePunchIn}>
                    PUNCH IN</button>

                <button className={startBreak ? "opacity" : ""} onClick={handleStartBreak}>
                    START BREAK</button>

                <button className={endBreak ? "opacity" : ""} onClick={handleEndBreak}>
                    END BREAK</button>

                <button className={punchOut ? "opacity" : ""} onClick={handlePunchOut}>
                    PUNCH OUT</button>
            </div>
        </div >
    )
}

export default Punching