import React, { useState } from 'react'
import './work.scss'
import { userAxios } from '../../../config/axios'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'
import { completeWork } from '../../../redux/features/user/dayWorksSlice'
import { offlineRegularWork, offlineExtraWork } from '../../../assets/javascript/offline-helper'
import { addRegularWork, addExtraWork } from '../../../redux/features/user/workdataSlice'
import { BiLoaderAlt } from 'react-icons/bi'
import { BsTags } from 'react-icons/bs'
import SpinnerWithMessage from '../../common/spinners/SpinWithMessage'

function Work({ punch, theBreak, lunchBreak, overTime }) {
    const dispatch = useDispatch()
    const [extraWork, setExtraWork] = useState('')
    const { workDetails } = useSelector((state) => state.workData)
    const { internet } = useSelector((state) => state.network)
    const { regular } = useSelector((state) => state.dayWorks)
    const [loading, setLoading] = useState('')

    const handleWork = (e) => {
        let confirm = window.confirm('Are you completing this work ?')
        if (confirm) {
            setLoading(e.target.value)
            if (internet) {
                userAxios.post('/regular-work', { work: e.target.value, punch_id: workDetails._id }).then((response) => {
                    dispatch(completeWork({ thisWork: e.target.value }))
                    toast.success('Work Completed')
                    setLoading('')
                }).catch((error) => {
                    toast.error(error.response.data.message)
                    setLoading('')
                })
            } else {
                const oneRegularWork = offlineRegularWork(e.target.value)
                dispatch(addRegularWork(oneRegularWork))
                dispatch(completeWork({ thisWork: e.target.value }))
                toast.success('Work Completed')
                setLoading('')
            }
        }
    }

    const handleChange = (e) => {
        setExtraWork(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setExtraWork('')
        setLoading('extra-work-submit-loading')
        if (internet) {
            userAxios.post('/extra-work', { work: extraWork, punch_id: workDetails._id }).then((response) => {
                toast.success(response.data.message)
                setLoading('')
            }).catch((error) => {
                setLoading('')
                toast.error(error.response.data.message)
            })
        } else {
            const oneExtraWork = offlineExtraWork(extraWork)
            dispatch(addExtraWork(oneExtraWork))
            toast.success('Extra work added')
            setLoading('')
        }
    }

    return (
        <div className='work'>
            <div className="boader">
                {(!punch?.in && punch?.out) || (!overTime?.in && overTime?.out) ? <div className='main-div'>
                    <div className="left">
                        <div className="title">
                            <h4>Regular Works</h4>
                        </div>
                        <div className="regular">
                            {regular?.[0] ?
                                regular.map((work) => {
                                    return <div className="input-div" key={work.work} >
                                        {loading === work.work ?
                                            <span className='loading-icon'><BiLoaderAlt /></span> :
                                            <input type="checkbox" name='work' checked={work.finished ? true : false}
                                                id={work.work} value={work.work} onChange={(e) => work.finished ? null : handleWork(e)} />
                                        }
                                        <label htmlFor={work.work}>{work.work}</label>
                                    </div>
                                }) : <div className='no-data'>
                                    <SpinnerWithMessage message='No regular works' icon={<BsTags />} spin={false} />
                                </div>}
                        </div>
                    </div>
                    <div className="right">
                        <div className="title">
                            <h4>Extra works</h4>
                        </div>
                        <div className="extra">
                            <div className="inputs">
                                <form onSubmit={handleSubmit}>
                                    <div className="input-div">
                                        <input type="text" placeholder='Enter extra work...' value={extraWork} name='work' required onChange={handleChange} />
                                    </div>
                                    <div className="button-div">
                                        <button type={loading === 'extra-work-submit-loading' ? 'button' : 'submit'}>
                                            {loading === 'extra-work-submit-loading' ?
                                                <span className='loading-icon'><BiLoaderAlt /></span> : 'Add'}</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                    :
                    <div>
                        <div className="box">
                            {punch?.in && <h5>Punch In to Work</h5>}
                            {!theBreak?.end && !punch?.in && !punch?.out && !lunchBreak?.end &&
                                !workDetails?.over_time?.in && <h5>{workDetails?.auto_punch_out ? 'Auto punched Out' : 'Punched Out'}</h5>}
                            {!theBreak?.start && theBreak?.end && <h5>You are on break</h5>}
                            {!lunchBreak?.start && lunchBreak?.end && <h5>You are on lunch break</h5>}
                            {workDetails?.over_time?.out && <h5>Over Time Ended</h5>}
                        </div>
                    </div>
                }

            </div>
        </div>
    )
}

export default Work