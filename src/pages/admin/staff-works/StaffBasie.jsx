import React from 'react'
import './staff-basie.scss'
import { getTimeFromSecond } from '../../../assets/javascript/date-helper'
import TableForAnalyze from '../../../components/admin/staff-work/TableForAnalyze'
import SpinWithMessage from '../../../components/common/spinners/SpinWithMessage'
import { HiDocumentReport } from 'react-icons/hi'


function StaffBasie({ staffAlzList, monthReport }) {

    return (
        <div className='staff-base-analyze'>
            {staffAlzList?.dates?.[0] ? <>
                <div className="box-div">
                    <div className="section-div">
                        <div className="item-div">
                            <p>Days</p>
                            <h1>{monthReport.monthWorkingDays}d</h1>
                            <h4>{getTimeFromSecond(monthReport.monthWorkingHours)}</h4>
                        </div>
                        <div className="item-div">
                            <p>Attendance</p>
                            <h1>{monthReport.monthAttendanceDays}d</h1>
                            <h4>{getTimeFromSecond(monthReport.monthAttendanceHours)}</h4>
                        </div>
                        <div className="item-div">
                            <p>Pending</p>
                            <h1>{monthReport.monthLeaveDays >= 0 ? monthReport.monthLeaveDays : 0}d</h1>
                            <h4>{getTimeFromSecond(monthReport.monthLeaveHours)}</h4>
                        </div>
                        <div className="item-div">
                            <p>Efficiency</p>
                            <h1>{monthReport.attendancePercentage}%</h1>
                            <h4>Wanted : {monthReport.wantedPercentage}%</h4>
                        </div>
                    </div>
                </div>
                <TableForAnalyze tableData={staffAlzList?.dates} details={{
                    staff_id: staffAlzList?.staff_id,
                    full_name: staffAlzList?.full_name
                }} staffBasie={true} />
            </>
                : <SpinWithMessage message={<>
                    <h3>No data available</h3> <br></br>
                    <p>Employees may be deleted or not created!</p>
                </>} height={'500px'} icon={<HiDocumentReport />} />}
        </div>
    )
}

export default StaffBasie   