import React from 'react'
import './style.scss'
import { FaCheck, FaTrash, FaPencil, FaCircleInfo } from "react-icons/fa6";
import { GoDotFill } from "react-icons/go";
import { convertIsoToAmPm } from '../../../assets/javascript/date-helper'

const RegularWorkCard = ({ allWork, data, openWorkModal }) => {
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return (
        <div className="regular-work-card-div">
            <div className="left-div">
                {!allWork && <>
                    {data?.finished
                        ? <div className="checkbox selected-box"><FaCheck /></div>
                        : <div className="checkbox"><GoDotFill /></div>
                    }
                </>
                }
                <div>
                    <p>{data?.title}</p>
                    {allWork && <>
                        {data?.repeat_type === 'monthly'
                            ? <small>Monthly : {data?.monthly?.length === 31 ? "All Days" : [...data?.monthly]?.sort((a, b) => a - b)?.map((day) => (`${day}, `))}</small>
                            : data?.repeat_type === 'weekly'
                                ? <small>Weekly : {data?.weekly?.length === 7 ? "All Days" : [...data.weekly].sort((a, b) => a - b).map(day => `${daysOfWeek[day]}, `)}</small>
                                : <small>Daily : Interval : 1</small>}

                    </>
                    }
                </div>
            </div>
            <div className="right-div">
                {!allWork && data?.do_time && <p>{convertIsoToAmPm(new Date(data?.do_time))}</p>}
                {allWork && <>
                    {data?.self_start ? <>
                        <FaPencil onClick={() => openWorkModal('Update Regular Work', data)} />
                        <FaTrash />
                    </> : <p><FaCircleInfo /> Admin only</p>}
                </>}
            </div>
        </div>
    )
}

export default RegularWorkCard