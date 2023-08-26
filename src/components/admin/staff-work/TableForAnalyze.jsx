import React, { useEffect, useState } from 'react'
import './table-for-analyze.scss';
import { stringToLocalTime, getTimeFromSecond } from '../../../assets/javascript/date-helper'
import SpinWithMessage from '../../common/spinners/SpinWithMessage';
import { FcTimeline } from 'react-icons/fc'
import { BsArrowsFullscreen } from 'react-icons/bs'

function TableForAnalyze({ tableData, details, openModal, staffBasie }) {
    const [today, setToday] = useState(false)
    const months = ['Jun', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dev']

    useEffect(() => {
        if (!staffBasie) {
            if (new Date().getDate() === details?.date && new Date().getMonth() === details?.month && new Date().getFullYear() === details?.year) {
                setToday(true)
            } else {
                setToday(false)
            }
        }
        // eslint-disable-next-line
    }, [details])

    return (
        <div className='table-for-analyze'>
            <div className="boarder">
                <table>
                    <thead>
                        <tr>
                            <th rowSpan={'2'}>{staffBasie ? "Date" : 'Full name'}<br></br>
                                {!staffBasie && `( ${details.date}-${months[details.month]}-${details.year} )`}</th>
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
                        {tableData && tableData.map((obj) => {
                            return <tr>
                                <td className='name'>
                                    <div>{staffBasie ? (obj.date + '-' + months[obj.month] + '-' + obj.year + ' | ' + obj.day)
                                        : obj.full_name}</div>
                                    <div>
                                        {staffBasie ?
                                            (obj.punch && !obj?.current_designation && <span title={'Designation'}
                                                className={`text-badge Sales-text gray`}>{obj.designation}</span>) :
                                            <span title={obj?.current_designation ? 'Current designation' : 'Designation on the day'}
                                                className={`text-badge Sales-text ${obj?.current_designation ? 'gray' : 'gray2'}`}>{obj.designation}</span>}

                                    </div>
                                </td>

                                <td><div>{stringToLocalTime(obj?.punch?.in)}</div>{!obj?.punch &&
                                    <span className={`text-badge Sales-text ${obj?.day === "SUN" ? 'red' : today ? 'gray' : 'orange'}`}>
                                        {obj?.day === "SUN" ? "Holiday" : today ? "" : "Leave"}</span>}</td>

                                <td><div>{stringToLocalTime(obj?.punch?.out)}</div>{obj?.auto_punch_out &&
                                    <span title='Auto punch outed' className='text-badge Sales-text blue'>Auto</span>}
                                    {!today && obj?.punch?.in && !obj?.punch?.out && <span title='Auto punch out not work / Punch in after auto punch out time'
                                        className='text-badge Sales-text red'>Skipped</span>}</td>

                                <td>{stringToLocalTime(obj?.over_time?.in)}</td>

                                <td><div>{stringToLocalTime(obj?.over_time?.out)}</div>{!today && obj?.over_time?.in && !obj?.over_time?.out &&
                                    <span className='text-badge Sales-text orange'>Skipped</span>}</td>

                                <td>{obj?.punch && (getTimeFromSecond(obj?.punch?.duration + obj?.over_time?.duration || 0) || '0m')}</td>

                                <td>
                                    <div>{obj?.break?.[0] && `( ${obj?.break?.length} )`} {obj?.lunch_break?.start &&
                                        <span title='Lunch break included' className='text-badge Sales-text '>L</span>}</div>
                                    <div>{getTimeFromSecond(obj?.break_duration)}</div>
                                </td>

                                <td>{obj?.regular_work?.[0] && `( ${obj?.regular_work?.length} )`}</td>

                                <td>{obj?.extra_work?.[0] && `( ${obj?.extra_work?.length} )`}</td>

                                <td><button onClick={() => openModal(obj, {
                                    day: obj.day,
                                    date: obj.date,
                                    month: obj.month,
                                    year: obj.year
                                }, 'date')} className='button'><BsArrowsFullscreen /></button></td>
                            </tr>
                        })}
                    </tbody>
                </table>
                {!tableData?.[0] && <div className='no-data'>
                    <SpinWithMessage message={staffBasie ? 'No work data' : 'No Staffs'} icon={<FcTimeline />} spin={false} />
                </div>}
            </div>
        </div >
    )
}

export default TableForAnalyze