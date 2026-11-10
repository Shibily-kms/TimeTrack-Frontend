import React, { useEffect, useMemo } from 'react'
import './work-details.scss'
import { useDispatch, useSelector } from 'react-redux'
import { convertIsoToAmPm, getTimeFromSecond, YYYYMMDDFormat } from '../../../assets/javascript/date-helper'
import { IoFingerPrint, IoCalendarOutline, IoChevronForward } from "react-icons/io5";
import { BsQrCodeScan } from "react-icons/bs";
import { MdLogin, MdLogout, MdHistory } from "react-icons/md";
import { TbLoader } from 'react-icons/tb';
import PunchWork from '../../../pages/user/punch-work/PunchWork'
import { useNavigate } from 'react-router-dom'
import { getPunchDetails } from '../../../redux/features/user/workdataSlice'

function WorkDetails() {
    const { workDetails, isLoading } = useSelector((state) => state.workData)
    const { user } = useSelector((state) => state.userAuth)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getPunchDetails())
        // eslint-disable-next-line
    }, [])

    // Filter today's punches
    const isToday = workDetails?.date === YYYYMMDDFormat(new Date())
    const punchList = useMemo(() => {
        if (isToday && Array.isArray(workDetails?.punch_list)) {
            return workDetails.punch_list
        }
        return []
    }, [isToday, workDetails?.punch_list])

    // Check if currently clocked in
    const lastPunch = punchList[punchList.length - 1]
    const isClockedIn = Boolean(lastPunch?.in && !lastPunch?.out)

    // First In & Last Out
    const firstInTime = punchList[0]?.in ? convertIsoToAmPm(new Date(punchList[0].in)) : '--:--'
    const lastOutTime = isClockedIn
        ? 'Active'
        : (punchList.filter(p => p.out).pop()?.out
            ? convertIsoToAmPm(new Date(punchList.filter(p => p.out).pop().out))
            : '--:--')

    // Today's formatted date string (e.g. "Today, Tue 10 Nov")
    const formattedDate = useMemo(() => {
        const today = new Date()
        const dayName = today.toLocaleDateString('en-US', { weekday: 'short' })
        const monthName = today.toLocaleDateString('en-US', { month: 'short' })
        const dayNum = today.getDate()
        return `Today, ${dayName} ${dayNum} ${monthName}`
    }, [])

    return (
        <div className="mobile-work-details">
            {/* Main Attendance Card */}
            <div className="work-card">
                {/* Header: Date + Status Badge */}
                <div className="card-header">
                    <div className="date-badge">
                        <IoCalendarOutline className="calendar-icon" />
                        <span>{formattedDate}</span>
                    </div>

                    <div className={`status-pill ${isClockedIn ? 'active' : punchList.length > 0 ? 'completed' : 'idle'}`}>
                        {isClockedIn ? (
                            <>
                                <span className="pulse-indicator"></span>
                                <span>CLOCKED IN</span>
                            </>
                        ) : punchList.length > 0 ? (
                            <>
                                <span className="dot completed-dot"></span>
                                <span>CLOCKED OUT</span>
                            </>
                        ) : (
                            <>
                                <span className="dot idle-dot"></span>
                                <span>NOT STARTED</span>
                            </>
                        )}
                    </div>
                </div>

                {/* Quick Metrics Bar */}
                <div className="quick-metrics-grid">
                    <div className="metric-box">
                        <span className="metric-label">First In</span>
                        <span className="metric-val in-val">{firstInTime}</span>
                    </div>
                    <div className="metric-divider" />
                    <div className="metric-box">
                        <span className="metric-label">Last Out</span>
                        <span className={`metric-val ${isClockedIn ? 'active-val' : 'out-val'}`}>{lastOutTime}</span>
                    </div>
                    <div className="metric-divider" />
                    <div className="metric-box">
                        <span className="metric-label">Sessions</span>
                        <span className="metric-val">{punchList.length}</span>
                    </div>
                </div>

                {/* Punches Timeline or Empty State */}
                <div className="sessions-section">
                    {punchList.length > 0 ? (
                        <>
                            <div className="sessions-header">
                                <div className="title-area">
                                    <MdHistory className="history-icon" />
                                    <h4>Today's Activity</h4>
                                </div>
                                <span className="count-badge">
                                    {punchList.length} {punchList.length === 1 ? 'Punch' : 'Punches'}
                                </span>
                            </div>

                            <div className="sessions-list">
                                {punchList.map((item, index) => {
                                    const isOngoing = !item.out
                                    const durationText = item.out
                                        ? getTimeFromSecond((new Date(item.out) - new Date(item.in)) / 1000) || '0m'
                                        : 'Active'

                                    return (
                                        <div key={index} className={`session-row ${isOngoing ? 'is-ongoing' : ''}`}>
                                            <div className="session-left">
                                                <div className="session-index-chip">
                                                    <span>#{index + 1}</span>
                                                </div>

                                                <div className="timeline-flow">
                                                    <div className="time-point in-point">
                                                        <span className="point-icon"><MdLogin /></span>
                                                        <span className="point-time">{convertIsoToAmPm(new Date(item.in))}</span>
                                                    </div>

                                                    <span className="flow-arrow">→</span>

                                                    <div className="time-point out-point">
                                                        <span className="point-icon"><MdLogout /></span>
                                                        <span className="point-time">
                                                            {item.out ? convertIsoToAmPm(new Date(item.out)) : (
                                                                <span className="live-status-tag">Working</span>
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="session-right">
                                                <div className={`duration-badge ${isOngoing ? 'ongoing-duration' : ''}`}>
                                                    {isOngoing && <span className="mini-pulse" />}
                                                    <span>{durationText}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </>
                    ) : (
                        <div className="empty-attendance-box">
                            <div className="empty-icon-ring">
                                {user?.punch_type === 'software' ? <IoFingerPrint /> : <BsQrCodeScan />}
                            </div>
                            <h5>Ready to start work?</h5>
                            <p>
                                {user?.punch_type === 'software'
                                    ? 'Swipe the slider below to clock in for your shift.'
                                    : 'Scan the attendance QR code to begin.'}
                            </p>
                        </div>
                    )}
                </div>

                {/* Action Area: Swipe Button or Scanner */}
                <div className="punch-actions-wrapper">
                    {isLoading ? (
                        <div className="syncing-state-card">
                            <TbLoader className="sync-spinner" />
                            <span>Syncing attendance details...</span>
                        </div>
                    ) : (
                        <>
                            {/* Software Punch Swipe Slider */}
                            {(user?.punch_type === 'software' || (user?.punch_type === 'firstInScanner' && punchList[0])) && (
                                <PunchWork />
                            )}

                            {/* Scanner Punch Button */}
                            {(!user?.punch_type || user?.punch_type === 'scanner' || (user?.punch_type === 'firstInScanner' && !punchList[0])) && (
                                <button className="mobile-scanner-btn" onClick={() => navigate('/scanner')}>
                                    <span className="scanner-btn-icon"><BsQrCodeScan /></span>
                                    <span className="scanner-btn-label">Open QR Scanner</span>
                                    <span className="scanner-btn-arrow"><IoChevronForward /></span>
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default WorkDetails
