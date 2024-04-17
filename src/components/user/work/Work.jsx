import React, { useEffect, useState } from 'react'
import './work.scss'
import { userAxios } from '../../../config/axios'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'
import { completeWork } from '../../../redux/features/user/dayWorksSlice'
import { offlineRegularWork, offlineExtraWork } from '../../../assets/javascript/offline-helper'
import { addRegularWork, addExtraWork } from '../../../redux/features/user/workdataSlice'
import { BiLoaderAlt } from 'react-icons/bi'
import SpinnerWithMessage from '../../common/spinners/SpinWithMessage'
import SingleButton from '../../../components/common/buttons/SingleButton'
import { HiPlus } from "react-icons/hi";
import { FaListCheck, FaCheck } from "react-icons/fa6";
import Modal from '../../common/modal/Modal'
import AddEditRegWork from '../add-edit-work/AddEditRegWork'
import RegularWorkCard from '../regular-work-card/RegularWorkCard'

function Work({ punch, theBreak, lunchBreak, overTime }) {
    const dispatch = useDispatch()
    const [extraWork, setExtraWork] = useState('')
    const { workDetails } = useSelector((state) => state.workData)
    const { internet } = useSelector((state) => state.systemInfo)
    const { regular } = useSelector((state) => state.dayWorks)
    const [loading, setLoading] = useState('')
    const [modal, setModal] = useState({ status: false })
    const [allRgWork, setAllRgWork] = useState(false)
    const [noTodayWorks, setNoTodayWorks] = useState(true)

    const dayOfWeekNumber = new Date().getDay();
    const dayOfMonthNumber = new Date().getDate();

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

    const openWorkModal = (title, data) => {
        setModal({ status: true, content: <AddEditRegWork setModal={setModal} updateData={data} />, title })
    }

    useEffect(() => {
        regular?.map((work) => {
            if (work?.interval === 1 || work?.weekly.includes(dayOfWeekNumber)
                || work?.monthly.includes(dayOfMonthNumber)) {
                setNoTodayWorks(false)
                return true;
            }
        })
    }, [regular])

    return (
        <div className='enter-today-div'>
            <Modal modal={modal} setModal={setModal} />
            {workDetails?.punch_in && <div className='border-div'>
                <div className="section-div section-one">
                    <div className="title">
                        <h4>{allRgWork ? 'All' : 'Today'} Regular Works</h4>
                        <div className='buttons-div'>
                            <SingleButton classNames={'sm btn-tertiary'} style={{ fontSize: '11px' }}
                                name={'New'} stIcon={<HiPlus />}
                                onClick={() => openWorkModal('Add New Work')} />

                            <SingleButton classNames={allRgWork ? 'sm btn-primary' : 'sm btn-gray'} style={{ fontSize: '11px' }}
                                name={'All'} stIcon={allRgWork && <FaCheck />} onClick={() => setAllRgWork(!allRgWork)} />
                        </div>
                    </div>
                    <div className="content-div">
                        {(regular?.[0] || noTodayWorks) ?
                            regular?.map((work) => {
                                if (work?.interval === 1 || work?.weekly.includes(dayOfWeekNumber)
                                    || work?.monthly.includes(dayOfMonthNumber) || allRgWork) {
                                    return <RegularWorkCard allWork={allRgWork} data={work} openWorkModal={openWorkModal} />
                                }
                            }) : <SpinnerWithMessage message='No regular works' height={'200px'} icon={<FaListCheck />} spin={false} />
                        }
                    </div>
                </div>
                <div className="section-div section-two">
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
            }
        </div>
    )
}

export default Work