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
            </>
                : <SpinWithMessage height={'250px'} icon={info?.day === 'SUN' ? <FcPlanner /> : today ? <TbFingerprintOff /> : <FcLeave />}
                    message={info?.day === 'SUN' ? 'Holiday' : today ? 'Not punched' : 'Took leave'} />}
        </div>
    )
}

export default ViewModal