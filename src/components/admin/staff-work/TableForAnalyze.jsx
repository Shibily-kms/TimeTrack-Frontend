import React, { useState } from 'react'
import './table-for-analyze.scss';
import { stringToLocalTime, getTimeFromSecond } from '../../../assets/javascript/date-helper'
import { BsArrowsFullscreen } from 'react-icons/bs'
import TableFilter from '../../common/table-filter/TableFilter'
import Badge from '../../common/badge/Badge'
import Modal from '../../common/modal/Modal'
import ViewModal from './ViewModal'
import EditWorkData from './EditWorkData'
import SingleButton from '../../common/buttons/SingleButton';
import DownloadButtons from './DownloadButtons';
import { GrEdit } from 'react-icons/gr';
import { useSelector } from 'react-redux';

function TableForAnalyze({ tableData, selectDay, staffBasie, fullData }) {
    const [modal, setModal] = useState({ status: false })
    const { user } = useSelector((state) => state.userAuth)

    const openModal = (title, content, width) => {
        setModal({ status: true, title, content, width })
    }

    return (
        <div className='table-for-analyze'>
            <Modal modal={modal} setModal={setModal} />
            <div className="boarder">
                {tableData?.[0] &&
                    <TableFilter topRight={<DownloadButtons fullData={fullData} selectDay={selectDay} oneDay={selectDay} staff={staffBasie} />}>
                        <table>
                            <thead>
                                <tr>
                                    <th >{staffBasie ? "Date" : 'Full name'}<br></br>
                                        {!staffBasie && `( ${new Date(selectDay).toDateString()} )`}</th>
                                    <th >First <br></br>Punch In</th>
                                    <th >Last<br></br>Punch Out</th>
                                    <th >Working <br></br>Time</th>
                                    <th >Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableData.map((obj, index) => {
                                    return <tr key={index}>

                                        <td className='name'>
                                            {staffBasie ? new Date(obj.date).toDateString()
                                                : obj.full_name} <br></br>
                                            <Badge text={obj.designation} className={'gray-fill'} title={'Designation'} />
                                        </td>

                                        <td>
                                            {obj?.punch_list?.[0]
                                                ? <>
                                                    {stringToLocalTime(obj?.punch_list?.[0]?.in)}
                                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                                                        {obj?.leave_type !== '0' && <Badge text={obj?.leave_type === '1' ? "FDL" : 'HDL'} className={'error-fill'} />}
                                                        <Badge text={obj?.punch_list[0]?.in_by} className={'info-fill'} />
                                                    </div>
                                                </>
                                                : <div style={{ display: 'flex', justifyContent: 'center' }}>

                                                    {obj?.leave_type !== '0' && <Badge text={obj?.leave_type === '1' ? 'FDL' : 'HDL'} className={'error-fill'} />}
                                                    {new Date(selectDay).getDay() === 0
                                                        ? <Badge text={'Holiday'} className={'error-fill'} />
                                                        : obj?.leave_type === '0' && new Date(selectDay)?.getTime() !== new Date(new Date().setHours(0, 0, 0, 0))?.getTime()
                                                            ? < Badge text={'Leave'} className={'warning-fill'} /> : ''}
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
                                            {new Date(selectDay)?.getTime() !== new Date(new Date().setHours(0, 0, 0, 0))?.getTime()
                                                && obj?.punch_list?.[0]?.in && !obj?.punch_list?.[obj?.punch_list.length - 1]?.out &&
                                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                    <Badge text={'Skipped'} className={'warning-fill'} title={'Skipped'} />
                                                </div>}
                                        </td>

                                        <td>{obj?.punch_list?.[0]?.in && (getTimeFromSecond(obj?.total_working_time || 0) || '0m')}<br></br>
                                            {obj?.punch_list?.[0]?.in && `(${obj?.punch_list?.length || 0} times)`}
                                        </td>

                                        <td>
                                            <div className='button-div'>
                                                {obj?.punch_list?.[0]?.in && user?.allowed_origins.includes('ttcr_anlz_write') &&
                                                    <SingleButton title='Edit' classNames={'icon-only btn-blue '} stIcon={<GrEdit />}
                                                        onClick={() => openModal('Update punch', <EditWorkData data={
                                                            {
                                                                staff_id: obj?.staff_id,
                                                                punch_list: obj?.punch_list,
                                                                date: selectDay || obj.date
                                                            }
                                                        } setModal={setModal} />)} />}

                                                {obj?.punch_list?.[0]
                                                    && <SingleButton title='Expand' classNames={'icon-only btn-primary '} stIcon={<BsArrowsFullscreen />}
                                                        onClick={() => openModal('Expand', <ViewModal data={obj} selectDay={selectDay || obj.date} />, '600px')} />}
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