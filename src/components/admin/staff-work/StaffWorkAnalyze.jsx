import React, { useEffect, useState } from 'react'
import './work-analyze.scss'
import { useLocation } from 'react-router-dom'
import { adminAxios } from '../../../config/axios'
import { toast } from 'react-hot-toast'
import { analyzeStaffHelper } from '../../../assets/javascript/work-helper'
import SpinWithMessage from '../../common/spinners/SpinWithMessage'
import TableForAnalyze from './TableForAnalyze'
import { YYYYMMDDFormat } from '../../../assets/javascript/date-helper'

function StaffWorkAnalyze({ openModal }) {
    const [analyzeData, setAnalyzeData] = useState([])
    const [loading, setLoading] = useState(false)
    const [staffData, setStaffData] = useState({})
    const location = useLocation()
    const form = location.state

    useEffect(() => {
        setLoading(true)
        adminAxios.get(`/analyze/staff-work-data?from_date=${form.from_date}&to_date=${form.to_date}&type=${form.type}&staff_id=${form.staff}`)
            .then((response) => {
                adminAxios.get(`/staff/${form.staff}?if_delete=yes`).then((result) => {
                    setStaffData(result.data.data)
                    const analyzedData = analyzeStaffHelper(response?.data?.data, result.data.data,
                        new Date(form.from_date), new Date(form.to_date))
                    setAnalyzeData(analyzedData)
                    setLoading(false)
                })

            }).catch((error) => {
                toast(error?.response?.data?.message || 'Try now !')
                setLoading(false)
            })
    }, [])

    return (
        <div className='work-analyze container'>
            {loading ? <>
                <div className="loading-page">
                    <SpinWithMessage message='Analyze data...' />
                </div>
            </> : <>
                <div className="staff-info-bar">
                    <div>
                        <div className="left">
                            <h5>Full name : {staffData?.first_name + ' ' + staffData?.last_name}</h5>
                            <span className='text-badge ' >{staffData?.designation?.designation}</span>
                        </div>
                        <div className="right">
                            {staffData?.deleteReason ? <>
                                <p>Current Status :</p>
                                <div>
                                    <small>{YYYYMMDDFormat(new Date(staffData?.deleteReason?.date))} </small>
                                    <span className='text-badge red' >Leaved</span>
                                </div>
                            </> : <>
                                <p>Current Status :</p>
                                <span className='text-badge active' >Active</span>
                            </>}
                        </div>
                    </div>
                </div>
                <div className="table-list">
                    <TableForAnalyze tableData={analyzeData?.dates} details={{
                        staff_id: analyzeData?.staff_id,
                        full_name: analyzeData?.full_name
                    }} openModal={openModal} staffBasie={true} />
                </div>
            </>}
        </div>
    )
}

export default StaffWorkAnalyze