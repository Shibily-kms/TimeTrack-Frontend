import React, { useEffect, useState } from 'react'
import Header from '../../../components/admin/header/Header'
import WorkReportTable from '../../../components/admin/work-report/WorkReportTable'
import './work-report.scss'
import { adminAxios } from '../../../config/axios'
import { workReportHelper } from '../../../assets/javascript/work-helper'
import { toast } from 'react-hot-toast'

function WorkReport() {
    const [dateForm, setDateForm] = useState(`${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}`)
    const [data, setData] = useState([])
    const [thisMonth, setThisMonth] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleDate = (e) => {
        setDateForm(e.target.value)
    }

    useEffect(() => {
        setLoading(true)
        adminAxios.get(`/analyze/work-report?date=${dateForm}`).then((response) => {
            adminAxios.get('/staff/all-list?all=yes').then((result) => {
                const report = workReportHelper(response.data.data, result.data.data, dateForm)
                setData(report)
                setLoading(false)
                console.log(report);
            })
        }).catch((error) => {
            toast.error(error.response.data.message)
            setLoading(false)
        })

        if (`${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}` === dateForm) {
            setThisMonth(true)
        } else {
            setThisMonth(false)
        }

    }, [dateForm])



    return (
        <div className="work-report">
            <div className="header-div">
                <Header />
            </div>
            <div className='main container'>
                <div className='top-bar '>
                    <div className="left">
                        <div className="text-input-div">
                            <input type="month" id='month' name='month' value={dateForm} onChange={handleDate}
                                max={`${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}`} min={'2023-08'} />
                            <label htmlFor="month">Choose month</label>
                        </div>
                    </div>
                    <div className="right">
                        {/* Buttons */}
                    </div>
                </div>
                <div className="content">
                    <WorkReportTable report={data} thisMonth={thisMonth} loading={loading} />
                </div>
            </div>
        </div>
    )
}

export default WorkReport