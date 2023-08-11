
import Staff_works from '../../pages/admin/staff-works/Staff_works';
import { YYYYMMDDFormat } from './date-helper'

const analyzeDataHelper = (data, staffs, start, end) => {
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
                            designation: staffs[j].designation.designation
                        }
                        oneDay.staff.splice(k, 0, oneStaff)
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

export { analyzeDataHelper }