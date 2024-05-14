import React, { useEffect, useState } from 'react'
import './profile.scss'
import { getUserProfileImagePath } from '../../../assets/javascript/find-helpers';
import { getTimeFromSecond } from '../../../assets/javascript/date-helper';
import { userAxios } from '../../../config/axios'
import { useDispatch, useSelector } from 'react-redux'
// import { TbCamera } from "react-icons/tb";
import { GrEdit } from "react-icons/gr";
import { TbReport } from "react-icons/tb";
import { LuBadgeHelp } from "react-icons/lu";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from '../../../redux/features/user/systemSlice'
import SpinWithMessage from '../../../components/common/spinners/SpinWithMessage';

const Profile = ({ setPageHead }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()
    const { user } = useSelector((state) => state.userAuth)
    const userProfileImage = getUserProfileImagePath(user?.last_name);
    const [userData, setUserData] = useState({})
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!searchParams.get('page')) {
            setSearchParams(`page=more`)
        }
        setLoading(true)
        userAxios.get(`/profile?staffId=${user?._id}`).then((response) => {
            setUserData(response.data)
            setLoading(false)
        }).catch((error) => {
            dispatch(toast.push.error({ message: error.message }))
            setLoading(false)
        })

        setPageHead({ title: 'Profile' })

        // eslint-disable-next-line
    }, [])

    return (
        <div className="user-profile-div">
            <div className="profile-div">
                <div className="image-section-div">
                    <div className="image-div">
                        <img src={userProfileImage} alt="Profile" />
                        {/* <div className="camera-icon">
                            <TbCamera />
                        </div> */}
                    </div>
                </div>
                <div className="name-section">
                    <h2>{user?.first_name + ' ' + user?.last_name}</h2>
                    <p>{user?.designation?.designation}</p>
                </div>
                <div className="sub-menu-div">
                    <div className="item-div" onClick={() => navigate('/profile/edit')}>
                        <GrEdit />
                        <span>Profile</span>
                    </div>
                    <div className="item-div" onClick={() => navigate('/punch-report/?page=report')}>
                        <TbReport />
                        <span>Report</span>
                    </div>
                    <div className="item-div">
                        <LuBadgeHelp />
                        <span>Help me</span>
                    </div>
                </div>
            </div>
            <div className="list-details-div">
                <h4>About me</h4>
                {loading
                    ? <SpinWithMessage load={loading} fullView />
                    : <>
                        <div className="list-item-div">
                            <span><p>Gender</p></span>
                            <span><p>: {userData?.gender}</p></span>
                        </div>
                        <div className="list-item-div">
                            <span><p>Date of Birth</p></span>
                            <span><p>: {new Date(userData?.dob).toDateString()}</p></span>
                        </div>
                        <div className="list-item-div">
                            <span><p>Address</p></span>
                            <span><p>: {userData?.address?.address}</p></span>
                        </div>
                        <div className="list-item-div">
                            <span><p>Place</p></span>
                            <span><p>: {userData?.address?.place}</p></span>
                        </div>
                        <div className="list-item-div">
                            <span><p>Post office</p></span>
                            <span><p>: {userData?.address?.post} - {userData?.address?.pin_code}</p></span>
                        </div>
                        <div className="list-item-div">
                            <span><p>District</p></span>
                            <span><p>: {userData?.address?.district}</p></span>
                        </div>
                        <div className="list-item-div">
                            <span><p>State</p></span>
                            <span><p>: {userData?.address?.state || 'Kerala'}, India</p></span>
                        </div>
                        <div className="list-item-div">
                            <span><p>Mobile number</p></span>
                            <span><p>: {userData?.contact1}</p></span>
                        </div>
                        {userData?.contact2 && <div className="list-item-div">
                            <span><p></p></span>
                            <span><p>: {userData?.contact2}</p></span>
                        </div>}
                        <div className="list-item-div">
                            <span><p>Whatsapp</p></span>
                            <span><p>: {userData?.whatsapp}</p></span>
                        </div>
                        <div className="list-item-div">
                            <span><p>Email ID</p></span>
                            <span><p>: {userData?.email_id}</p></span>
                        </div>
                    </>}
            </div>

            <div className="list-details-div">
                <h4>About profession </h4>
                {loading
                    ? <SpinWithMessage load={loading} fullView />
                    : <>
                        <div className="list-item-div">
                            <span><p>Designation</p></span>
                            <span><p>: {user?.designation.designation}</p></span>
                        </div>
                        <div className="list-item-div">
                            <span><p>Salary</p></span>
                            <span><p>: {userData?.current_salary} / Month</p></span>
                        </div>
                        <div className="list-item-div">
                            <span><p>Working days</p></span>
                            <span><p>: {userData?.current_working_days} / Month</p></span>
                        </div>
                        <div className="list-item-div">
                            <span><p>Working time</p></span>
                            <span><p>: {getTimeFromSecond(userData?.current_working_time) || '0m'} / Day</p></span>
                        </div>
                        <div className="list-item-div">
                            <span><p>C/F</p></span>
                            <span><p>: {getTimeFromSecond(userData?.balance_CF) || '0m'}</p></span>
                        </div>
                    </>}
            </div>
        </div>
    )
}

export default Profile