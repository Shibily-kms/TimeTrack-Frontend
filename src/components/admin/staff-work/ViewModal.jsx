import React, { useEffect, useState } from 'react'
import './view-modal.scss'
import { FcLeave, FcPlanner } from 'react-icons/fc'
import { TbFingerprintOff } from 'react-icons/tb'
import { stringToLocalTime, getTimeFromSecond } from '../../../assets/javascript/date-helper'
import Badge from '../../common/badge/Badge'
import SpinWithMessage from '../../common/spinners/SpinWithMessage'

function ViewModal({ data, info, }) {
    const months = ['Jun', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dev']

    const [today, setToday] = useState(false)

    useEffect(() => {
        if (new Date().getDate() === info?.date && new Date().getMonth() === info?.month) {
            setToday(true)
        } else {
            setToday(false)
        }

    }, [info])


    return (
        <div className='view-modal'>
            <div className="top">
                <div className="name-section">
                    <h5>{data.full_name}</h5>
                    <Badge title={data?.current_designation ? 'Current designation' : 'Designation of the day'} text={data.designation}
                        className={'gray-fill'} />
                </div>
                <div className="date-sections">
                    <h5>{info.date + '-' + months[info.month] + '-' + info.year}</h5>
                </div>
            </div>
            {data?.punch ? <>
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
                        <div className="row">
                            <div className="td">Punch</div>
                            <div className="td">{data?.auto_punch_out &&
                                <Badge title={'Auto punch outed'} text={'Auto'} className={'info-fill'} />}
                            </div>
                            <div className="td">{stringToLocalTime(data.punch?.in)}</div>
                            <div className="td">{stringToLocalTime(data.punch?.out)} {!today && data?.punch?.in && !data?.punch?.out &&
                                <Badge title={'Auto punch out not work / Punch in after auto punch out time'} text={'Skipped'} className={'warning-fill'} />
                            }</div>
                            <div className="td">{getTimeFromSecond(data.punch.duration) || '0m'}</div>
                        </div>
                        {/* Over Time */}
                        {data?.over_time?.in && <div className="row">
                            <div className="td">Over time</div>
                            <div className="td"></div>
                            <div className="td">{stringToLocalTime(data?.over_time?.in)}</div>
                            <div className="td">{stringToLocalTime(data?.over_time?.out)}{!today && data?.over_time?.in && !data?.over_time?.out &&
                                <Badge text={'Skipped'} className={'warning-fill'} />
                            }</div>
                            <div className="td">{getTimeFromSecond(data?.over_time?.duration) || '0m'}</div>
                        </div>}

                        {/* Lunch Break */}
                        {data?.lunch_break?.start && <div className="row">
                            <div className="td">Lunch break</div>
                            <div className="td"></div>
                            <div className="td">{stringToLocalTime(data?.lunch_break?.start)}</div>
                            <div className="td">{stringToLocalTime(data?.lunch_break?.end)}</div>
                            <div className="td">{getTimeFromSecond(data?.lunch_break?.duration) || '0m'}</div>
                        </div>}

                        {/* Break */}
                        {data?.break?.map((value, index) => {
                            return <div key={index} className="row">
                                <div className="td">Break {index + 1}</div>
                                <div className="td"></div>
                                <div className="td">{stringToLocalTime(value?.start)}</div>
                                <div className="td">{stringToLocalTime(value?.end)}</div>
                                <div className="td">{getTimeFromSecond(value?.duration) || '0m'}</div>
                            </div>
                        })}
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
                            <div className="td">: {getTimeFromSecond(data.punch?.duration + data?.over_time?.duration) || '0m'}</div>
                            <div className="td"></div>
                            <div className="td"></div>
                        </div>
                        <div className="row" style={{ fontWeight: '700' }}>
                            <div className="td"></div>
                            <div className="td">Break duration </div>
                            <div className="td">: {getTimeFromSecond(data.break_duration) || '0m'}</div>
                            <div className="td"></div>
                            <div className="td"></div>
                        </div>
                    </div>

                </div>
            </>
                : <SpinWithMessage height={'250px'} icon={info?.day === 'SUN' ? <FcPlanner /> : today ? <TbFingerprintOff /> : <FcLeave />}
                    message={info?.day === 'SUN' ? 'Holiday' : today ? 'Not punched' : 'Took leave'} />}
        </div>
    )
}

export default ViewModal