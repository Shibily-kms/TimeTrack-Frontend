import React, { useEffect, useRef, useState } from 'react'
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs'
import './date-bar.scss'

function DateBar({ data, selected, setSelected }) {
    const scrollContainerRef = useRef(null);
    const selectedRef = useRef(null); // Ref for the selected active date
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        if (scrollContainer) {
            setShowLeftArrow(false);
            setShowRightArrow(scrollContainer.scrollWidth > scrollContainer.clientWidth);
            scrollContainer.scrollLeft = 0;
        }
    }, [data]);

    useEffect(() => {
        if (selectedRef.current) {
            selectedRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    }, [selected, data]);

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
                    {data?.map((day, index) => {
                        return <div key={index} className={`item-box ${new Date(day.date).getDay() === 0 && 'sunday'} 
                        ${selected === day.date && 'active'}`}
                            ref={selected === day.date ? selectedRef : null}
                            onClick={() => setSelected(day.date)} >
                            <div className="content" title={`${new Date(day.date).toDateString()}`}>
                                <h3>{new Date(day.date).getDate()}</h3>
                                <h5>{days[new Date(day.date).getDay()]}</h5>
                            </div>
                            {day?.attendance > 0 && <div className="count">
                                <span>{day.attendance}</span>
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