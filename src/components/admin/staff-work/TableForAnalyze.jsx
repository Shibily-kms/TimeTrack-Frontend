import React, { useEffect, useState } from 'react'
import './table-for-analyze.scss';
import { stringToLocalTime, getTimeFromSecond } from '../../../assets/javascript/date-helper'
import SpinWithMessage from '../../common/spinners/SpinWithMessage';
import { FcTimeline } from 'react-icons/fc'
import { BsArrowsFullscreen } from 'react-icons/bs'

function TableForAnalyze({ tableData, openModal }) {
    const [today, setToday] = useState(false)

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

                                <td><div>{stringToLocalTime(staff?.punch?.in)}</div>{!staff?.punch &&
                                    <span className={`text-badge Sales-text ${tableData?.day === "SUN" ? 'red' : today ? 'gray' : 'orange'}`}>
                                        {tableData?.day === "SUN" ? "Holiday" : today ? "" : "Leave"}</span>}</td>

                                <td><div>{stringToLocalTime(staff?.punch?.out)}</div>{staff?.auto_punch_out &&
                                    <span title='Auto punch outed' className='text-badge Sales-text blue'>Auto</span>}
                                    {!today && staff?.punch?.in && !staff?.punch?.out && <span title='Auto punch out not work / Punch in after auto punch out time'
                                        className='text-badge Sales-text red'>Skipped</span>}</td>

                                <td>{stringToLocalTime(staff?.over_time?.in)}</td>

                                <td><div>{stringToLocalTime(staff?.over_time?.out)}</div>{!today && staff?.over_time?.in && !staff?.over_time?.out &&
                                    <span className='text-badge Sales-text orange'>Skipped</span>}</td>

                                <td>{staff?.punch && (getTimeFromSecond(staff?.punch?.duration + staff?.over_time?.duration || 0) || '0m')}</td>

                                <td>
                                    <div>{staff?.break?.[0] && `( ${staff?.break?.length} )`} {staff?.lunch_break?.start &&
                                        <span title='Lunch break included' className='text-badge Sales-text '>L</span>}</div>
                                    <div>{getTimeFromSecond(staff?.break_duration)}</div>
                                </td>

                                <td>{staff?.regular_work?.[0] && `( ${staff?.regular_work?.length} )`}</td>

                                <td>{staff?.extra_work?.[0] && `( ${staff?.extra_work?.length} )`}</td>

                                <td><button onClick={() => openModal(staff, {
                                    day: tableData.day,
                                    date: tableData.date,
                                    month: tableData.month,
                                    year: tableData.year
                                }, 'date')} className='button'><BsArrowsFullscreen /></button></td>
                            </tr>
                        })}
                    </tbody>
                </table>
                {!tableData?.staff?.[0] && <div className='no-data'>
                    <SpinWithMessage message='No Staffs' icon={<FcTimeline />} spin={false} />
                </div>}
            </div>
        </div >
    )
}

export default TableForAnalyze