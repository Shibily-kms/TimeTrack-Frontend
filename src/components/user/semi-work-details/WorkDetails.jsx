import React from 'react'
import './work-details.scss'
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
                            <span>{new Date(workDetails.punch_in).toLocaleTimeString()}</span>
                            <span>{workDetails.punch_out ? new Date(workDetails.punch_in).toLocaleTimeString() : '-'}</span>
                        </div>
                    </>}
                    {workDetails?.break?.start && <>
                        <div className="list-item">
                            <span>Last Break</span>
                            <span>{new Date(workDetails?.break?.start).toLocaleTimeString()}</span>
                            <span>{workDetails?.break?.end ? new Date(workDetails?.break?.end).toLocaleTimeString() : '-'}</span>
                        </div>
                    </>}
                    {workDetails?.lunch_break?.start && <>
                        <div className="list-item">
                            <span>Lunch </span>
                            <span>{new Date(workDetails?.lunch_break?.start).toLocaleTimeString()}</span>
                            <span>{workDetails?.lunch_break?.end ? new Date(workDetails?.lunch_break?.end).toLocaleTimeString() : '-'}</span>
                        </div>
                    </>}
                    {workDetails?.over_time?.in && <>
                        <div className="list-item">
                            <span>Over Time </span>
                            <span>{new Date(workDetails?.over_time?.in).toLocaleTimeString()}</span>
                            <span>{workDetails?.over_time?.out ? new Date(workDetails?.over_time?.out).toLocaleTimeString() : '-'}</span>
                        </div>
                    </>}
                </div>
            </div>}
        </div>
    )
}

export default WorkDetails