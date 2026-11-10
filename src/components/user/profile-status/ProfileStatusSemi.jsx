import React from 'react'
import './profile-status-semi.scss'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { IoChevronForward } from 'react-icons/io5'
import { RiShieldUserLine } from 'react-icons/ri'

const ProfileStatusSemi = ({ hideButton = false }) => {
    const { user } = useSelector((state) => state.userAuth)
    const navigate = useNavigate()

    const statusPercent = Math.min(100, Math.max(0, Number(user?.profile_status) || 0))

    const statusTier =
        statusPercent >= 90 ? 'excellent' :
        statusPercent >= 75 ? 'good' :
        statusPercent >= 50 ? 'fair' : 'basic'

    const handleNavigate = () => {
        if (!hideButton) {
            navigate('/my-account/profile/complete-info')
        }
    }

    return (
        <div
            className={`profile-status-minimal ${statusTier} ${hideButton ? 'no-click' : 'clickable'}`}
            onClick={handleNavigate}
            role={hideButton ? undefined : 'button'}
            tabIndex={hideButton ? undefined : 0}
            aria-label="Complete your profile"
            onKeyDown={(e) => !hideButton && (e.key === 'Enter' || e.key === ' ') && handleNavigate()}
        >
            {/* Main Single Row */}
            <div className="status-main-row">
                <div className="status-left">
                    <span className="status-icon-wrapper">
                        <RiShieldUserLine className="status-icon" />
                    </span>
                    <div className="status-text">
                        <span className="title">Profile Setup</span>
                        <span className="dot">•</span>
                        <span className="percent-text">{statusPercent}% complete</span>
                    </div>
                </div>

                {!hideButton && (
                    <div className="status-action">
                        <span>Finish</span>
                        <IoChevronForward className="action-chevron" />
                    </div>
                )}
            </div>

            {/* Slim 3px Progress Line */}
            <div className="status-progress-track">
                <div
                    className="status-progress-bar"
                    style={{ width: `${statusPercent}%` }}
                />
            </div>
        </div>
    )
}

export default ProfileStatusSemi
