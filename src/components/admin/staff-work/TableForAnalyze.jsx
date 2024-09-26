import React, { useEffect, useState } from 'react'
import './table-for-analyze.scss';
import { stringToLocalTime, getTimeFromSecond } from '../../../assets/javascript/date-helper'
import { BsArrowsFullscreen } from 'react-icons/bs'
import TableFilter from '../../common/table-filter/TableFilter'
import Badge from '../../common/badge/Badge'
import Modal from '../../common/modal/Modal'
import ViewModal from '../../admin/staff-work/ViewModal'
import EditWorkData from '../../admin/staff-work/EditWorkData'
import SingleButton from '../../common/buttons/SingleButton';
import DownloadButtons from './DownloadButtons';
import { GrEdit } from 'react-icons/gr';
import { useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

function TableForAnalyze({ tableData, details, selectDay, staffBasie }) {
    const [today, setToday] = useState(false)
    const [yesterday, setYesterday] = useState(false)
    const [modal, setModal] = useState({ status: false })
    const months = ['Jun', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const [searchParams] = useSearchParams()
    const { user } = useSelector((state) => state.userAuth)


    useEffect(() => {
        if (!staffBasie) {
            if (new Date().getDate() === details?.date && new Date().getMonth() === details?.month && new Date().getFullYear() === details?.year) {
                setToday(true)
            } else {
                setToday(false)
            }
            let currentDate = new Date();
            currentDate.setDate(currentDate.getDate() - 7);

            if (currentDate.getDate() <= details?.date && currentDate.getMonth() <= details?.month && currentDate.getFullYear() <= details?.year) {
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
                                    <th >First <br></br>Punch In</th>
                                    <th >Last<br></br>Punch Out</th>
                                    <th >Working <br></br>Time</th>
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
                                            <Badge text={obj.designation} className={'gray-fill'} title={'Designation'} />
                                        </td>

                                        <td>
                                            {obj?.punch_list?.[0]
                                                ? <>
                                                    {stringToLocalTime(obj?.punch_list?.[0]?.in)}
                                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                        <Badge text={obj?.punch_list[0]?.in_by} className={'info-fill'} />
                                                    </div>
                                                </>
                                                : <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                    <Badge text={obj?.day === "SUN" ? "Holiday" : today ? "" : "Leave"} className={obj?.day === 'SUN' ? 'error-fill' : 'warning-fill'} />
                                                </div>
                                            }
                                        </td>

                                        <td>
                                            {stringToLocalTime(obj?.punch_list?.[obj?.punch_list.length - 1]?.out)} <br></br>
                                            {obj?.punch_list?.[obj?.punch_list.length - 1]?.auto &&
                                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                    <Badge text={'Auto'} className={'info-fill'} title={'Auto punch outed'} />
                                                </div>
                                            }
                                            {!today && obj?.punch_list?.[0]?.in && !obj?.punch_list?.[obj?.punch_list.length - 1]?.out &&
                                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                    <Badge text={'Skipped'} className={'warning-fill'} title={'Skipped'} />
                                                </div>}
                                        </td>

                                        <td>{obj?.punch_list?.[0]?.in && (getTimeFromSecond(obj?.total_working_time || 0) || '0m')}<br></br>
                                            {obj?.punch_list?.[0]?.in && `(${obj?.punch_list?.length || 0} times)`}
                                        </td>

                                        <td>{obj?.regular_work?.[0] && `( ${obj?.regular_work?.length} )`}</td>

                                        <td>{obj?.extra_work?.[0] && `( ${obj?.extra_work?.length} )`}</td>

                                        <td>
                                            <div className='button-div'>
                                                {!staffBasie && yesterday && obj?.punch_list?.[0]?.in && user?.allowed_origins.includes('ttcr_anlz_write') &&
                                                    <SingleButton title='Edit' classNames={'icon-only btn-blue '} stIcon={<GrEdit />}
                                                        onClick={() => openModal('Update punch', <EditWorkData data={
                                                            {
                                                                staff_id: obj?.staff_id,
                                                                punch_list: obj?.punch_list,
                                                                date: `${searchParams.get('month')}-${(details.date).toString().padStart(2, '0')}`
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