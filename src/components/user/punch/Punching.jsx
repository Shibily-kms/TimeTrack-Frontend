import React, { useState } from 'react'
import './punching.scss'
import { ttSv2Axios } from '../../../config/axios'
import { toast } from '../../../redux/features/user/systemSlice'
import { useDispatch, useSelector } from 'react-redux'
import { setWorkData } from '../../../redux/features/user/workdataSlice'
import { MdLogin, MdLogout } from 'react-icons/md'
import { BiLoaderAlt } from 'react-icons/bi'
import { YYYYMMDDFormat } from '../../../assets/javascript/date-helper'

function Punching({ punch }) {
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.userAuth)
    const { internet } = useSelector((state) => state.systemInfo)
    const { workDetails } = useSelector((state) => state.workData)
    const [loading, setLoading] = useState('')

    // Handle PunchIn
    const handlePunchIn = () => {
        if (punch?.in) {
            let confirm = window.confirm('Are you punch IN to work?')
            if (confirm) {
                if (internet) {
                    setLoading('punchIn')
                    ttSv2Axios.post('/work/punch/in', { do_type: 'software', designation: user?.designation }).then((response) => {
                        if (!workDetails?.name) {
                            const obj = {
                                _id: response?.data?._id,
                                name: user?.acc_id,
                                date: YYYYMMDDFormat(new Date()),
                                designation: user?.designation,
                                regular_work: [],
                                extra_work: [],
                                punch_list: [
                                    {
                                        in: new Date()?.toISOString(),
                                        out: null,
                                        in_by: 'software',
                                        out_by: null
                                    }
                                ]
                            }
                            dispatch(setWorkData(obj))
                        } else {
                            dispatch(setWorkData({
                                ...workDetails,
                                punch_list: [
                                    ...(workDetails?.punch_list || []),
                                    {
                                        in: new Date()?.toISOString(),
                                        out: null,
                                        in_by: 'software',
                                        out_by: null
                                    }
                                ]
                            }))

                        }
                        setLoading('')
                    }).catch((error) => {
                        setLoading('')
                        dispatch(toast.push.error({ message: error.message }))
                    })
                } else {
                    dispatch(toast.push.warning({ message: 'Must have Internet' }))
                }
            }
        }
    }

    // Handle PunchOut
    const handlePunchOut = () => {
        if (punch?.out) {
            let confirm = window.confirm('Are you Punch out?')
            if (confirm) {
                if (internet) {
                    setLoading('punchOut')
                    ttSv2Axios.post('/work/punch/out', { do_type: 'software' }).then((response) => {
                        const lastPunchData = workDetails?.punch_list?.[workDetails?.punch_list.length - 1] || {}
                        const workData = {
                            ...workDetails,
                            punch_list: workDetails?.punch_list?.map((item) => {
                                if (item.in === lastPunchData.in) {
                                    return {
                                        ...item,
                                        out: new Date()?.toISOString(),
                                        out_by: 'software'
                                    }
                                }
                                return item
                            })
                        }
                        dispatch(setWorkData(workData))
                        setLoading('')
                    }).catch((error) => {
                        dispatch(toast.push.error({ message: error.message }))
                        setLoading('')
                    })
                } else {
                    dispatch(toast.push.warning({ message: 'Must have Internet' }))
                }
            }
        }
    }


    return (
        <div className='punching' >
            <div className="punching-border">
                {/* Punch */}
                {punch?.in && <button className={punch?.in ? "punch" : "opacity punch"} onClick={handlePunchIn}>
                    <span className={loading === 'punchIn' && 'loading-icon'}>{loading === 'punchIn' ? <BiLoaderAlt /> : <MdLogin />}</span>
                    <span>PUNCH IN</span></button>}

                {punch?.out && <button className={punch?.out ? "punch" : "opacity punch"} onClick={handlePunchOut}>
                    <span className={loading === 'punchOut' && 'loading-icon'}>{loading === 'punchOut' ? <BiLoaderAlt /> : <MdLogout />}</span>
                    <span>PUNCH OUT</span></button>}
            </div>
        </div >
    )
}

export default Punching