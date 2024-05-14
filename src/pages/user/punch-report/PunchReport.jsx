import React, { useEffect, useState } from 'react'
import Calendar from 'react-calendar';
import './react-calendar-custom-style.scss';
import { adminAxios, userAxios } from '../../../config/axios'
import { useSelector } from 'react-redux'
import { YYYYMMDDFormat } from '../../../assets/javascript/date-helper'
import { GoDotFill } from "react-icons/go";
import Modal from '../../../components/common/modal/Modal'
import DayWorkReportTable from '../../../components/user/day-work-details/DayWorkReportTable';
import { analyzeStaffHelper, analyzeStaffMonthReport } from '../../../assets/javascript/work-helper';


const PunchReport = ({ setPageHead }) => {

    const { user } = useSelector((state) => state.userAuth)
    const [workDates, setWorkDates] = useState({})
    const [modal, setModal] = useState({ status: false })
    const [loading, setLoading] = useState('fetch')
    const [monthReport, setMonthReport] = useState({})

    const handleClickDay = (date) => {
        if (workDates[YYYYMMDDFormat(new Date(date))]) {
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

        const thisMonth = new Date(chooseMonth + '-01')?.getFullYear() === new Date().getFullYear()
            && new Date(chooseMonth + '-01')?.getMonth() === new Date().getMonth()

        if (thisMonth) {
            
        } else {
            adminAxios.get(`/analyze/salary-report/single?month=${chooseMonth}&staff_id=${user._id}`).then((result) => {
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
            })
        }




        adminAxios.get(`/analyze/staff-work-data?from_date=${chooseMonth + '-01'}&to_date=${chooseMonth + '-31'}&type=staff-basie&staff_id=${user._id}`).then((response) => {
      
            // If not this month then collect generated salary report
            let staffMSR = null
            if (!thisMonth) {
                adminAxios.get(`/analyze/salary-report/single?month=${chooseMonth}&staff_id=${user._id}`).then((result) => {
                    staffMSR = result?.data || null
                })

            }

            const analyzeData = analyzeStaffHelper(
                response?.data,
                user,
                new Date(chooseMonth + '-01'),
                new Date(new Date(chooseMonth + '-01').getFullYear(), new Date(chooseMonth + '-01').getMonth() + 1, 0)
            )

            const monthAttendanceReport = analyzeStaffMonthReport(thisMonth, user || {}, staffMSR, analyzeData)

        })

    }

    useEffect(() => {
        setPageHead({ title: 'Punch Report' })

        // Get data fo calendar
        userAxios.get(`/analyze/calendar/staff-work-data?staff_id=${user._id}`).then((response) => {
            let obj = {}
            response.data?.map((item) => {
                obj[item?.date] = item._id
                return item
            })
            setWorkDates(obj)
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
                        if (view === 'month' && workDates[YYYYMMDDFormat(new Date(date))]) {
                            return <span className='fill-dot'><GoDotFill /></span>
                        } else {
                            return null;
                        }

                    }}
                    onClickDay={(value) => handleClickDay(value)}
                    minDate={new Date(2024, 0, 1)}
                    maxDate={new Date()}
                    onActiveStartDateChange={handleChangeMonth}
                />
            </div>
        </div>
    )
}

export default PunchReport