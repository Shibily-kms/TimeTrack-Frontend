import React, { useEffect, useState } from 'react'
import Calendar from 'react-calendar';
import './react-calendar-custom-style.scss';
import './punch-report.scss'
import { ttSv2Axios } from '../../../config/axios'
import { useSelector } from 'react-redux'
import { YYYYMMDDFormat, getTimeFromSecond } from '../../../assets/javascript/date-helper'
import Modal from '../../../components/common/modal/Modal'
import DayWorkReportTable from '../../../components/user/day-work-details/DayWorkReportTable';
import { MdOutlineCheck, MdOutlineClear } from 'react-icons/md';


const PunchReport = ({ setPageHead }) => {

    const { user } = useSelector((state) => state.userAuth)
    const [workDates, setWorkDates] = useState({})
    const [modal, setModal] = useState({ status: false })
    const [monthReport, setMonthReport] = useState({})
    const [leave, setLeave] = useState(0)

    const handleClickDay = (date) => {
        if (workDates[YYYYMMDDFormat(new Date(date))] && workDates[YYYYMMDDFormat(new Date(date))]?.[0] === 1) {
            setModal({
                status: true, width: '600px', title: new Date(date).toDateString(),
                content: <DayWorkReportTable date={YYYYMMDDFormat(new Date(date))} />
            })
        }
    }

    const handleChangeMonth = ({ activeStartDate }) => {
        // Get data for Report
        const year = new Date(activeStartDate).getFullYear()
        const month = ("0" + (new Date(activeStartDate).getMonth() + 1)).slice(-2);
        const chooseMonth = `${year}-${month}`

        ttSv2Axios.get(`/work/report/salary/monthly?month=${chooseMonth}&staff_id=${user?.acc_id}`).then((result) => {
            let attendedHours = (result?.data?.worked_time || 0) + (result?.data?.extra_time || 0)
            let wantedHours = (result?.data?.day_hours || 0) * (result?.data?.working_days || 0)
            setMonthReport({
                total_days: result?.data?.working_days || 0,
                total_hours: wantedHours,
                attended_days: result?.data?.worked_days || 0,
                attended_hours: attendedHours,
                pending_days: (result?.data?.working_days || 0) - (result?.data?.worked_days || 0),
                pending_hours: Math.max(0, wantedHours - attendedHours),
                efficiency: parseInt((attendedHours * 100) / wantedHours) || 0
            })
        }).catch(() => {
            setMonthReport({
                total_days: 0,
                total_hours: 0,
                attended_days: 0,
                attended_hours: 0,
                pending_days: 0,
                pending_hours: 0,
                efficiency: 0
            })
        })

        ttSv2Axios.get(`/L2/staff/total-leave?month=${chooseMonth}`).then((response) => {
            setLeave(response.data?.total_leave || 0)
        })

    }

    useEffect(() => {
        setPageHead({ title: 'Monthly Report' })

        // Get data fo calendar
        ttSv2Axios.get(`/work/report/semi-calender/days`).then((response) => {
            setWorkDates(response.data)
        })

        handleChangeMonth({ activeStartDate: new Date() })

        // eslint-disable-next-line
    }, [])

    return (
        <div className="punch-report-page-div">
            <Modal modal={modal} setModal={setModal} />
            <div className="calendar-box-div">
                <Calendar
                    tileContent={({ activeStartDate, date, view }) => {
                        if (view === 'month' && workDates[YYYYMMDDFormat(new Date(date))]
                            && workDates[YYYYMMDDFormat(new Date(date))]?.[0] === 1) {
                            return <span className='fill-dot attendance-dot'><MdOutlineCheck /></span>

                        } else if (view === 'month' && workDates[YYYYMMDDFormat(new Date(date))]
                            && workDates[YYYYMMDDFormat(new Date(date))]?.[0] === 0) {
                            return <span className='fill-dot absences-dot'><MdOutlineClear /></span>
                        } else {
                            return;
                        }
                    }}
                    onClickDay={(value) => handleClickDay(value)}
                    minDate={new Date(2023, 5, 7)}
                    maxDate={new Date()}
                    onActiveStartDateChange={handleChangeMonth}
                />
            </div>
            <div className="month-report-div">
                <div className="item-div">
                    <p>Days</p>
                    <h2>{monthReport.total_days}d</h2>
                </div>
                <div className="item-div">
                    <p>Attendance</p>
                    <h2>{monthReport.attended_days}d</h2>
                    <h4>{getTimeFromSecond(monthReport.attended_hours)}</h4>
                </div>
                {leave
                    ? <div className="item-div">
                        <p>Leaves</p>
                        <h2>{leave}d</h2>
                        <h4>{getTimeFromSecond(monthReport.pending_hours)}</h4>
                    </div>
                    : <div className="item-div">
                        <p>Pending</p>
                        <h2>{monthReport.pending_days >= 0 ? monthReport.pending_days : 0}d</h2>
                        <h4>{getTimeFromSecond(monthReport.pending_hours)}</h4>
                    </div>
                }
                <div className="item-div">
                    <p>Efficiency</p>
                    <h2>{monthReport.efficiency}%</h2>
                </div>
            </div>
        </div>
    )
}

export default PunchReport