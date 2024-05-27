import React, { useEffect, useState } from 'react'
import './date-basie.scss'
import DateBar from '../../../components/admin/staff-work/DateBar'
import TableForAnalyze from '../../../components/admin/staff-work/TableForAnalyze'

function DateBasie({ dateAlzList, selectDay, setSelectDay }) {
    const [tableData, setTableData] = useState({})

    useEffect(() => {
        // eslint-disable-next-line
        dateAlzList.map((day) => {
            if (selectDay.date === day.date && selectDay.month === day.month && selectDay.year === day.year) {
                setTableData(day)
            }
        })
        // eslint-disable-next-line
    }, [selectDay])


    return (
        <div className='date-works-basie'>

            <DateBar data={dateAlzList} selected={selectDay} setSelected={setSelectDay} />

            <div className="section-div">
                <div className="item-div">
                    <h1>{tableData?.staff?.length || 0}</h1>
                    <p>Total Staff</p>
                </div>
                <div className="item-div">
                    <h1>{tableData?.attendanceCount || 0}</h1>
                    <p>Total Attendance</p>
                </div>
                <div className="item-div">
                    <h1>{(tableData?.staff?.length - tableData?.attendanceCount) || 0}</h1>
                    <p>Total Leave</p>
                </div>
            </div>

            <TableForAnalyze tableData={tableData.staff} details={{
                day: tableData.day,
                date: tableData.date,
                month: tableData.month,
                year: tableData.year
            }} selectDay={selectDay} />

        </div>
    )
}

export default DateBasie