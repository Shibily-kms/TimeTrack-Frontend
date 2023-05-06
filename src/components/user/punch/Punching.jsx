import React from 'react'
import './punching.scss'
import { userAxios } from '../../../config/axios'
import { toast } from 'react-toastify'

function Punching({ punchDetails, setPunchDetails, punchIn, punchOut, startBreak, endBreak }) {

    // Handle PunchIn
    const handlePunchIn = () => {
        if (!punchIn) {
            userAxios.post('/punch-in').then((response) => {
                setPunchDetails(response.data.work_details)
                toast.success(response.data.message)
            }).catch((error) => {
                toast.error(error.response.data.message)
            })
        }
    }
    // Handle PunchOut
    const handlePunchOut = () => {
        if (!punchOut) {
            userAxios.post('/punch-out', { id: punchDetails._id }).then((response) => {
                setPunchDetails({
                    ...punchDetails,
                    punch_out: response.data.punch_out
                })
                toast.success(response.data.message)
            }).catch((error) => {
                toast.error(error.response.data.message)
            })
        }
    }
    // Handle Start break
    const handleStartBreak = () => {
        if (punchIn && !punchOut) {
            userAxios.post('/start-break', { id: punchDetails._id }).then((response) => {
                setPunchDetails({
                    ...punchDetails,
                    break: response.data.break
                })
                toast.success(response.data.message)
            }).catch((error) => {
                toast.error(error.response.data.message)
            })
        }
    }

    // Handle End Break
    const handleEndBreak = () => {
        if (punchIn && startBreak) {
            userAxios.post('/end-break', { id: punchDetails._id, break_id: punchDetails.break._id }).then((response) => {
                setPunchDetails({
                    ...punchDetails,
                    break: response.data.break
                })
                toast.success(response.data.message)
            }).catch((error) => {
                toast.error(error.response.data.message)
            })
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