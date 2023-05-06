import React, { useEffect, useState } from 'react'
import './work.scss'
import { userAxios } from '../../../config/axios'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'

function Work({ punchDetails, punchIn, punchOut, startBreak, endBreak }) {
    const [works, setWorks] = useState([])
    const [extraWork, setExtraWork] = useState('')
    const { user } = useSelector((state) => state.userAuth)

    const handleWork = (e) => {
        userAxios.post('/regular-work', { work: e.target.value, punch_id: punchDetails._id }).then((response) => {
            setWorks((state) => {
                return state.map((value) => {
                    if (value.works === e.target.value) {
                        return {
                            ...value,
                            finished: true
                        }
                    }
                    return value
                })
            })
        })
    }

    const handleChange = (e) => {
        setExtraWork(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setExtraWork('')
        userAxios.post('/extra-work', { work: extraWork, punch_id: punchDetails._id }).then((response) => {
            toast.success(response.data.message)
        })
    }

    useEffect(() => {
        userAxios.get('/works/' + user?.designation?.id).then((response) => {
            setWorks(response.data.works)
        })
    }, [])


    return (
        <div className='work'>
            <div className="boader">
                {punchIn && !startBreak && !punchOut ? <div>
                    <div className="title">
                        <h4>Regular Works</h4>
                    </div>
                    <div className="regular">
                        {works[0] ?
                            works.map((work) => {
                                return <div className="input-div" key={work.work} >
                                    {work?.finished ? "" :
                                        <>
                                            <input type="checkbox" name='work' id={work.work} value={work.works} onChange={handleWork} />
                                            <label htmlFor={work.work}>{work.works}</label>
                                        </>}
                                </div>
                            }) : 'null'}
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
                            {endBreak && punchIn && punchOut && <h5>Punched Out</h5>}
                            {startBreak && !endBreak && <h5>Your Break Started</h5>}
                        </div>
                    </div>
                }

            </div>
        </div>
    )
}

export default Work