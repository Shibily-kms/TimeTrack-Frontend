import React, { useState } from 'react'
import './work.scss'
import { userAxios } from '../../../config/axios'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { completeWork } from '../../../redux/features/user/dayWorksSlice'
import { offlineRegularWork, offlineExtraWork } from '../../../assets/javascript/offline-helper'
import { addRegularWork, addExtraWork } from '../../../redux/features/user/workdataSlice'

function Work({ punchIn, punchOut, startBreak, endBreak, startLunchBreak, endLunchBreak }) {
    const dispatch = useDispatch()
    const [extraWork, setExtraWork] = useState('')
    const { workDetails } = useSelector((state) => state.workData)
    const { internet } = useSelector((state) => state.network)
    const { regular } = useSelector((state) => state.dayWorks)

    const handleWork = (e) => {
        let confirm = window.confirm('Are you completing this work ?')
        if (confirm) {
            if (internet) {
                userAxios.post('/regular-work', { work: e.target.value, punch_id: workDetails._id }).then((response) => {
                    dispatch(completeWork({ thisWork: e.target.value }))
                    toast.success('Work Completed')
                })
            } else {
                const oneRegularWork = offlineRegularWork(e.target.value)
                dispatch(addRegularWork(oneRegularWork))
                dispatch(completeWork({ thisWork: e.target.value }))
                toast.success('Work Completed')
            }
        }
    }

    const handleChange = (e) => {
        setExtraWork(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setExtraWork('')
        if (internet) {
            userAxios.post('/extra-work', { work: extraWork, punch_id: workDetails._id }).then((response) => {
                toast.success(response.data.message)
            })
        } else {
            const oneExtraWork = offlineExtraWork(extraWork)
            dispatch(addExtraWork(oneExtraWork))
            toast.success('Extra work added')
        }
    }

    return (
        <div className='work'>
            <div className="boader">
                {punchIn && !startBreak && !punchOut ? <div>
                    <div className="title">
                        <h4>Regular Works</h4>
                    </div>
                    <div className="regular">
                        {regular?.[0] ?
                            regular.map((work) => {
                                return <div className="input-div" key={work.works} >
                                    <input type="checkbox" name='work' checked={work.finished ? true : false}
                                        id={work.works} value={work.works} onChange={(e) => work.finished ? null : handleWork(e)} />
                                    <label htmlFor={work.works}>{work.works}</label>
                                </div>
                            }) : 'no works'}
                    </div>

                    <div className="title">
                        <h4>Extra works</h4>
                    </div>
                    <div className="extra">
                        <div className="inputs">
                            <form onSubmit={handleSubmit}>
                                <div className="input-div">
                                    <input type="text" placeholder='type...' value={extraWork} name='work' required onChange={handleChange} />
                                </div>
                                <div className="button-div">
                                    <button type='submit'>Add</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                    :
                    <div>
                        <div className="box">
                            {!punchIn && <h5>Punch In to Work</h5>}
                            {endBreak && punchIn && punchOut && endLunchBreak && <h5>Punched Out</h5>}
                            {startBreak && !endBreak && <h5>You are on break</h5>}
                            {startLunchBreak && !endLunchBreak && <h5>You are on lunch break</h5>}
                        </div>
                    </div>
                }

            </div>
        </div>
    )
}

export default Work