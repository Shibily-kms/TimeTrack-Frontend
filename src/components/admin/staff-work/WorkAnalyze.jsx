import React, { useEffect, useState } from 'react'
import DateBar from './DateBar'
import SpinWithMessage from '../../common/spinners/SpinWithMessage'
import TableForAnalyze from './TableForAnalyze'
import './work-analyze.scss'
import { toast } from 'react-hot-toast'
import { adminAxios } from '../../../config/axios'
import { useLocation } from 'react-router-dom'
import { analyzeDataHelper } from '../../../assets/javascript/work-helper'



function WorkAnalyze() {
    const [analyzeData, setAnalyzeData] = useState([])
    const [loading, setLoading] = useState(false)
    const [selected, setSelected] = useState({})
    const [tableData, setTableData] = useState({})
    const location = useLocation()
    const form = location.state

    useEffect(() => {
        analyzeData.map((day) => {
            if (selected.date === day.date && selected.month === day.month) {
                setTableData(day)
            }
        })
    }, [selected])



    useEffect(() => {
        setLoading(true)
        adminAxios.get(`/analyze/staff-work-data?from_date=${form.from_date}&to_date=${form.to_date}&type=${form.type}`).then((response) => {
            adminAxios.get('/staff/all-list?all=yes').then((result) => {
                const analyzedData = analyzeDataHelper(response?.data?.data, result.data.data,
                    new Date(form.from_date), new Date(form.to_date))
                    console.log(analyzedData);
                setSelected({ date: analyzedData[0]?.date, month: analyzedData[0]?.month })
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
                {form?.single ? <>
                </> : <>
                    <div className="date-bar">
                        <DateBar data={analyzeData} selected={selected} setSelected={setSelected} />
                    </div>
                    <div className="table-list">
                        <TableForAnalyze tableData={tableData} />
                    </div>
                </>}
            </>}
        </div>
    )
}

export default WorkAnalyze