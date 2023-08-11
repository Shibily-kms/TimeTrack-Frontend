import React, { useRef } from 'react'
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs'
import './date-bar.scss'

function DateBar({ data, selected, setSelected }) {
    const scrollContainerRef = useRef(null);

    const scrollLeft = () => {
        scrollContainerRef.current.scrollBy({
            left: -200, // Adjust this value based on the scroll distance you want
            behavior: 'smooth',
        });
    };

    const scrollRight = () => {
        scrollContainerRef.current.scrollBy({
            left: 200, // Adjust this value based on the scroll distance you want
            behavior: 'smooth',
        });
    };


    return (
        <div className='date-bar-div'>
            <div className="main-box">
                <div className="items-div" ref={scrollContainerRef}>
                    {data.map((day, index) => {
                        return <div key={index} className={`item-box ${day.day === 'SUN' && 'sunday'} 
                        ${selected.date === day.date && selected.month === day.month && 'active'}`}
                            onClick={() => setSelected({ date: day.date, month: day.month })
                            }>
                            <div className="content ">
                                <h3>{day.date}</h3>
                                <h5>{day.day}</h5>
                            </div>
                            {day?.attendanceCount > 0 && <div className="count">
                                <span>{day.attendanceCount}</span>
                            </div>}
                        </div>
                    })}

                </div>
                <div className="icon-button-div left" onClick={scrollLeft}>
                    <span ><BsChevronLeft /></span>
                </div>
                <div className="icon-button-div right" onClick={scrollRight}>
                    <span ><BsChevronRight /></span>
                </div>
            </div>
        </div >
    )
}

export default DateBar