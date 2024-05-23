import React, { useEffect, useState } from 'react'
import './day-work-report-table.scss'
import { userAxios } from '../../../config/axios'
import { useSelector } from 'react-redux'
import SpinWithMessage from '../../common/spinners/SpinWithMessage'
import Badge from '../../common/badge/Badge'
import { getTimeFromSecond, stringToLocalTime } from '../../../assets/javascript/date-helper'

const DayWorkReportTable = ({ date }) => {
    const [loading, setLoading] = useState('fetch')
    const { user } = useSelector((state) => state.userAuth)
    const [data, setData] = useState({})
    const [today, setToday] = useState(false)

    useEffect(() => {
        if (date) {
            userAxios.get(`/analyze/staff-work-data?from_date=${date}&to_date=${date}&staff_id=${user?._id}&type=staff-basie`)
                .then((response) => {
                    setData(response?.data?.[0]?.dates?.[0] || {})
                    setLoading('')
                })
        }
      
    }, [])

    return (
        <div className="day-work-report-table-div">
            {data?.date
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
                        {data?.punch_list?.map((item, index) => <div className="row">
                            <div className="td">Punch {index + 1}</div>
                            <div className="td" style={{ display: 'flex', gap: '5px' }}>
                                {item?.auto && <Badge title={'Auto punch outed'} text={"Auto"} className={'success-fill'} />}
                            </div>
                            <div className="td">{stringToLocalTime(item?.in)}</div>
                            <div className="td">{stringToLocalTime(item?.out)} {!today && item?.in && !item?.out &&
                                <Badge title={'The staff forgot punch out'} text={'Skipped'} className={'warning-fill'} />
                            }</div>
                            <div className="td">{getTimeFromSecond(item?.duration) || '0m'}</div>
                        </div>
                        )}

                        {/* Regular Work  */}
                        {data?.regular_work?.map((value, index) => {
                            return <div key={index} className="row">
                                <div className="td">{index === 0 && 'Regular work :'}</div>
                                <div className="td" title={value?.work} >{value?.work}</div>
                                <div className="td">{stringToLocalTime(value?.start)}</div>
                                <div className="td">{stringToLocalTime(value?.end)}</div>
                                <div className="td">{getTimeFromSecond(value?.duration) || '0m'}</div>
                            </div>
                        })}
                        {/* Extra work */}
                        {data?.extra_work?.map((value, index) => {
                            return <div key={index} className="row">
                                <div className="td">{index === 0 && 'Extra work :'}</div>
                                <div className="td" title={value?.work}>{value?.work}</div>
                                <div className="td">{stringToLocalTime(value?.start)}</div>
                                <div className="td">{stringToLocalTime(value?.end)}</div>
                                <div className="td">{getTimeFromSecond(value?.duration) || '0m'}</div>
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
                : <SpinWithMessage load={loading} message='No data available' height={'200px'} />
            }
        </div>
    )
}

export default DayWorkReportTable