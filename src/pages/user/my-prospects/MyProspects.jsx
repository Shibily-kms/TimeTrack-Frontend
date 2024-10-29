import React, { useEffect, useRef, useState } from 'react'
import './my-prospects.scss'
import { YYYYMMDDFormat } from '../../../assets/javascript/date-helper'
import SingleButton from '../../../components/common/buttons/SingleButton'
import { TbCalendarSearch, TbFileUpload } from 'react-icons/tb'
import SpinWithMessage from '../../../components/common/spinners/SpinWithMessage'
import { FaPlus } from 'react-icons/fa'
import Modal from '../../../components/common/modal/Modal'
import { useNavigate, useSearchParams } from 'react-router-dom'

const MyProspects = ({ setPageHead }) => {
    const [prospects, setProspects] = useState([])
    const [loading, setLoading] = useState('')
    const inputRef = useRef(null)
    const [modal, setModal] = useState({ status: false })
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()

    const newProspectAction = () => {
        navigate('/my-prospects/register')
    }

    useEffect(() => {
        setPageHead({ title: "My Prospects" })

        if (!searchParams.get('month') || isNaN(new Date(searchParams.get('month')).getTime()) ||
            new Date(searchParams.get('month')).getFullYear() > new Date().getFullYear()) {
            setSearchParams({ month: YYYYMMDDFormat(new Date()).slice(0, 7) })
        }
    }, [])

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

                {prospects?.[0] && <div className="list-div"> </div>}

                {!prospects?.[0] && <SpinWithMessage icon={<TbFileUpload />} message={'Register new prospect using below button'}
                    height={'350px'} bottomContent={<div style={{ display: "flex", justifyContent: 'center' }}>
                        <SingleButton name={'Prospect'} stIcon={<FaPlus />} classNames={'btn-tertiary'} onClick={newProspectAction} />
                    </div>} />}
                {loading === 'fetch' && <SpinWithMessage load height={'100px'} />}

                {/* If any leave  */}
                {prospects?.[0] && <div className="app-icon-div">
                    <SingleButton title={'Register Prospects'} stIcon={<FaPlus />} classNames={'icon-only btn-tertiary'}
                        style={{ padding: '15px', fontSize: '25px', borderRadius: '100px' }} onClick={newProspectAction} />
                </div>}
            </div>
        </div>
    )
}

export default MyProspects