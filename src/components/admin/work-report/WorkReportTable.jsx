import React, { useState } from 'react'
import './work-report-table.scss'
import { getTimeFromSecond } from '../../../assets/javascript/date-helper'
import { BsInfoCircleFill } from 'react-icons/bs'
import { FaPlusCircle, FaMinusCircle, FaExpandArrowsAlt } from "react-icons/fa";
import { TbArrowBigDownFilled } from "react-icons/tb";
import { GrEdit } from 'react-icons/gr'
import { findTotalSalaryAmt } from '../../../assets/javascript/calc-helper';
import TableFilter from '../../common/table-filter/TableFilter'
import Badge from '../../common/badge/Badge'
import SingleButton from '../../common/buttons/SingleButton';
import Modal from '../../common/modal/Modal'
import SalaryReport from './SalaryReport';


function WorkReportTable({ report, setData, thisMonth, staffBase }) {
    const [modal, setModal] = useState({})
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

    const openModal = (title, data, type) => {
        if (type === 'view' && data?.allowed_salary <= 0) {
            return;
        }

        setModal({ status: true, title, content: <SalaryReport data={data} setData={setData} setModal={setModal} viewOnly={type === 'view'} /> })
    }

    return (
        <div className='work-report-table'>
            <Modal modal={modal} setModal={setModal} />
        
            <TableFilter>
                <table>
                    <thead>
                        <tr>
                            {staffBase ? <th>Month</th> : <th>Full name</th>}
                            <th>Required <br></br> hours</th>
                            <th>Monthly <br></br> salary</th>
                            <th>Worked <br></br> days</th>
                            <th>Worked <br></br> hours</th>
                            <th>Total <br></br> Salary</th>
                            {thisMonth ? <th>Current C/F</th> : <th>Control</th>}
                        </tr>
                    </thead>

                    <tbody>
                        {report?.map((staff, index) => (
                            <tr key={index}>
                                {/* Full Name */}
                                {staffBase
                                    ? <td className='name'>
                                        {months[Number(staff.date.slice(5, 7)) - 1]}
                                        <br></br>
                                        {staff.date.slice(0, 4)}
                                    </td>
                                    : <td className='name'>
                                        {staff.full_name} <br></br>
                                        <Badge text={staff.designation} title={'current designation'} className={'gray-fill'} />
                                    </td>}
                                {staff.message && (!thisMonth && staffBase)
                                    ? <td colSpan='6'> <p className='message'><BsInfoCircleFill />{staff.message}</p> </td>
                                    : <>
                                        {/* Required hours */}
                                        <td title='working days x daily hours'>
                                            <div>
                                                {`${getTimeFromSecond(staff.day_hours) || '0m'} x ${staff.working_days}d`}
                                                <Badge text={getTimeFromSecond(staff.working_days * staff.day_hours) || '0m'} title={'Required hours'} className={'info-fill'} />
                                            </div>
                                        </td>
                                        {/* Monthly salary */}
                                        <td>
                                            <div>₹{staff.monthly_salary}.00  <br></br>
                                                <Badge text={`₹${parseInt(staff.monthly_salary / staff.working_days || 0)}.00`} title={'Daily salary'} className={'gray-fill'} />
                                            </div>
                                        </td>
                                        {/* worked Days */}
                                        <td>
                                            {staff.worked_days}d
                                        </td>
                                        {/* Working hours */}
                                        <td>
                                            <div>{getTimeFromSecond(staff.worked_time + staff.extra_time) || '0m'}</div>
                                            <div>
                                                {(!thisMonth && staff.used_CF) ? <Badge text={getTimeFromSecond(staff.used_CF)} title={'Used C/F from extra time'}
                                                    icon={<FaPlusCircle />} className={'warning-fill'} /> : ''}
                                                {staff.extra_time ? <Badge text={getTimeFromSecond(staff.extra_time) || staff.extra_time + 's'} title={'Extra time on this month'}
                                                    icon={<FaMinusCircle />} className={'success-fill'} /> : ''}
                                                {staff.working_days * staff.day_hours <= staff.worked_time + staff.used_CF
                                                    ? ""
                                                    : thisMonth
                                                        ? <Badge text={getTimeFromSecond((staff.working_days * staff.day_hours) - staff.worked_time)} title={'Remaining time'}
                                                            icon={<TbArrowBigDownFilled />} className={'error-fill'} />
                                                        : <Badge text={getTimeFromSecond((staff.working_days * staff.day_hours) - (staff.worked_time + staff.used_CF))} title={'Remaining time'}
                                                            icon={<TbArrowBigDownFilled />} className={'error-fill'} />
                                                }
                                            </div>
                                        </td>

                                        {/* total salary */}
                                        <td onClick={() => openModal('Total Salary', staff, 'view')} style={{ cursor: 'pointer' }}><span className='salary-td'>₹{parseFloat(findTotalSalaryAmt(staff)).toFixed(2)}</span>{staff?.allowed_salary > 0 && <FaExpandArrowsAlt />}</td>
                                        {/* current c/f */}
                                        {thisMonth
                                            ? <td>{getTimeFromSecond(staff.balance_CF) || '0m'}</td>
                                            : <td>
                                                <SingleButton title='Edit' classNames={'icon-only btn-blue'} stIcon={<GrEdit />} onClick={() => openModal('Edit Salary', staff)} />
                                            </td>
                                        }
                                    </>
                                }
                            </tr>
                        ))}
                    </tbody>
                </table>
            </TableFilter>

        </div >
    )
}

export default WorkReportTable