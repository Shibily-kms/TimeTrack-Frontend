import React, { useMemo } from 'react';
import './profile-card.scss';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { TimeBasedGreeting, YYYYMMDDFormat } from '../../../assets/javascript/date-helper';
import { getUserProfileImagePath } from '../../../assets/javascript/find-helpers';
import { ui_version } from '../../../assets/javascript/const-data';
import { RiShieldStarLine } from "react-icons/ri";
import { TbSunrise, TbSun, TbSunset2, TbMoon, TbBriefcase, TbId } from "react-icons/tb";
import { IoCalendarClearOutline, IoChevronForward } from "react-icons/io5";

const ProfileCard = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.userAuth);
    const { workDetails } = useSelector((state) => state.workData);

    const userProfileImage = getUserProfileImagePath(user?.last_name);

    // Live Work Status (Clocked In vs Clocked Out)
    const isTodayWork = workDetails?.date === YYYYMMDDFormat(new Date());
    const punchList = isTodayWork && Array.isArray(workDetails?.punch_list) ? workDetails.punch_list : [];
    const lastPunchData = punchList.length > 0 ? punchList[punchList.length - 1] : null;
    const inWork = Boolean(lastPunchData?.in && !lastPunchData?.out);

    // Birthday Check
    const isBirthday = Boolean(user?.dob && user?.dob?.slice(5) === YYYYMMDDFormat(new Date())?.slice(5));

    // Contextual Greeting Icon
    const GreetingIcon = useMemo(() => {
        const hour = new Date().getHours();
        if (hour < 12) return TbSunrise;
        if (hour < 17) return TbSun;
        if (hour < 20) return TbSunset2;
        return TbMoon;
    }, []);

    // Formatted current date for mobile header
    const formattedDate = useMemo(() => {
        try {
            return new Intl.DateTimeFormat('en-US', {
                weekday: 'short',
                day: 'numeric',
                month: 'short'
            }).format(new Date());
        } catch {
            return '';
        }
    }, []);

    const handleNavigateToProfile = () => {
        navigate('/my-account/profile?page=more');
    };

    return (
        <div 
            className="mobile-profile-starter-card" 
            onClick={handleNavigateToProfile}
            role="button"
            tabIndex={0}
            aria-label="View user profile"
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleNavigateToProfile()}
        >
            {/* Ambient Background Aura Glow */}
            <div className="card-ambient-glow" />

            {/* Top Bar: Time Greeting & Current Date */}
            <div className="starter-top-bar">
                <div className="greeting-badge">
                    <GreetingIcon className="greeting-icon" />
                    <span>{TimeBasedGreeting()}</span>
                </div>
                <div className="date-badge">
                    <IoCalendarClearOutline className="date-icon" />
                    <span>{formattedDate}</span>
                </div>
            </div>

            {/* Main Hero Identity Section */}
            <div className="starter-profile-body">
                <div className="avatar-container">
                    <div className="avatar-frame">
                        <img 
                            src={userProfileImage} 
                            alt={`${user?.first_name || 'User'} profile`} 
                            onError={(e) => {
                                try {
                                    e.currentTarget.src = require('../../../assets/images/profile-tamp/common.png');
                                } catch {
                                    // Fallback silence
                                }
                            }}
                        />
                    </div>
                    {/* Live Presence Indicator */}
                    <span 
                        className={`live-presence-beacon ${inWork ? 'status-online' : 'status-offline'}`}
                        title={inWork ? 'Clocked In' : 'Clocked Out'}
                    >
                        {inWork && <span className="beacon-ping" />}
                        <span className="beacon-core" />
                    </span>
                </div>

                <div className="identity-content">
                    <div className="name-row">
                        <h2 className="user-full-name">
                            {user?.first_name ? `${user?.first_name} ${user?.last_name || ''}` : 'Welcome Back'}
                        </h2>
                        {user?.pro_account?.[0] && (
                            <span className="pro-account-chip" title="Pro Account">
                                <RiShieldStarLine />
                                <span>PRO</span>
                            </span>
                        )}
                    </div>

                    <div className="meta-chips-row">
                        <span className="meta-tag sid-tag">
                            <TbId className="meta-tag-icon" />
                            <span>{user?.sid ? `ID: ${user?.sid}` : 'ID: NILL'}</span>
                        </span>
                        <span className="meta-tag role-tag">
                            <TbBriefcase className="meta-tag-icon" />
                            <span>{user?.designation || 'Staff'}</span>
                        </span>
                    </div>
                </div>

                <div className="profile-action-chevron" title="Open profile">
                    <IoChevronForward />
                </div>
            </div>

            {/* Bottom Section: Live Work Status Pill & Version (Replaced on Birthday) */}
            <div className="starter-status-strip">
                {isBirthday ? (
                    <div className="birthday-pill">
                        <span className="birthday-icon">🎉</span>
                        <span className="birthday-text">Happy Birthday, {user?.first_name || 'you'}! 🎂</span>
                    </div>
                ) : (
                    <>
                        <div className={`status-pill ${inWork ? 'is-active' : 'is-inactive'}`}>
                            <span className="pulse-dot" />
                            <span className="status-label">{inWork ? 'Clocked In' : 'Clocked Out'}</span>
                        </div>

                        <div className="summary-quick-stat">
                            <span className="version-tag">v{ui_version}</span>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ProfileCard;
