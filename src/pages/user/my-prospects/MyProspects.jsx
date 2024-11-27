import React, { useEffect, useRef, useState } from 'react'
import './my-prospects.scss'
import { YYYYMMDDFormat } from '../../../assets/javascript/date-helper'
import SingleButton from '../../../components/common/buttons/SingleButton'
import { TbCalendarSearch, TbFileUpload } from 'react-icons/tb'
import SpinWithMessage from '../../../components/common/spinners/SpinWithMessage'
import { FaPlus } from 'react-icons/fa6'
import Modal from '../../../components/common/modal/Modal'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { slUv1Axios } from '../../../config/axios'
import { useDispatch } from 'react-redux'
import { toast } from '../../../redux/features/user/systemSlice'
import Badge from '../../../components/common/badge/Badge'
import { FiArrowRight } from 'react-icons/fi'


const MyProspects = ({ setPageHead }) => {
    const [prospects, setProspects] = useState([])
    const [loading, setLoading] = useState('fetch')
    const inputRef = useRef(null)
    const [modal, setModal] = useState({ status: false })
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [searchParams, setSearchParams] = useSearchParams()

    const newProspectAction = () => {
        navigate('/my-prospects/register')
    }

    const fetchData = () => {
        setLoading('fetch')
        slUv1Axios.get(`/prospect/list/monthly?month=${searchParams.get('month')}`).then((response) => {
            setProspects(response.data)
            setLoading('')
        }).catch((error) => {
            dispatch(toast.push.error({ message: error.message }))
            setLoading('')
        })
    }

    useEffect(() => {
        setPageHead({ title: "My Prospects" })

        if (!searchParams.get('month') || isNaN(new Date(searchParams.get('month')).getTime()) ||
            new Date(searchParams.get('month')).getFullYear() > new Date().getFullYear()) {
            setSearchParams({ month: YYYYMMDDFormat(new Date()).slice(0, 7) })
        }

    }, [])

    useEffect(() => {
        if (searchParams.get('month')) {
            fetchData()
        }
    }, [searchParams.get('month')])

    return (
        <div className="my-prospects-list-page-div">
            <Modal modal={modal} setModal={setModal} />
            <div className="page-border-div">
                <div className="date-div">
                    <h4>{new Date(searchParams.get('month')).toLocaleString('default', { month: 'long', year: 'numeric' })}</h4>
                    <span>
                        <TbCalendarSearch onClick={() => inputRef.current.showPicker()} />
                        <input ref={inputRef} type='month' name='month' value={searchParams.get('month')}
                            onChange={(e) => setSearchParams({ month: e.target.value })}
                            max={YYYYMMDDFormat(new Date()).slice(0, 7)} />
                    </span>
                </div>

                {loading === 'fetch'
                    ? <SpinWithMessage load height={'100px'} />
                    : <>
                        {prospects?.[0] && <div className="list-div">
                            {prospects.map((prospect) => {
                                return <div className="item-div">
                                    <div className="left-div">
                                        <h4 className='id'>#{prospect?.prospect_id}</h4>
                                        <p className='name'>{prospect?.first_name} {prospect?.last_name}<br></br>
                                            <span>{prospect?.address?.address && `${prospect?.address?.address}, `}
                                                {prospect?.address?.place && `${prospect?.address?.place}, `}
                                                {prospect?.address?.city && `${prospect?.address?.city}, `}
                                                {!prospect?.address?.address && !prospect?.address?.place &&
                                                    !prospect?.address?.city && 'No proper address'}
                                            </span>
                                        </p>
                                    </div>
                                    <div className="right-div">
                                        <div className='icon'>
                                            {prospect?.duplicate && <Badge text={'Duplicate entry'} className={'warning-fill '} />}
                                            <FiArrowRight />
                                        </div>
                                        <div className={`status-div ${prospect?.prospect_status_text}`}>
                                            {[4, 5].includes(prospect?.prospect_status) && <p>{prospect?.prospect_status_text}</p>}
                                            {[1, 2, 3].includes(prospect?.prospect_status) &&
                                                <p>{prospect?.prospect_status_text} / {prospect?.lead_status_text || prospect?.enquiry_status_text}</p>}
                                        </div>
                                        <h4>{new Date(prospect?.reg_date).toDateString()}</h4>
                                    </div>
                                </div>
                            })}
                        </div>}
                        {!prospects?.[0] && searchParams.get('month') === YYYYMMDDFormat(new Date()).slice(0, 7) &&
                            <SpinWithMessage icon={<TbFileUpload />} message={'Register new prospect using below button'}
                                height={'350px'} bottomContent={<div style={{ display: "flex", justifyContent: 'center' }}>
                                    <SingleButton name={'Prospect'} stIcon={<FaPlus />} classNames={'btn-tertiary'} onClick={newProspectAction} />
                                </div>} />}
                        {!prospects?.[0] && searchParams.get('month') !== YYYYMMDDFormat(new Date()).slice(0, 7) &&
                            <SpinWithMessage icon={<TbFileUpload />} message={'Prospects not available'} height={'350px'} />}
                        {/* If any leave  */}
                        {prospects?.[0] && <div className="app-icon-div">
                            <SingleButton title={'Register Prospects'} stIcon={<FaPlus />} classNames={'icon-only btn-tertiary'}
                                style={{ padding: '15px', fontSize: '25px', borderRadius: '100px' }} onClick={newProspectAction} />
                        </div>}
                    </>}
            </div>
        </div>
    )
}

export default MyProspects