import React, { useEffect, useState } from 'react'
import './work.scss'
import { userAxios } from '../../../config/axios'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from '../../../redux/features/user/systemSlice'
import { offlineExtraWork } from '../../../assets/javascript/offline-helper'
import { addExtraWork } from '../../../redux/features/user/workdataSlice'
import { HiPlus } from "react-icons/hi";
import { FaListCheck, FaCheck } from "react-icons/fa6";
import { IoSend } from "react-icons/io5";
import { convertIsoToAmPm, stringToLocalTime, YYYYMMDDFormat } from '../../../assets/javascript/date-helper'
import SpinnerWithMessage from '../../common/spinners/SpinWithMessage'
import SingleButton from '../../common/buttons/SingleButton'
import Modal from '../../common/modal/Modal'
import AddEditRegWork from '../add-edit-todo/AddEditTodo'
import RegularWorkCard from '../todo-item/RegularWorkCard'
import NormalInput from '../../common/inputs/NormalInput'
import { RiTodoLine } from "react-icons/ri";

function Work({ inWork }) {
    const dispatch = useDispatch()
    const [extraWork, setExtraWork] = useState('')
    const { workDetails } = useSelector((state) => state.workData)
    const { internet } = useSelector((state) => state.systemInfo)
    const { regular } = useSelector((state) => state.dayWorks)
    const { user } = useSelector((state) => state.userAuth)
    const [loading, setLoading] = useState('')
    const [modal, setModal] = useState({ status: false })
    const [allRgWork, setAllRgWork] = useState(false)
    const [noTodayWorks, setNoTodayWorks] = useState(true)
    const [doWorks, setDoWorks] = useState()

    const dayOfWeekNumber = new Date().getDay();
    const dayOfMonthNumber = new Date().getDate();


    const handleChange = (e) => {
        setExtraWork(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!inWork) {
            setExtraWork('')
            return dispatch(toast.push.error({ message: 'Please enter to work' }))
        }

        setLoading('extra')
        if (internet) {
            userAxios.post('/extra-work/do', { work: extraWork, punch_id: workDetails._id }).then((response) => {
                dispatch(toast.push.success({ message: 'New extra work added' }))
                setExtraWork('')
                dispatch(addExtraWork(response.data))
                setLoading('')
            }).catch((error) => {
                setLoading('')
                setExtraWork('')
                dispatch(toast.push.error({ message: error.message }))
            })
        } else {
            const oneExtraWork = offlineExtraWork(extraWork)
            dispatch(addExtraWork(oneExtraWork))
            dispatch(toast.push.success({ message: 'Extra work added' }))
            setExtraWork('')
            setLoading('')
        }
    }

    const openWorkModal = (title, data) => {
        setModal({ status: true, content: <AddEditRegWork setModal={setModal} updateData={data} />, title })
    }

    useEffect(() => {
        regular?.map((work) => {
            if (work?.interval === 1 || work?.weekly.includes(dayOfWeekNumber)
                || work?.monthly.includes(dayOfMonthNumber) || work?.one_time_scheduled === YYYYMMDDFormat(new Date())
                || (work?.one_time && !work?.one_time_scheduled) || !work?.finished) {
                setNoTodayWorks(false)
                return true;
            }
            return work;
        })
        // eslint-disable-next-line
    }, [regular])

    useEffect(() => {
        userAxios.get(`/analyze/staff-work-data?from_date=${YYYYMMDDFormat(new Date())}&to_date=${YYYYMMDDFormat(new Date())}&staff_id=${user?.acc_id}&type=staff-basie`)
            .then((response) => {
                setDoWorks(response?.data?.[0]?.dates?.[0]?.regular_work || [])
            })
    }, [])

    return (
        <div className='enter-today-div'>
            <Modal modal={modal} setModal={setModal} />
            <div className='border-div'>
                <div className="section-div section-one">
                    <div className="title">
                        <h4>{allRgWork ? 'All' : 'Today'} Schedules</h4>
                        <div className='buttons-div'>
                            <SingleButton classNames={'sm btn-tertiary'} style={{ fontSize: '11px' }}
                                name={'New'} stIcon={<HiPlus />}
                                onClick={() => openWorkModal('Add New Work')} />

                            <SingleButton classNames={allRgWork ? 'sm btn-primary' : 'sm btn-gray'} style={{ fontSize: '11px' }}
                                name={'All'} stIcon={allRgWork && <FaCheck />} onClick={() => setAllRgWork(!allRgWork)} />
                        </div>
                    </div>
                    {(!allRgWork && doWorks?.[0]) &&
                        <div className="work-list-div">
                            <div className="border">
                                <div className="list-body">
                                    <div className="list-head">
                                        <span></span>
                                        <span>Time</span>
                                        <span>ToDo</span>
                                    </div>
                                    {doWorks?.map((work, index) => <div key={work.start} className="list-item">
                                        <span>{index + 1}</span>
                                        <span>{stringToLocalTime(work?.start)}</span>
                                        <span>{work?.work}</span>
                                    </div>)}
                                </div>
                            </div>
                        </div>}

                    <div className="content-div">
                        {((noTodayWorks && !allRgWork) || !regular?.[0]) &&
                            <SpinnerWithMessage message='No Schedules' height={'200px'} icon={<RiTodoLine />} spin={false} />}

                        {regular?.map((work) => {
                            if (allRgWork) {
                                return <RegularWorkCard key={work._id} allWork={allRgWork} data={work} openWorkModal={openWorkModal} inWork={inWork} />
                            } else if ((work?.interval === 1 || work?.weekly.includes(dayOfWeekNumber)
                                || work?.monthly.includes(dayOfMonthNumber) || work?.one_time_scheduled === YYYYMMDDFormat(new Date())
                                || (work?.one_time && !work?.one_time_scheduled)) && !work?.finished) {
                                return <RegularWorkCard key={work._id} allWork={allRgWork} data={work} openWorkModal={openWorkModal} inWork={inWork} />
                            }
                        })}
                    </div>
                </div>
                {!allRgWork && <div className="section-div section-two">
                    <div className="title">
                        <h4>Extra works</h4>
                    </div>
                    {workDetails?.extra_work?.[0] &&
                        <div className="work-list-div">
                            <div className="border">
                                <div className="list-body">
                                    <div className="list-head">
                                        <span></span>
                                        <span>Time</span>
                                        <span>Work</span>
                                    </div>
                                    {workDetails?.extra_work?.map((work, index) => <div key={work.start} className="list-item">
                                        <span>{index + 1}</span>
                                        <span>{convertIsoToAmPm(work?.start)}</span>
                                        <span>{work?.work}</span>
                                    </div>)}
                                </div>
                            </div>
                        </div>}

                    <div className="extra-input">
                        <form onSubmit={handleSubmit}>
                            <NormalInput label='Enter extra work' name='extra_work' onChangeFun={handleChange} value={extraWork} />
                            <SingleButton stIcon={<IoSend />} classNames={'lg'} style={{ fontSize: '22px' }} type={'submit'}
                                loading={loading} />
                        </form>
                    </div>
                </div>}
            </div>
        </div>
    )
}

export default Work