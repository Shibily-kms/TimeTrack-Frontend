import React, { useEffect, useState } from 'react'
import './day-work-report-table.scss'
import { ttSv2Axios } from '../../../config/axios'
import { useSelector } from 'react-redux'
import SpinWithMessage from '../../common/spinners/SpinWithMessage'
import Badge from '../../common/badge/Badge'
import { convertIsoToAmPm, formateDateToDayText, getTimeFromSecond, stringToLocalTime, YYYYMMDDFormat } from '../../../assets/javascript/date-helper'

const DayWorkReportTable = ({ date }) => {
    const [loading, setLoading] = useState('fetch')
    const { user } = useSelector((state) => state.userAuth)
    const [punchData, setPunchData] = useState({})
    const [todo, setTodo] = useState([])

    useEffect(() => {
        if (date) {
            ttSv2Axios.get(`/work/report/punch?from_date=${date}&to_date=${date}&staff_id=${user?.acc_id}&type=staff-basie`)
                .then((response) => {
                    setPunchData(response?.data?.[0]?.dates?.[0] || {})
                    setLoading('')
                })

            ttSv2Axios.get(`/todo/task/completed?from_date=${date}&to_date=${date}`).then((response) => {
                setTodo(response?.data)
            })
        }
        // eslint-disable-next-line
    }, [])

    return (
        <div className="day-work-report-table-div">
            {punchData?.date
                ? <div className="content">
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
                        {punchData?.punch_list?.map((item, index) => <div className="row">
                            <div className="td">Punch {index + 1}</div>
                            <div className="td" style={{ display: 'flex', gap: '5px' }}>
                                {item?.auto && <Badge title={'Auto punch outed'} text={"Auto"} className={'success-fill'} />}
                            </div>
                            <div className="td">{stringToLocalTime(item?.in)}</div>
                            <div className="td">{stringToLocalTime(item?.out)} {date !== YYYYMMDDFormat(new Date()) && item?.in && !item?.out &&
                                <Badge title={'The staff forgot punch out'} text={'Skipped'} className={'warning-fill'} />
                            }</div>
                            <div className="td">{getTimeFromSecond(item?.duration) || '0m'}</div>
                        </div>
                        )}

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
                            <div className="td">: {getTimeFromSecond(punchData?.total_working_time) || '0m'}</div>
                            <div className="td"></div>
                            <div className="td"></div>
                        </div>
                        <div className="row" style={{ fontWeight: '700' }}>
                            <div className="td"></div>
                            <div className="td">Break Count </div>
                            <div className="td">: {punchData?.punch_list?.length - 1} times</div>
                            <div className="td"></div>
                            <div className="td"></div>
                        </div>
                    </div>

                </div>
                : <SpinWithMessage load={loading} message='No data available' height={'200px'} />
            }
        </div>
    )
}

export default DayWorkReportTable