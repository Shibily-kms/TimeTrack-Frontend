import { YYYYMMDDFormat } from './date-helper'

const analyzeDateHelper = (data, staffs, start, end) => {

    // Check This Month
    const thisMonth = end?.getFullYear() === new Date().getFullYear() && end?.getMonth() === new Date().getMonth()
    end = thisMonth ? new Date() : end

    let i = 0;
    let analyzeData = []
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
    let oneDay = {}

    while (start.getTime() <= end.getTime()) {
        // Setup Day
        if (YYYYMMDDFormat(start) === data?.[i]?.date) {
            oneDay = {
                day: days[new Date(start).getDay()],
                date: new Date(start).getDate(),
                month: new Date(start).getMonth(),
                year: new Date(start).getFullYear(),
                staff: data[i].staff,
                attendanceCount: data[i].staff.length
            }
            i++;
        } else {
            oneDay = {
                day: days[new Date(start).getDay()],
                date: new Date(start).getDate(),
                month: new Date(start).getMonth(),
                year: new Date(start).getFullYear(),
                staff: [],
                attendanceCount: 0
            }
        }
        // Setup Staffs
        let oneStaff = {}
        let k = 0;
        for (let j = 0; j < staffs.length; j++) {
            if (YYYYMMDDFormat(start) >= YYYYMMDDFormat(new Date(staffs[j].createdAt))) {
                if (YYYYMMDDFormat(start) <= YYYYMMDDFormat(new Date(staffs[j]?.deleteReason?.date)) || !staffs[j]?.deleteReason) {
                    if (staffs[j]._id !== oneDay.staff[k]?.staff_id) {
                        oneStaff = {
                            full_name: staffs[j].first_name + ' ' + staffs[j].last_name,
                            staff_id: staffs[j]._id,
                            designation: staffs[j].designation.designation,
                            current_designation: true,
                            day: days[new Date(start).getDay()],
                            date: new Date(start).getDate(),
                            month: new Date(start).getMonth(),
                            year: new Date(start).getFullYear(),
                        }
                        oneDay.staff.splice(k, 0, oneStaff)
                    } else {
                        oneDay.staff[k].day = days[new Date(start).getDay()]
                        oneDay.staff[k].date = new Date(start).getDate()
                        oneDay.staff[k].month = new Date(start).getMonth()
                        oneDay.staff[k].year = new Date(start).getFullYear()
                        if (!oneDay.staff[k].designation) {
                            oneDay.staff[k].designation = staffs[j].designation.designation
                            oneDay.staff[k].current_designation = true
                        }
                    }
                    k++
                }
            }
        }

        analyzeData.push(oneDay)
        start.setDate(start.getDate() + 1);
    }

    return analyzeData
}

const analyzeStaffHelper = (data, staffDetails, start, end) => {

    // Check This Month
    const thisMonth = end?.getFullYear() === new Date().getFullYear() && end?.getMonth() === new Date().getMonth()
    end = thisMonth ? new Date() : end

    const staff = data?.[0] || {
        staff_id: staffDetails._id,
        full_name: `${staffDetails.first_name} ${staffDetails.last_name}`,
        dates: []
    }
    let i = 0
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
    let oneDay = {}

    while (start.getTime() <= end.getTime()) {
        if (YYYYMMDDFormat(start) >= YYYYMMDDFormat(new Date(staffDetails.createdAt))) {
            if (YYYYMMDDFormat(start) <= YYYYMMDDFormat(new Date(staffDetails?.deleteReason?.date)) || !staffDetails?.deleteReason) {
                if (YYYYMMDDFormat(start) === staff?.dates?.[i]?.date) {
                    oneDay = {
                        ...staff.dates?.[i],
                        day: days[new Date(start).getDay()],
                        date: new Date(start).getDate(),
                        month: new Date(start).getMonth(),
                        year: new Date(start).getFullYear(),
                        staff_id: staff.staff_id,
                        full_name: staff.full_name
                    }
                    if (!staff.dates?.[i].designation) {
                        oneDay.designation = staffDetails?.designation.designation
                        oneDay.current_designation = true
                    }
                    staff.dates[i] = oneDay
                } else {
                    oneDay = {
                        day: days[new Date(start).getDay()],
                        date: new Date(start).getDate(),
                        month: new Date(start).getMonth(),
                        year: new Date(start).getFullYear(),
                        staff_id: staffDetails?._id,
                        full_name: `${staffDetails.first_name} ${staffDetails.last_name}`,
                        designation: staffDetails?.designation.designation,
                        current_designation: true
                    }
                    if (staff?.dates?.[0]) {
                        staff?.dates.splice(i, 0, oneDay)
                    } else {
                        staff.dates.push(oneDay)
                    }
                }
                i++;

            }
        }

        start.setDate(start.getDate() + 1);
    }

    return staff
}

const analyzeStaffMonthReport = (thisMonth, staffData, staffMSR, analyzeData) => {
    let workingDays = 0, workingHours = 0
    let attendedDays = 0, attendedHours = 0
    let leavedDays = 0, leavedHours = 0
    let attendancePercentage = 0, wantedPercentage = 0


    //  Wanted days and hours
    workingDays = thisMonth ? staffData?.current_working_days || 0 : staffMSR?.working_days || 0
    let dayWorkingHours = thisMonth ? staffData?.current_working_time || 0 : staffMSR?.day_hours || 0
    workingHours = workingDays * dayWorkingHours || 0

    // Attendance report
    attendedDays = analyzeData?.dates?.filter((day) => day?.punch?.in) || []
    attendedDays = attendedDays.length

    analyzeData?.dates?.map((day) => {
        if (day?.punch) {
            attendedHours += day?.punch?.duration || 0
        }
        if (day?.over_time) {
            attendedHours += day?.over_time?.duration || 0
        }
        return day
    })

    // Leave Report 
    leavedDays = Math.max(0, workingDays - attendedDays)
    leavedHours = Math.max(0, workingHours - attendedHours)

    // Percentage 
    attendancePercentage = parseInt((attendedHours * 100) / workingHours) || 0
    let forThisMonth = new Date().getDate() * dayWorkingHours || 0
    wantedPercentage = thisMonth ? parseInt((attendedHours * 100) / forThisMonth) || 0 : workingHours ? 100 : 0

    return {
        monthWorkingDays: workingDays,
        monthWorkingHours: workingHours,
        monthAttendanceDays: attendedDays,
        monthAttendanceHours: attendedHours,
        monthLeaveDays: leavedDays,
        monthLeaveHours: leavedHours,
        attendancePercentage,
        wantedPercentage
    }

}

const workReportHelper = (data, staffs, date) => {
    const firstDay = new Date(new Date(date).getFullYear(), new Date(date).getMonth(), 1)
    const lastDay = new Date(new Date(date).getFullYear(), new Date(date).getMonth() + 1, 0)
    let reportData = data
    let k = 0
    for (let i = 0; i < staffs.length; i++) {
        if (YYYYMMDDFormat(lastDay) >= YYYYMMDDFormat(new Date(staffs[i].createdAt))) {
            if (YYYYMMDDFormat(firstDay) <= YYYYMMDDFormat(new Date(staffs[i]?.deleteReason?.date)) || !staffs[i]?.deleteReason) {

                if (staffs[i]._id !== reportData[k]?.staffId) {
                    const report = {
                        allowed_salary: 0,
                        date: date,
                        day_hours: staffs[i].current_working_time || 0,
                        designation: staffs[i].designation.designation,
                        extra_time: 0,
                        full_name: staffs[i].first_name + ' ' + staffs[i].last_name,
                        monthly_salary: staffs[i].current_salary || 0,
                        staffId: staffs[i]._id,
                        used_CF: 0,
                        worked_days: 0,
                        worked_time: 0,
                        working_days: staffs[i].current_working_days || 0,
                        balance_CF: staffs[i].balance_CF || 0,
                        message: 'Report not available'
                    }

                    reportData.splice(k, 0, report)
                }
                k++
            }
        }
    }
    return reportData;
}

const punchDataHelper = (workDetails, setPunch, setTheBreak, setLunchBreak, setOverTime) => {
    if (workDetails?.punch_in && workDetails?.punch_out) {
        setPunch({ in: false, out: false })
        setTheBreak({ start: false, end: false })
        setLunchBreak({ start: false, end: false })
    } else if (!workDetails?.punch_in && !workDetails?.punch_out) {
        setPunch({ in: true, out: false })
        setTheBreak({ start: false, end: false })
        setLunchBreak({ start: false, end: false })
        setOverTime({ in: false, out: false })
    } else if (workDetails?.punch_in && !workDetails?.punch_out) {
        setPunch({ in: false, out: true })
        setTheBreak({ start: true, end: false })
        setLunchBreak({ start: true, end: false })

        // Lunch Break
        if (workDetails?.lunch_break?.start && workDetails?.lunch_break?.end) {
            setLunchBreak({ start: false, end: false })
        } else if (workDetails?.lunch_break?.start && !workDetails?.lunch_break?.end) {
            setLunchBreak({ start: false, end: true })
            setPunch({ in: false, out: false })
            setTheBreak({ start: false, end: false })
        }
        // Break
        if (workDetails?.break?.[workDetails?.break?.length - 1]?.start && workDetails?.break?.[workDetails?.break?.length - 1]?.end && !workDetails?.lunch_break?.start) {
            setTheBreak({ start: true, end: false })
        } else if (workDetails?.break?.[workDetails?.break?.length - 1]?.start && !workDetails?.break?.[workDetails?.break?.length - 1]?.end) {
            setPunch({ in: false, out: false })
            setTheBreak({ start: false, end: true })
            setLunchBreak({ start: false, end: false })
        }
    }

    if (workDetails?.over_time?.in && workDetails?.over_time?.out) {
        setOverTime({ in: false, out: false })
        setTheBreak({ start: false, end: false })
        setLunchBreak({ start: false, end: false })
    } else if (!workDetails?.over_time?.in && !workDetails?.over_time?.out && workDetails?.punch_out) {
        setOverTime({ in: true, out: false })
        setTheBreak({ start: false, end: false })
        setLunchBreak({ start: false, end: false })
    } else if (workDetails?.over_time?.in && !workDetails?.over_time?.out) {
        setOverTime({ in: false, out: true })
        setTheBreak({ start: true, end: false })
        setLunchBreak({ start: true, end: false })

        // Lunch Break
        if (workDetails?.lunch_break?.start && workDetails?.lunch_break?.end) {
            setLunchBreak({ start: false, end: false })
        } else if (workDetails?.lunch_break?.start && !workDetails?.lunch_break?.end) {
            setLunchBreak({ start: false, end: true })
            setOverTime({ in: false, out: false })
            setTheBreak({ start: false, end: false })
        }
        // Break
        if (workDetails?.break?.[workDetails?.break?.length - 1]?.start && workDetails?.break?.[workDetails?.break?.length - 1]?.end && !workDetails?.lunch_break?.start) {
            setTheBreak({ start: true, end: false })
        } else if (workDetails?.break?.[workDetails?.break?.length - 1]?.start && !workDetails?.break?.[workDetails?.break?.length - 1]?.end) {
            setOverTime({ in: false, out: false })
            setTheBreak({ start: false, end: true })
            setLunchBreak({ start: false, end: false })
        }
    }
}

export { analyzeDateHelper, analyzeStaffHelper, workReportHelper, punchDataHelper, analyzeStaffMonthReport }