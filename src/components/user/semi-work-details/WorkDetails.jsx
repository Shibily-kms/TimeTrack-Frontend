import React from 'react'
import './work-details.scss'
import { useSelector } from 'react-redux'
import { convertIsoToAmPm, getTimeFromSecond } from '../../../assets/javascript/date-helper'
import SpinnerWithMessage from '../../../components/common/spinners/SpinWithMessage'
import { IoFingerPrint } from "react-icons/io5";

function WorkDetails() {
    const { workDetails } = useSelector((state) => state.workData)

    return (
        <div className="semi-work-details">
            <div className="border">
                {workDetails?.punch_in ?
                    <div className="list-body">
                        <div className="table-title-div">
                            <h3>Today Work Report</h3>
                        </div>
                        <div className="list-head">
                            <span></span>
                            <span>In</span>
                            <span>Out</span>
                            <span>Duration</span>
                        </div>
                        {workDetails.punch_in && <>
                            <div className="list-item">
                                <span>Punch</span>
                                <span>{convertIsoToAmPm(new Date(workDetails.punch_in))}</span>
                                <span>{workDetails.punch_out ? convertIsoToAmPm(new Date(workDetails.punch_out)) : '-'}</span>
                                {workDetails?.punch_out
                                    ? <span>{getTimeFromSecond((new Date(workDetails?.punch_out) - new Date(workDetails.punch_in)) / 1000) || '0m'}</span>
                                    : <span>-</span>}
                            </div>
                        </>}

                        {workDetails?.break?.map((item, index) => <div className="list-item">
                            <span>Break {index + 1}</span>
                            <span>{convertIsoToAmPm(new Date(item?.start))}</span>
                            <span>{item?.end ? convertIsoToAmPm(new Date(item?.end)) : '-'}</span>
                            <span>{getTimeFromSecond(item?.duration) || '0m'}</span>
                        </div>)}

                        {workDetails?.lunch_break?.start && <>
                            <div className="list-item">
                                <span>Lunch </span>
                                <span>{convertIsoToAmPm(new Date(workDetails?.lunch_break?.start))}</span>
                                <span>{workDetails?.lunch_break?.end ? convertIsoToAmPm(new Date(workDetails?.lunch_break?.end)) : '-'}</span>
                                <span>{getTimeFromSecond(workDetails.lunch_break.duration) || '0m'}</span>
                            </div>
                        </>}
                        {workDetails?.over_time?.in && <>
                            <div className="list-item">
                                <span>Over Time </span>
                                <span>{convertIsoToAmPm(new Date(workDetails?.over_time?.in))}</span>
                                <span>{workDetails?.over_time?.out ? convertIsoToAmPm(new Date(workDetails?.over_time?.out)) : '-'}</span>
                                {workDetails?.over_time?.out
                                    ? <span>{getTimeFromSecond((new Date(workDetails?.over_time?.out) - new Date(workDetails?.over_time?.in)) / 1000) || '0m'}</span>
                                    : <span>-</span>}
                            </div>
                        </>}
                    </div>
                    : <div >
                        <SpinnerWithMessage fullView={true} icon={<IoFingerPrint />} message='Click punch In button for start work!' />
                    </div>}
            </div>
        </div>
    )
}

export default WorkDetails