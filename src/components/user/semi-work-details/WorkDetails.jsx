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
                {workDetails?.name
                    ? <div className="list-body">
                        <div className="table-title-div">
                            <h3>Today Work Report</h3>
                        </div>
                        <div className="list-head">
                            <span></span>
                            <span>In</span>
                            <span>Out</span>
                            <span>Duration</span>
                        </div>

                        {workDetails?.punch_list?.map((item, index) => <div className="list-item">
                            <span>Punch {index + 1}</span>
                            <span>{convertIsoToAmPm(new Date(item.in))}</span>
                            <span>{item.out ? convertIsoToAmPm(new Date(item.out)) : '-'}</span>
                            {item?.out
                                ? <span>{getTimeFromSecond((new Date(item?.out) - new Date(item.in)) / 1000) || '0m'}</span>
                                : <span>-</span>}
                        </div>)}

                    </div>
                    : <div >
                        <SpinnerWithMessage fullView={true} icon={<IoFingerPrint />} message='Click punch In button for start work!' />
                    </div>}
            </div>
        </div>
    )
}

export default WorkDetails