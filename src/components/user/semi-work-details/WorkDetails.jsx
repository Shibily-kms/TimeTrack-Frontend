import React from 'react'
import './work-details.scss'
import { stringToLocalTime } from '../../../assets/javascript/date-helper'
import { useSelector } from 'react-redux'

function WorkDetails() {
    const { workDetails } = useSelector((state) => state.workData)

    return (
        <div className="semi-work-details">
            {workDetails?.punch_in && <div className="border">
                <div className="list-body">
                    <div className="list-head">
                        <span></span>
                        <span>IN</span>
                        <span>OUT</span>
                    </div>
                    {workDetails.punch_in && <>
                        <div className="list-item">
                            <span>Punch</span>
                            <span>{stringToLocalTime(new Date(workDetails.punch_in).toLocaleTimeString())}</span>
                            <span>{workDetails.punch_out ? stringToLocalTime(new Date(workDetails.punch_in).toLocaleTimeString()) : '-'}</span>
                        </div>
                    </>}
                    {workDetails?.break?.start && <>
                        <div className="list-item">
                            <span>Last Break</span>
                            <span>{stringToLocalTime(new Date(workDetails?.break?.start).toLocaleTimeString())}</span>
                            <span>{workDetails?.break?.end ? stringToLocalTime(new Date(workDetails?.break?.end).toLocaleTimeString()) : '-'}</span>
                        </div>
                    </>}
                    {workDetails?.lunch_break?.start && <>
                        <div className="list-item">
                            <span>Lunch </span>
                            <span>{stringToLocalTime(new Date(workDetails?.lunch_break?.start).toLocaleTimeString())}</span>
                            <span>{workDetails?.lunch_break?.end ? stringToLocalTime(new Date(workDetails?.lunch_break?.end).toLocaleTimeString()) : '-'}</span>
                        </div>
                    </>}
                    {workDetails?.over_time?.in && <>
                        <div className="list-item">
                            <span>Over Time </span>
                            <span>{stringToLocalTime(new Date(workDetails?.over_time?.in).toLocaleTimeString())}</span>
                            <span>{workDetails?.over_time?.out ? stringToLocalTime(new Date(workDetails?.over_time?.out).toLocaleTimeString()) : '-'}</span>
                        </div>
                    </>}
                </div>
            </div>}
        </div>
    )
}

export default WorkDetails