import { YYYYMMDDFormat } from './date-helper'

const analyzeDateHelper = (data, staffs, start, end) => {
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
                    staff.dates[i] = oneDay
                } else {
                    oneDay = {
                        day: days[new Date(start).getDay()],
                        date: new Date(start).getDate(),
                        month: new Date(start).getMonth(),
                        year: new Date(start).getFullYear(),
                        staff_id: staffDetails?._id,
                        full_name: `${staffDetails.first_name} ${staffDetails.last_name}`,
                        designation: staffDetails?.designation.designation
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

export { analyzeDateHelper, analyzeStaffHelper }