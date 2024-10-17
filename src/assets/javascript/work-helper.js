import { YYYYMMDDFormat } from './date-helper'

const analyzeDateHelper = (data, staffs, leaveList, month) => {

    // Find first day and last day
    let firstDay = new Date(new Date(`${month}-05`).getFullYear(), new Date(`${month}-05`).getMonth(), 1)
    let lastDay = new Date(new Date(`${month}-05`).getFullYear(), new Date(`${month}-05`).getMonth() + 1, 0)
    const thisMonth = lastDay?.getFullYear() === new Date().getFullYear() && lastDay?.getMonth() === new Date().getMonth()
    lastDay = thisMonth ? new Date(new Date().setHours(0, 0, 0, 0)) : lastDay

    // Analyze
    const analyzeData = []
    let dayIndex = 0

    while (firstDay <= lastDay) {

        // Setup Day
        let oneDay = {}

        // If any works
        if (YYYYMMDDFormat(firstDay) === data?.[dayIndex]?.date) {
            oneDay = {
                date: new Date(firstDay),
                staff_list: data[dayIndex]?.staff || [],
                attendance: data[dayIndex]?.staff?.length || 0
            }

            dayIndex++;
        } else {
            oneDay = {
                date: new Date(firstDay),
                staff_list: [],
                attendance: 0
            }
        }

        // SetUp Staff
        let staffIndex = 0
        const dayActiveStaffs = staffs.reduce((result, a) => {
            if (YYYYMMDDFormat(firstDay) >= YYYYMMDDFormat(new Date(a.createdAt)) &&
                (YYYYMMDDFormat(firstDay) <= YYYYMMDDFormat(new Date(a?.deleteReason?.date)) || !a?.deleteReason)) {

                // This day worked
                const takeLeave = leaveList?.[YYYYMMDDFormat(firstDay)]?.filter((ls) => ls.staff_id === a._id)?.[0]?.leave_type

                if (a._id !== oneDay.staff_list[staffIndex]?.staff_id) {
                    result.push({
                        full_name: a.first_name + ' ' + a.last_name,
                        staff_id: a._id,
                        designation: a.designation.designation,
                        current_designation: true,
                        leave_type: takeLeave || '0'
                    })
                } else {
                    result.push({
                        ...oneDay.staff_list[staffIndex],
                        designation: oneDay.staff_list[staffIndex].designation
                            ? oneDay.staff_list[staffIndex].designation : a.designation.designation,
                        current_designation: oneDay.staff_list[staffIndex].designation ? false : true,
                        leave_type: takeLeave || '0'
                    })

                    staffIndex++
                }
            }
            return result;
        }, [])

        oneDay.staff_list = dayActiveStaffs
        analyzeData.push(oneDay)
        firstDay.setDate(firstDay.getDate() + 1);
    }

    return analyzeData
}

const analyzeStaffHelper = (data, leaveList, aboutStaff, month) => {
    // Find first day and last day
    let firstDay = new Date(new Date(`${month}-05`).getFullYear(), new Date(`${month}-05`).getMonth(), 1)
    let lastDay = new Date(new Date(`${month}-05`).getFullYear(), new Date(`${month}-05`).getMonth() + 1, 0)
    const thisMonth = lastDay?.getFullYear() === new Date().getFullYear() && lastDay?.getMonth() === new Date().getMonth()
    lastDay = thisMonth ? new Date(new Date().setHours(0, 0, 0, 0)) : lastDay

    const staffReport = {
        full_name: data?.full_name,
        staff_id: data?.staff_id,
        day_list: []
    }
    let dayIndex = 0

    while (firstDay <= lastDay) {
        if (YYYYMMDDFormat(firstDay) >= YYYYMMDDFormat(new Date(aboutStaff.createdAt)) &&
            (YYYYMMDDFormat(firstDay) <= YYYYMMDDFormat(new Date(aboutStaff?.deleteReason?.date)) || !aboutStaff?.deleteReason)) {

            // Setup Day
            let oneDay = {}
            const takeLeave = leaveList?.[YYYYMMDDFormat(firstDay)]?.filter((ls) => ls.staff_id === aboutStaff._id)?.[0]?.leave_type

            if (YYYYMMDDFormat(firstDay) === data?.dates?.[dayIndex]?.date) {
                oneDay = {
                    ...data?.dates?.[dayIndex],
                    date: new Date(firstDay),
                    staff_id: data?.staff_id,
                    full_name: data?.full_name,
                    designation: data?.dates[dayIndex].designation
                        ? data.dates[dayIndex].designation : aboutStaff.designation.designation,
                    current_designation: data.dates[dayIndex].designation ? false : true,
                    leave_type: takeLeave || '0'
                }

                dayIndex++
            } else {
                oneDay = {
                    date: new Date(firstDay),
                    staff_id: data?.staff_id,
                    full_name: data?.full_name,
                    designation: aboutStaff.designation.designation,
                    current_designation: true,
                    leave_type: takeLeave || '0'
                }
            }
            staffReport.day_list.push(oneDay)
        }
        firstDay.setDate(firstDay.getDate() + 1);
    }
    return staffReport
}

const analyzeStaffMonthReport = (thisMonth, staffMSR) => {

    let workingDays = 0, workingHours = 0
    let attendedDays = 0, attendedHours = 0
    let leavedDays = 0, leavedHours = 0
    let attendancePercentage = 0, wantedPercentage = 0

    //  Wanted days and hours
    workingDays = staffMSR?.working_days || 0
    let dayWorkingHours = staffMSR?.day_hours || 0
    workingHours = workingDays * dayWorkingHours || 0

    // Attendance report
    attendedDays = staffMSR?.worked_days || 0
    attendedHours = (staffMSR?.worked_time || 0) + (staffMSR?.extra_time || 0)

    // Leave Report 
    leavedDays = Math.max(0, workingDays - attendedDays)
    leavedHours = Math.max(0, workingHours - attendedHours)

    // Percentage 
    attendancePercentage = parseInt((attendedHours * 100) / workingHours) || 0
    const thisMonthLastDay = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()
    const dayValue = parseFloat(workingDays / thisMonthLastDay).toFixed(2)
    let forThisMonth = (dayValue * new Date().getDate()) * dayWorkingHours || 0
    wantedPercentage = thisMonth ? parseInt((forThisMonth * 100) / workingHours) || 0 : workingHours ? 100 : 0

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

const salaryReportYearBaseHelper = (data, year) => {
    const prevent = data?.sort((a, b) => a.data - b.date)
    const currentYYYYMM = YYYYMMDDFormat(new Date()).slice(0, 7)
    let month = 0
    let i = 0

    const reports = []

    while (month < 12) {

        if (YYYYMMDDFormat(new Date(year, month)).slice(0, 7) === currentYYYYMM) {
            break;
        }

        if (prevent?.[i]?.date === YYYYMMDDFormat(new Date(year, month)).slice(0, 7)) {
            reports.push(prevent?.[i])
            month++
            i++
        } else {
            reports.push({
                date: YYYYMMDDFormat(new Date(year, month)).slice(0, 7),
                message: 'Report not available',
                full_name: prevent[i]?.full_name,
                allowed_salary: 0,
                day_hours: 0,
                extra_time: 0,
                monthly_salary: 0,
                used_CF: 0,
                worked_days: 0,
                worked_time: 0,
                working_days: 0,
                balance_CF: 0
            })
            month++
        }
    }


    return reports
}

const punchDataHelper = (workDetails, setPunch) => {
    const lastPunchData = workDetails?.punch_list?.[workDetails?.punch_list.length - 1] || {}

    // On Punch IN
    if (lastPunchData?.in && !lastPunchData?.out) {
        setPunch({ in: false, out: true })
    }

    // On Punch OUT
    if (!lastPunchData?.in || (lastPunchData?.in && lastPunchData?.out)) {
        setPunch({ in: true, out: false })
    }
}

export { analyzeDateHelper, analyzeStaffHelper, workReportHelper, punchDataHelper, analyzeStaffMonthReport, salaryReportYearBaseHelper }