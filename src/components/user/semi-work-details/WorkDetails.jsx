import React from 'react'
import './work-details.scss'
import { useSelector } from 'react-redux'
import { convertIsoToAmPm } from '../../../assets/javascript/date-helper'

function WorkDetails() {
    const { workDetails } = useSelector((state) => state.workData)

    return (
        <div className="semi-work-details">
            {workDetails?.punch_in && <div className="border">
                <div className="list-body">
                    <div className="list-head">
                        <span></span>
                        <span>START</span>
                        <span>END</span>
                    </div>
                    {workDetails.punch_in && <>
                        <div className="list-item">
                            <span>Punch</span>
                            <span>{convertIsoToAmPm(new Date(workDetails.punch_in))}</span>
                            <span>{workDetails.punch_out ? convertIsoToAmPm(new Date(workDetails.punch_out)) : '-'}</span>
                        </div>
                    </>}
                    {workDetails?.break?.start && <>
                        <div className="list-item">
                            <span>Last Break</span>
                            <span>{convertIsoToAmPm(new Date(workDetails?.break?.start))}</span>
                            <span>{workDetails?.break?.end ? convertIsoToAmPm(new Date(workDetails?.break?.end)) : '-'}</span>
                        </div>
                    </>}
                    {workDetails?.lunch_break?.start && <>
                        <div className="list-item">
                            <span>Lunch </span>
                            <span>{convertIsoToAmPm(new Date(workDetails?.lunch_break?.start))}</span>
                            <span>{workDetails?.lunch_break?.end ? convertIsoToAmPm(new Date(workDetails?.lunch_break?.end)) : '-'}</span>
                        </div>
                    </>}
                    {workDetails?.over_time?.in && <>
                        <div className="list-item">
                            <span>Over Time </span>
                            <span>{convertIsoToAmPm(new Date(workDetails?.over_time?.in))}</span>
                            <span>{workDetails?.over_time?.out ? convertIsoToAmPm(new Date(workDetails?.over_time?.out)) : '-'}</span>
                        </div>
                    </>}
                </div>
            </div>}
        </div>
    )
}

export default WorkDetails