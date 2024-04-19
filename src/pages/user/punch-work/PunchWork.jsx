import React, { useEffect, useState } from 'react'
import Punching from '../../../components/user/punch/Punching'
import WorkDetails from '../../../components/user/semi-work-details/WorkDetails'
import { useDispatch, useSelector } from 'react-redux'
import { getPunchDetails } from '../../../redux/features/user/workdataSlice'
import { punchDataHelper } from '../../../assets/javascript/work-helper'
import { YYYYMMDDFormat } from '../../../assets/javascript/date-helper'


const PunchWork = ({ setPageHead }) => {
    const dispatch = useDispatch()
    const { workDetails } = useSelector((state) => state.workData)
    const { user } = useSelector((state) => state.userAuth)
    const [punch, setPunch] = useState({ in: false, out: false })
    const [theBreak, setTheBreak] = useState({ start: false, end: false })
    const [lunchBreak, setLunchBreak] = useState({ start: false, end: false })
    const [overTime, setOverTime] = useState({ in: false, out: false })


    useEffect(() => {
        setPageHead(() => ({ title: 'Punch to work' }))

        if (workDetails?.date !== YYYYMMDDFormat(new Date())) {
            dispatch(getPunchDetails())
        }
    }, [])

    useEffect(() => {
        punchDataHelper(workDetails, setPunch, setTheBreak, setLunchBreak, setOverTime)

        let checkIfAutoPunchOut = null

        if (!workDetails?.punch_out && workDetails?.punch_in) {
            // Check If Auto PunchOut
            checkIfAutoPunchOut = setInterval(() => {
                if (workDetails?.punch_in) {
                    const [punchOutHour, punchOutMinute] = user?.designation?.auto_punch_out.split(':');
                    const [nowHour, nowMinute] = new Date().toTimeString().split(':');
                    if ((nowHour + nowMinute) >= (punchOutHour + punchOutMinute) && workDetails?.punch_out === null
                        && workDetails?.punch_in) {
                        dispatch(getPunchDetails())
                        clearInterval(checkIfAutoPunchOut);
                    }
                }
            }, 10000)
        }

        return () => {
            if (checkIfAutoPunchOut) clearInterval(checkIfAutoPunchOut);
        };
        // eslint-disable-next-line
    }, [workDetails])

    return (
        <div className='punch-work-page'>
            <div className="section-one-div" style={{ display: 'flex', flexDirection: 'column', gap: "15px" }}>
                <WorkDetails />
                <Punching punch={punch} theBreak={theBreak} lunchBreak={lunchBreak} overTime={overTime} />
            </div>
        </div>
    )
}

export default PunchWork