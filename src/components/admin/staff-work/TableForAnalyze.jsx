import React, { useEffect, useState } from 'react'
import './table-for-analyze.scss';
import { stringToLocalTime, getTimeFromSecond } from '../../../assets/javascript/date-helper'

function TableForAnalyze({ tableData }) {
    const [today, setToday] = useState(false)
    const [breakDuration, setBreakDuration] = useState(0)

    useEffect(() => {
        if (new Date().getDate() === tableData?.date && new Date().getMonth() === tableData?.month) {
            setToday(true)
        } else {
            setToday(false)
        }

    }, [tableData])

    return (
        <div className='table-for-analyze'>
            <div className="boarder">
                <table>
                    <thead>
                        <tr>
                            <th rowSpan={'2'}>Full name</th>
                            <th colSpan={'2'}>Punch</th>
                            <th colSpan={'2'}>Over time</th>
                            <th rowSpan={'2'}>Working <br></br>Time</th>
                            <th rowSpan={'2'}>Break</th>
                            <th rowSpan={'2'}>Regular <br></br> Work</th>
                            <th rowSpan={'2'}>Extra <br></br> Work</th>
                            <th rowSpan={'2'}>Action</th>
                        </tr>
                        <tr>
                            <th>IN</th>
                            <th>Out</th>
                            <th>IN</th>
                            <th>Out</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData?.staff && tableData.staff.map((staff) => {
                            return <tr>
                                <td className='name'>
                                    <div>{staff.full_name}</div>
                                    <div><span title={!staff?.punch && 'Current designation'}
                                        className={`text-badge Sales-text ${!staff?.punch ? 'blue' : 'gray'}`}>{staff.designation}</span></div>
                                </td>

                                <td><div>{stringToLocalTime(staff?.punch?.in)}</div>{!today && !staff?.punch &&
                                    <span className={`text-badge Sales-text ${tableData?.day === "SUN" ? 'red' : 'orange'}`}>{tableData?.day === "SUN" ? "Holiday" : "On Leave"}</span>}</td>

                                <td><div>{stringToLocalTime(staff?.punch?.out)}</div>{staff?.auto_punch_out && <span title='Auto punch outed' className='text-badge Sales-text blue'>Auto</span>}
                                    {!today && staff?.punch?.in && !staff?.punch?.out && <span title='Auto punch out not work' className='text-badge Sales-text red'>Bug</span>}</td>

                                <td>{stringToLocalTime(staff?.over_time?.in)}</td>

                                <td><div>{stringToLocalTime(staff?.over_time?.out)}</div>{!today && staff?.over_time?.in && !staff?.over_time?.out &&
                                    <span className='text-badge Sales-text orange'>Skipped</span>}</td>

                                <td>{getTimeFromSecond(staff?.punch?.duration + staff?.over_time?.duration || 0)}</td>

                                <td>
                                    <div>{staff?.break?.length && `( ${staff?.break?.length} )`} {staff?.lunch_break?.start &&
                                        <span className='text-badge Sales-text '>L</span>}</div>
                                    <div>{staff?.break_duration}</div>
                                </td>

                                <td>{staff?.regular_work?.length && `( ${staff?.regular_work?.length} )`}</td>

                                <td>{staff?.extra_work?.length && `( ${staff?.extra_work?.length} )`}</td>

                                <td><button className='button'>View</button></td>
                            </tr>
                        })}

                    </tbody>
                </table>
            </div>
        </div >
    )
}

export default TableForAnalyze