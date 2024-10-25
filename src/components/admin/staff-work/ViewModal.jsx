import React, { useEffect, useState } from 'react'
import './view-modal.scss'
import { FcLeave, FcPlanner } from 'react-icons/fc'
import { TbFingerprintOff } from 'react-icons/tb'
import { stringToLocalTime, getTimeFromSecond, YYYYMMDDFormat, formateDateToDayText, convertIsoToAmPm } from '../../../assets/javascript/date-helper'
import Badge from '../../common/badge/Badge'
import SpinWithMessage from '../../common/spinners/SpinWithMessage'
import { ttCv2Axios } from '../../../config/axios'

function ViewModal({ data, selectDay }) {
    const [todo, setTodo] = useState({})

    useEffect(() => {
        ttCv2Axios.get(`/todo/task/completed?from_date=${YYYYMMDDFormat(selectDay)}&to_date=${YYYYMMDDFormat(selectDay)}&staff_id=${data?.staff_id}`)
            .then((response) => {
                setTodo(response.data)
            })
        // eslint-disable-next-line
    }, [])

    return (
        <div className='view-modal'>
            <div className="top">
                <div className="name-section">
                    <h5>{data.full_name}</h5>
                    <Badge title={data?.current_designation ? 'Current designation' : 'Designation of the day'} text={data.designation}
                        className={'gray-fill'} />
                </div>
                <div className="date-sections">
                    <h5>{new Date(selectDay).toDateString()}</h5>
                </div>
            </div>
            {data?.punch_list?.[0] ? <>
                <div className="content">
                    <div className="table-head">
                        <div className="row">
                            <div className="th">Type</div>
                            <div className="th">Item/Status</div>
                            <div className="th">IN</div>
                            <div className="th">OUT</div>
                            <div className="th">Duration</div>
                        </div>
                    </div>
                    {/* Punch */}
                    <div className="table-body">
                        {data?.punch_list?.map((item, index) => <div className="row">
                            <div className="td">Punch {index + 1}</div>
                            <div className="td" style={{ display: 'flex', gap: '5px' }}>
                                {item?.in_by && <Badge title={'Punch IN by'} text={item?.in_by} className={'info-fill'} />}
                                {item?.auto && <Badge title={'Auto punch outed'} text={"Auto"} className={'success-fill'} />}
                            </div>
                            <div className="td">{stringToLocalTime(item?.in)}</div>
                            <div className="td">{stringToLocalTime(item?.out)} {new Date(selectDay)?.getTime() !== new Date(new Date().setHours(0, 0, 0, 0))?.getTime()
                                && item?.in && !item?.out &&
                                <Badge title={'The staff forgot punch out'} text={'Skipped'} className={'warning-fill'} />
                            }</div>
                            <div className="td">{getTimeFromSecond(item?.duration) || '0m'}</div>
                        </div>
                        )}

                        <div className="row" style={{ paddingBottom: "15px" }}>   </div>

                        {/* Todo Completed  */}
                        {todo?.completed?.map((value, index) => {
                            return <div key={index} className="row">
                                <div className="td">{index === 0 && 'To Do (Completed) :'}</div>
                                <div className="td" title={value?.title} >{value?.title}</div>
                                <div className="td">{value?.due_date ? formateDateToDayText(new Date(value?.due_date)) : ''}</div>
                                <div className="td">{(value?.due_date && !value?.is_daily) ? convertIsoToAmPm(new Date(value?.due_date)) : ''}</div>
                                <div className="td"></div>
                            </div>
                        })}

                        {/* Todo Wont'do  */}
                        {todo?.wontDo?.map((value, index) => {
                            return <div key={index} className="row">
                                <div className="td">{index === 0 && "To Do (wont'Do) :"}</div>
                                <div className="td" title={value?.title} >{value?.title}</div>
                                <div className="td">{value?.due_date ? formateDateToDayText(new Date(value?.due_date)) : ''}</div>
                                <div className="td">{(value?.due_date && !value?.is_daily) ? convertIsoToAmPm(new Date(value?.due_date)) : ''}</div>
                                <div className="td"></div>
                            </div>
                        })}

                        <div className="row" style={{ fontWeight: '700', marginTop: '15px' }}>
                            <div className="td"></div>
                            <div className="td">Total duration </div>
                            <div className="td">: {getTimeFromSecond(data?.total_working_time) || '0m'}</div>
                            <div className="td"></div>
                            <div className="td"></div>
                        </div>
                        <div className="row" style={{ fontWeight: '700' }}>
                            <div className="td"></div>
                            <div className="td">Break Count </div>
                            <div className="td">: {data?.punch_list?.length - 1} times</div>
                            <div className="td"></div>
                            <div className="td"></div>
                        </div>
                    </div>

                </div>
            </>
                : <SpinWithMessage height={'250px'} icon={new Date(selectDay).getDay() === 0 ? <FcPlanner /> : new Date(selectDay) === new Date() ? <TbFingerprintOff /> : <FcLeave />}
                    message={new Date(selectDay).getDay() === 0 ? 'Holiday' : new Date(selectDay) === new Date()
                        ? 'Not punched' : `Took${data.leave_type === '1' ? ' Full day' : data.leave_type === '.5' ? ' Half day' : ''} leave`} />}
        </div>
    )
}

export default ViewModal