import React, { useState } from 'react'
import './punching.scss'
import { ttSv2Axios } from '../../../config/axios'
import { toast } from '../../../redux/features/user/systemSlice'
import { useDispatch, useSelector } from 'react-redux'
import { setWorkData } from '../../../redux/features/user/workdataSlice'
import { MdLogin, MdLogout } from 'react-icons/md'
import { YYYYMMDDFormat } from '../../../assets/javascript/date-helper'
import SwipeSlider from '../semi-work-details/SwipeSlider'

function Punching({ punch }) {
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.userAuth)
    const { internet } = useSelector((state) => state.systemInfo)
    const { workDetails } = useSelector((state) => state.workData)
    const [loading, setLoading] = useState('')

    // Handle PunchIn
    const handlePunchIn = () => {
        if (punch?.in) {
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

    // Handle PunchOut
    const handlePunchOut = () => {
        if (punch?.out) {
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

    return (
        <div className='punching'>
            <div className="punching-border">
                {punch?.in && (
                    <SwipeSlider
                        onSwipe={handlePunchIn}
                        text="Slide to Punch In"
                        variant="in"
                        isLoading={loading === 'punchIn'}
                        icon={<MdLogin />}
                    />
                )}

                {punch?.out && (
                    <SwipeSlider
                        onSwipe={handlePunchOut}
                        text="Slide to Punch Out"
                        variant="out"
                        isLoading={loading === 'punchOut'}
                        icon={<MdLogout />}
                    />
                )}
            </div>
        </div>
    )
}

export default Punching
