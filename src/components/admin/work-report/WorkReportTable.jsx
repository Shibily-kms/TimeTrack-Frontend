import React from 'react'
import './work-report-table.scss'
import { getTimeFromSecond } from '../../../assets/javascript/date-helper'
import SpinnerText from '../../../components/common/spinners/SpinWithMessage'

function WorkReportTable({ report, thisMonth, loading }) {
    console.log(report);
    return (
        <div className='work-report-table'>
            {loading ? <div className="no-data"><SpinnerText message='Generate report' /></div> :
                <table>
                    <thead>
                        <tr>
                            <th>Full name</th>
                            <th>Required <br></br> hours</th>
                            <th>Monthly <br></br> salary</th>
                            <th>Worked <br></br> days</th>
                            <th>Worked <br></br> hours</th>
                            <th>Remaining <br></br> time</th>
                            <th>Total <br></br> Salary</th>
                            {thisMonth && <th>Current C/F</th>}
                        </tr>
                    </thead>

                    <tbody>
                        {report?.map((staff, index) => (
                            <tr key={index}>

                                <td style={{ textAlign: 'start' }}>
                                    <div>{staff.full_name}</div>
                                    <div><span title='current designation' className='text-badge Sales-text gray' >{staff.designation}</span></div>
                                </td>

                                <td>
                                    <div title='working days x daily hours'>{`${getTimeFromSecond(staff.day_hours) || '0m'} x ${staff.working_days}d`}</div>
                                    <div><span title='required hours' className='text-badge Sales-text blue' >
                                        {getTimeFromSecond(staff.working_days * staff.day_hours) || '0m'}</span></div>
                                </td>

                                <td>
                                    <div>₹{staff.monthly_salary}.00</div>
                                    <div><span title='daily salary' className='text-badge Sales-text gray2' >
                                        ₹{parseInt(staff.monthly_salary / staff.working_days || 0)}.00</span></div>
                                </td>

                                <td>{staff.worked_days}d</td>

                                <td>
                                    <div>{getTimeFromSecond(staff.worked_time + staff.extra_time) || '0m'}</div>
                                    <div>
                                        {(!thisMonth && staff.used_CF) ? <span title='Used C/F from extra time' className='text-badge Sales-text green'>+{getTimeFromSecond(staff.used_CF)}</span> : ''}
                                        {staff.extra_time ? <span title='Extra time on this month' className='text-badge Sales-text orange'>-{getTimeFromSecond(staff.extra_time) || `${staff.extra_time}s`}</span> : ''}
                                    </div>
                                </td>

                                <td>
                                    <div>
                                        {staff.working_days * staff.day_hours <= staff.worked_time + staff.used_CF
                                            ? "0"
                                            : thisMonth
                                                ? <span>-{getTimeFromSecond((staff.working_days * staff.day_hours) - staff.worked_time)}</span>
                                                : <span>-{getTimeFromSecond((staff.working_days * staff.day_hours) - (staff.worked_time + staff.used_CF))}</span>
                                        }
                                    </div>
                                </td>

                                <td><div style={{ fontWeight: '600', color: 'rgb(26, 132, 194)' }}>₹{staff.allowed_salary}.00</div></td>

                                {thisMonth && <td>{getTimeFromSecond(staff.balance_CF) || '0m'}</td>}
                            </tr>
                        ))}
                    </tbody>
                </table>
            }
        </div>
    )
}

export default WorkReportTable