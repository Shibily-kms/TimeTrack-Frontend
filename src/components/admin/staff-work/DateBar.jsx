import React, { useEffect, useRef, useState } from 'react'
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs'
import './date-bar.scss'

function DateBar({ data, selected, setSelected }) {
    const scrollContainerRef = useRef(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        if (scrollContainer) {
            setShowLeftArrow(false);
            setShowRightArrow(scrollContainer.scrollWidth > scrollContainer.clientWidth);
            scrollContainer.scrollLeft = 0;
        }
    }, [data]);

    const handleScroll = () => {
        const scrollContainer = scrollContainerRef.current;
        if (scrollContainer) {
            setShowLeftArrow(scrollContainer.scrollLeft > 0);
            setShowRightArrow(
                scrollContainer.scrollLeft < scrollContainer.scrollWidth - (scrollContainer.clientWidth + 5)
            );
        }
    };

    const handleScrollLeft = () => {
        scrollContainerRef.current.scrollBy({
            left: -200, // Adjust this value based on the scroll distance you want
            behavior: 'smooth',
        });
    };

    const handleScrollRight = () => {
        scrollContainerRef.current.scrollBy({
            left: 200, // Adjust this value based on the scroll distance you want
            behavior: 'smooth',
        });
    };


    return (
        <div className='date-bar-div'>
            <div className="main-box">
                <div className="items-div" ref={scrollContainerRef} onScroll={handleScroll}>
                    {data.map((day, index) => {
                        return <div key={index} className={`item-box ${day.day === 'SUN' && 'sunday'} 
                        ${selected.date === day.date && selected.month === day.month && selected.year === day.year && 'active'}`}
                            onClick={() => setSelected({ date: day.date, month: day.month, year: day.year, count: day.attendanceCount })
                            }>
                            <div className="content" title={`${day.date}-${day.month + 1}-${day.year}`}>
                                <h3>{day.date}</h3>
                                <h5>{day.day}</h5>
                            </div>
                            {day?.attendanceCount > 0 && <div className="count">
                                <span>{day.attendanceCount}</span>
                            </div>}
                        </div>
                    })}

                </div>
                {showLeftArrow && <div className="icon-button-boarder left">
                    <div className="icon-button-div " onClick={handleScrollLeft}>
                        <span ><BsChevronLeft /></span>
                    </div>
                </div>}

                {showRightArrow && <div className="icon-button-boarder right">
                    <div className="icon-button-div " onClick={handleScrollRight}>
                        <span ><BsChevronRight /></span>
                    </div>
                </div>}

            </div>
        </div >
    )
}

export default DateBar