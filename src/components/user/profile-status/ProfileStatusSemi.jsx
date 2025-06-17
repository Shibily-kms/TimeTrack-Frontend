import React from 'react'
import './profile-status-semi.scss'
import SingleButton from '../../common/buttons/SingleButton'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const ProfileStatusSemi = ({ hideButton = false }) => {
    const { user } = useSelector((state) => state.userAuth)
    const navigate = useNavigate()


    return (
        <div className="profile-status-semi-comp-div">
            <div className={`border ${user?.profile_status > 89 ? 'Excellent' : user?.profile_status > 74 ? 'Good' : user?.profile_status > 49 ? 'Fair' : user?.profile_status > 24 ? 'Poor' : 'Bad'}`}>
                <div className="rounded-div">
                    <div class="single-chart">
                        <svg viewBox="0 0 36 36" class="circular-chart">
                            <path class="circle-bg" d="M18 2.0845  a 15.9155 15.9155 0 0 1 0 31.831  a 15.9155 15.9155 0 0 1 0 -31.831" />
                            <path class="circle" stroke-dasharray={`${user?.profile_status}, 100`} d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                            <text x="18" y="20.35" class="percentage">{user?.profile_status}%</text>
                        </svg>
                    </div>
                </div>
                <div className="text-div">
                    <h3>Your profile is {user?.profile_status}% complete!</h3>
                    {user?.profile_status !== 100 && <h4>Finish setting up to unlock more features.</h4>}
                    <h4>Your profile status is {user?.profile_status > 89 ? 'Excellent' : user?.profile_status > 74 ? 'Good' : user?.profile_status > 49 ? 'Fair' : user?.profile_status > 24 ? 'Poor' : 'Bad'}.</h4>
                </div>

                {(user?.profile_status !== 100 && !hideButton) && <div className="button-div">
                    <SingleButton name={'Complete'} onClick={() => navigate('/my-account/profile/complete-info')} />
                </div>}
            </div>
        </div>
    )
}

export default ProfileStatusSemi