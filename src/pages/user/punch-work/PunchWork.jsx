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

    useEffect(() => {
        setPageHead(() => ({ title: 'Punch to work' }))

        if (workDetails?.date !== YYYYMMDDFormat(new Date())) {
            dispatch(getPunchDetails())
        }
    }, [])

    useEffect(() => {
        punchDataHelper(workDetails, setPunch)
        // eslint-disable-next-line
    }, [workDetails])

    useEffect(() => {
        let checkIfAutoPunchOut = null

        if (punch?.out && user?.punch_type === 'software') {

            checkIfAutoPunchOut = setInterval(() => {

                if (punch?.out) {
                    const lastPunch = workDetails.punch_list?.[workDetails?.punch_list?.length - 1] || {}
                    const [lastInHour, lastInMinute] = new Date(lastPunch.in).toTimeString().split(':');
                    const [punchOutHour, punchOutMinute] = user?.auto_punch_out.split(':');

                    if ((punchOutHour + punchOutMinute) > (lastInHour + lastInMinute)) {

                        const [nowHour, nowMinute] = new Date().toTimeString().split(':');

                        if ((nowHour + nowMinute) >= (punchOutHour + punchOutMinute)) {
                            dispatch(getPunchDetails())
                            clearInterval(checkIfAutoPunchOut);
                        }
                    }
                }

            }, 10000)
        }

        return () => {
            if (checkIfAutoPunchOut) clearInterval(checkIfAutoPunchOut);
        };
        // eslint-disable-next-line
    }, [user, punch])

    return (
        <div className='punch-work-page'>
            <div className="section-one-div" style={{ display: 'flex', flexDirection: 'column', gap: "15px" }}>
                <WorkDetails />
                <Punching punch={punch} />
            </div>
        </div>
    )
}

export default PunchWork