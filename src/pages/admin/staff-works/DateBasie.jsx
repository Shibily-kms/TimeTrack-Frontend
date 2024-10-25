import React, { useEffect, useState } from 'react'
import './date-basie.scss'
import DateBar from '../../../components/admin/staff-work/DateBar'
import TableForAnalyze from '../../../components/admin/staff-work/TableForAnalyze'
import { analyzeDateHelper } from '../../../assets/javascript/work-helper'
import { useSearchParams } from 'react-router-dom'
import SpinWithMessage from '../../../components/common/spinners/SpinWithMessage'
import { HiDocumentReport } from 'react-icons/hi'

function DateBasie({ dateBaseList, leaveList, staffs }) {
    const [data, setData] = useState([])
    const [tableData, setTableData] = useState({})
    const [selectDay, setSelectDay] = useState(null)
    const [searchParams] = useSearchParams()

    useEffect(() => {
        // eslint-disable-next-line
        data?.map((day) => {
            if (selectDay === day.date) {
                setTableData(day)
            }
        })
        // eslint-disable-next-line
    }, [selectDay])

    useEffect(() => {
        setData(analyzeDateHelper(dateBaseList, staffs, leaveList, searchParams.get('month')))
        // eslint-disable-next-line
    }, [dateBaseList])

    useEffect(() => {
        if (new Date(data?.[0]?.date).getFullYear() === new Date().getFullYear() && new Date(data?.[0]?.date).getMonth() === new Date().getMonth()) {
            setSelectDay(data?.[data?.length - 1]?.date)
        } else {
            setSelectDay(data?.[0]?.date)
        }
    }, [data])



    return (
        <div className='date-works-basie'>

            <DateBar data={data} selected={selectDay} setSelected={setSelectDay} />

            {tableData.staff_list?.[0]
                ? <>
                    <div className="section-div">
                        <div className="item-div">
                            <h1>{tableData?.staff_list?.length || 0}</h1>
                            <p>Total Staff</p>
                        </div>
                        <div className="item-div">
                            <h1>{tableData?.attendance || 0}</h1>
                            <p>Total Attendance</p>
                        </div>
                        <div className="item-div">
                            <h1>{(tableData?.staff_list?.length - tableData?.attendance) || 0}</h1>
                            <p>Total Leave</p>
                        </div>
                    </div>

                    <TableForAnalyze tableData={tableData.staff_list} selectDay={selectDay} fullData={data} />
                </>
                : <SpinWithMessage message={<>
                    <h3>No data available</h3> <br></br>
                    <p>A single active staff is required to generate the report.</p>
                </>} height={'400px'} icon={<HiDocumentReport />} />}


        </div>
    )
}

export default DateBasie