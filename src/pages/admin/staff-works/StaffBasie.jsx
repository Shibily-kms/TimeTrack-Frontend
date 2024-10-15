import React, { useEffect, useState } from 'react'
import './staff-basie.scss'
import { getTimeFromSecond } from '../../../assets/javascript/date-helper'
import TableForAnalyze from '../../../components/admin/staff-work/TableForAnalyze'
import SpinWithMessage from '../../../components/common/spinners/SpinWithMessage'
import { HiDocumentReport } from 'react-icons/hi'
import { analyzeStaffHelper, analyzeStaffMonthReport } from '../../../assets/javascript/work-helper'
import { useSearchParams } from 'react-router-dom'
import { ttCv2Axios } from '../../../config/axios'


function StaffBasie({ staffBaseList, leaveList, aboutStaff }) {
    const [data, setData] = useState([])
    const [report, setReport] = useState({})
    const [searchParams, setSearchParams] = useSearchParams()
    const [loading, setLoading] = useState('r-fetch')

    useEffect(() => {
        const thisMonth = new Date(searchParams.get('month') + '-01').getFullYear() === new Date().getFullYear() &&
            new Date(searchParams.get('month') + '-01').getMonth() === new Date().getMonth()

        setLoading('r-fetch')
        const analyzeData = analyzeStaffHelper(staffBaseList, leaveList, aboutStaff, searchParams.get('month'))
        ttCv2Axios.get(`/work/report/salary/single?month=${searchParams.get('month')}&staff_id=${searchParams.get('staff')}`).then((response) => {
            setReport(analyzeStaffMonthReport(thisMonth, response.data || null))
            setLoading('')
        })
        setData(analyzeData)
    
    }, [staffBaseList])

    return (
        <div className='staff-base-analyze'>
            {data?.day_list?.[0] ? <>
                {loading !== 'r-fetch' && <div className="box-div">
                    <div className="section-div">
                        <div className="item-div">
                            <p>Days</p>
                            <h1>{report.monthWorkingDays}d</h1>
                            <h4>{getTimeFromSecond(report.monthWorkingHours)}</h4>
                        </div>
                        <div className="item-div">
                            <p>Attendance</p>
                            <h1>{report.monthAttendanceDays}d</h1>
                            <h4>{getTimeFromSecond(report.monthAttendanceHours)}</h4>
                        </div>
                        <div className="item-div">
                            <p>Pending</p>
                            <h1>{report.monthLeaveDays >= 0 ? report.monthLeaveDays : 0}d</h1>
                            <h4>{getTimeFromSecond(report.monthLeaveHours)}</h4>
                        </div>
                        <div className="item-div">
                            <p>Efficiency</p>
                            <h1>{report.attendancePercentage}%</h1>
                            <h4>Wanted : {report.wantedPercentage}%</h4>
                        </div>
                    </div>
                </div>}
                <TableForAnalyze tableData={data?.day_list} staffBasie={true} fullData={data} />
            </>
                : <SpinWithMessage message={<>
                    <h3>No data available</h3> <br></br>
                    <p>A single punch-in day is required to generate the report.</p>
                </>} height={'400px'} icon={<HiDocumentReport />} />}
        </div>
    )
}

export default StaffBasie   