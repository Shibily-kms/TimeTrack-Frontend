import React, { useEffect, useState } from 'react'
import './table-for-analyze.scss';
import { stringToLocalTime, getTimeFromSecond } from '../../../assets/javascript/date-helper'
import { BsArrowsFullscreen } from 'react-icons/bs'
import { GrEdit } from 'react-icons/gr'
import TableFilter from '../../common/table-filter/TableFilter'
import Badge from '../../common/badge/Badge'
import Modal from '../../common/modal/Modal'
import ViewModal from '../../admin/staff-work/ViewModal'
import EditWorkData from '../../admin/staff-work/EditWorkData'
import SingleButton from '../../common/buttons/SingleButton';
import DownloadButtons from './DownloadButtons';

function TableForAnalyze({ tableData, details, selectDay, staffBasie }) {
    const [today, setToday] = useState(false)
    const [yesterday, setYesterday] = useState(false)
    const [modal, setModal] = useState({ status: false })
    const months = ['Jun', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    useEffect(() => {
        if (!staffBasie) {
            if (new Date().getDate() === details?.date && new Date().getMonth() === details?.month && new Date().getFullYear() === details?.year) {
                setToday(true)
            } else {
                setToday(false)
            }
            let currentDate = new Date();
            currentDate.setDate(currentDate.getDate() - 1);

            if (currentDate.getDate() === details?.date && currentDate.getMonth() === details?.month && currentDate.getFullYear() === details?.year) {
                setYesterday(true)
            } else {
                setYesterday(false)
            }
        }
        // eslint-disable-next-line
    }, [details])

    const openModal = (title, content, width) => {
        setModal({ status: true, title, content, width })
    }

    return (
        <div className='table-for-analyze'>
            <Modal modal={modal} setModal={setModal} />
            <div className="boarder">
                {tableData?.[0] &&
                    <TableFilter topRight={<DownloadButtons oneDay={selectDay} />}>
                        <table>
                            <thead>
                                <tr>
                                    <th >{staffBasie ? "Date" : 'Full name'}<br></br>
                                        {!staffBasie && `( ${details.date}-${months[details.month]}-${details.year} )`}</th>
                                    <th >Punch In</th>
                                    <th >Punch Out</th>
                                    <th >Over time <br></br> In</th>
                                    <th >Over time <br></br>Out</th>
                                    <th >Working <br></br>Time</th>
                                    <th >Break</th>
                                    <th >Regular <br></br> Work</th>
                                    <th >Extra <br></br> Work</th>
                                    <th >Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableData && tableData.map((obj, index) => {
                                    return <tr key={index}>

                                        <td className='name'>
                                            {staffBasie ? (obj.date + '-' + months[obj.month] + '-' + obj.year + ' | ' + obj.day)
                                                : obj.full_name} <br></br>
                                            {staffBasie
                                                ? (obj.punch && !obj?.current_designation && <Badge text={obj.designation} className={'gray-fill'} title={'Designation'} />)
                                                : <Badge text={obj.designation} className={'gray-fill'} title={'Designation'} />}
                                        </td>

                                        <td>
                                            {stringToLocalTime(obj?.punch?.in)}
                                            {!obj?.punch &&
                                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                    <Badge text={obj?.day === "SUN" ? "Holiday" : today ? "" : "Leave"} className={obj?.day === 'SUN' ? 'error-fill' : 'warning-fill'} />
                                                </div>
                                            }
                                        </td>

                                        <td>
                                            {stringToLocalTime(obj?.punch?.out)} <br></br>
                                            {obj?.auto_punch_out &&
                                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                    <Badge text={'Auto'} className={'info-fill'} title={'Auto punch outed'} />
                                                </div>
                                            }
                                            {!today && obj?.punch?.in && !obj?.punch?.out && <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                <Badge text={'Skipped'} className={'warning-fill'} title={'Auto punch outed'} />
                                            </div>}
                                        </td>

                                        <td>{stringToLocalTime(obj?.over_time?.in)}</td>

                                        <td>{stringToLocalTime(obj?.over_time?.out)}<br></br>
                                            {!today && obj?.over_time?.in && !obj?.over_time?.out &&
                                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                    <Badge text={'Skipped'} className={'warning-fill'} title={'Auto punch outed'} />
                                                </div>
                                            }</td>

                                        <td>{obj?.punch && (getTimeFromSecond(obj?.punch?.duration + obj?.over_time?.duration || 0) || '0m')}</td>

                                        <td>
                                            {obj?.break?.[0] && `( ${obj?.break?.length} )`} {obj?.lunch_break?.start &&
                                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                    <Badge text={'L'} className={'gray-fill'} title={'Lunch break'} />
                                                </div>
                                            } <br></br>
                                            {getTimeFromSecond(obj?.break_duration)}
                                        </td>

                                        <td>{obj?.regular_work?.[0] && `( ${obj?.regular_work?.length} )`}</td>

                                        <td>{obj?.extra_work?.[0] && `( ${obj?.extra_work?.length} )`}</td>

                                        <td>
                                            <div className='button-div'>

                                                {!staffBasie && (today || yesterday) && obj?.punch?.in &&
                                                    <SingleButton title='Edit' classNames={'icon-only btn-blue '} stIcon={<GrEdit />}
                                                        onClick={() => openModal('Edit', <EditWorkData data={
                                                            {
                                                                staff_id: obj?.staff_id,
                                                                punch: obj?.punch,
                                                                over_time: obj?.over_time,
                                                                date: obj.date,
                                                                month: obj.month,
                                                                year: obj.year,
                                                                day: obj.day
                                                            }
                                                        } setModal={setModal} />)} />}

                                                <SingleButton title='Expand' classNames={'icon-only btn-primary '} stIcon={<BsArrowsFullscreen />}
                                                    onClick={() => openModal('Expand', <ViewModal data={obj} info={
                                                        {
                                                            day: obj.day,
                                                            date: obj.date,
                                                            month: obj.month,
                                                            year: obj.year
                                                        }
                                                    } />, '600px')} />
                                            </div>
                                        </td>
                                    </tr>
                                })}
                            </tbody>
                        </table>
                    </TableFilter>}
            </div>
        </div >
    )
}

export default TableForAnalyze