import React, { useEffect, useState } from 'react'
import './profile-complete.scss'
import Cookies from 'js-cookie';
import ProfileStatusSemi from '../../../components/user/profile-status/ProfileStatusSemi'
import SpinWithMessage from '../../../components/common/spinners/SpinWithMessage'
import { ttSv2Axios } from '../../../config/axios'
import { useSelector } from 'react-redux'
import { FaCheck, FaExclamation } from "react-icons/fa6";
import SingleButton from '../../../components/common/buttons/SingleButton'
import { useNavigate } from 'react-router-dom'

const ProfileComplete = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState('fetch')
    const [data, setData] = useState({})
    const { user } = useSelector((state) => state.userAuth)
    const dvcId = Cookies.get('DVC_ID');

    useEffect(() => {
        ttSv2Axios.get(`/worker/account/${user?.acc_id}/profile-status`).then((response) => {
            setData(response.data || {})
            setLoading('')

        }).catch((error) => {
            setLoading('')
        })
    }, [])

    return (
        <div className="profile-complete-page-div">
            {(loading === 'fetch' || !data?.percentage)
                ? <SpinWithMessage load={loading === 'fetch'} message='Data not available' height={'400px'} />
                : <>
                    <div className="top-div">
                        <ProfileStatusSemi hideButton={true} />
                    </div>
                    <div className="item-list-div">
                        {/* First name */}
                        <div className="item-div">
                            <div className="icon-div">
                                {data?.report?.first_name === 'Ok'
                                    ? <div className="icon-box success"><FaCheck /></div>
                                    : <div className="icon-box"><FaExclamation /></div>}
                            </div>
                            <div className="head-div">
                                <h3>First name</h3>
                                <p>{data?.report?.first_name !== "Ok" && "You cannot set the name, Contact the admin"}</p>
                            </div>
                        </div>

                        {/* Last name */}
                        <div className="item-div">
                            <div className="icon-div">
                                {data?.report?.last_name === 'Ok'
                                    ? <div className="icon-box success"><FaCheck /></div>
                                    : <div className="icon-box"><FaExclamation /></div>}
                            </div>
                            <div className="head-div">
                                <h3>Last name</h3>
                                <p>{data?.report?.last_name !== "Ok" && "You cannot set the name, Contact the admin"}</p>
                            </div>
                        </div>

                        {/* dob */}
                        <div className="item-div">
                            <div className="icon-div">
                                {data?.report?.dob === 'Ok'
                                    ? <div className="icon-box success"><FaCheck /></div>
                                    : <div className="icon-box"><FaExclamation /></div>}
                            </div>
                            <div className="head-div">
                                <h3>Date of Birth</h3>
                                <p>{data?.report?.dob !== "Ok" && "You cannot set the dob, Contact the admin"}</p>
                            </div>
                        </div>

                        {/* Gender */}
                        <div className="item-div">
                            <div className="icon-div">
                                {data?.report?.gender === 'Ok'
                                    ? <div className="icon-box success"><FaCheck /></div>
                                    : <div className="icon-box"><FaExclamation /></div>}
                            </div>
                            <div className="head-div">
                                <h3>Gender</h3>
                                <p>{data?.report?.gender !== "Ok" && "To complete, navigate to Profile > Edit."}</p>
                            </div>
                            {data?.report?.gender !== "Ok" &&
                                <div className="action-div">
                                    <SingleButton classNames={'sm btn-secondary'} name={'Setup'} onClick={() => navigate('/my-account/profile?page=more#basic_info')} />
                                </div>}
                        </div>

                        {/* Blood Group */}
                        <div className="item-div">
                            <div className="icon-div">
                                {data?.report?.blood_group === 'Ok'
                                    ? <div className="icon-box success"><FaCheck /></div>
                                    : <div className="icon-box"><FaExclamation /></div>}
                            </div>
                            <div className="head-div">
                                <h3>Blood Group</h3>
                                <p>{data?.report?.blood_group !== "Ok" && "To complete, navigate to Profile > Edit."}</p>
                            </div>
                            {data?.report?.blood_group !== "Ok" &&
                                <div className="action-div">
                                    <SingleButton classNames={'sm btn-secondary'} name={'Setup'} onClick={() => navigate('/my-account/profile?page=more#basic_info')} />
                                </div>}
                        </div>

                        {/* Address */}
                        <div className="item-div">
                            <div className="icon-div">
                                {(data?.report?.address === "Ok" && data?.report?.place === "Ok" && data?.report?.pin_code === "Ok"
                                    && data?.report?.district === "Ok" && data?.report?.state === "Ok"
                                )
                                    ? <div className="icon-box success"><FaCheck /></div>
                                    : <div className="icon-box"><FaExclamation /></div>}
                            </div>
                            <div className="head-div">
                                <h3>Address</h3>
                                <p>{(data?.report?.address !== "Ok" || data?.report?.place !== "Ok" || data?.report?.pin_code !== "Ok"
                                    || data?.report?.district !== "Ok" || data?.report?.state !== "Ok"
                                ) && "To complete, navigate to Profile > Your Address > Edit."}</p>
                            </div>
                            {(data?.report?.address !== "Ok" || data?.report?.place !== "Ok" || data?.report?.pin_code !== "Ok"
                                || data?.report?.district !== "Ok" || data?.report?.state !== "Ok"
                            ) &&
                                <div className="action-div">
                                    <SingleButton classNames={'sm btn-secondary'} name={'Setup'} onClick={() => navigate('/my-account/profile?page=more#your_address')} />
                                </div>}
                        </div>

                        {/* Primary number */}
                        <div className="item-div">
                            <div className="icon-div">
                                {(data?.report?.primary_number === "Ok" && data?.report?.pn_verification === "Ok")
                                    ? <div className="icon-box success"><FaCheck /></div>
                                    : <div className="icon-box"><FaExclamation /></div>}
                            </div>
                            <div className="head-div">
                                <h3>Primary number {(data?.report?.primary_number === "Ok" && data?.report?.pn_verification !== 'Ok') && 'Verification'}</h3>
                                <p>{(data?.report?.primary_number !== "Ok" || data?.report?.pn_verification !== "Ok")
                                    && "To complete, navigate to Profile > Contact info > Primary number."}</p>
                            </div>
                            {(data?.report?.primary_number !== "Ok" || data?.report?.pn_verification !== "Ok") &&
                                <div className="action-div">
                                    <SingleButton classNames={'sm btn-secondary'} name={'Setup'} onClick={() => navigate('/my-account/profile?page=more#contact_info')} />
                                </div>}
                        </div>

                        {/* Official number */}
                        <div className="item-div">
                            <div className="icon-div">
                                {(data?.report?.official_number === "Ok" && data?.report?.on_verification === "Ok")
                                    ? <div className="icon-box success"><FaCheck /></div>
                                    : <div className="icon-box"><FaExclamation /></div>}
                            </div>
                            <div className="head-div">
                                <h3>Official number {(data?.report?.official_number === "Ok" && data?.report?.on_verification !== 'Ok') && 'Verification'}</h3>
                                <p>{(data?.report?.official_number !== "Ok" || data?.report?.on_verification !== "Ok")
                                    && "To complete, navigate to Profile > Contact info > Official number."}</p>
                            </div>
                            {(data?.report?.official_number !== "Ok" || data?.report?.on_verification !== "Ok") &&
                                <div className="action-div">
                                    <SingleButton classNames={'sm btn-secondary'} name={'Setup'} onClick={() => navigate('/my-account/profile?page=more#contact_info')} />
                                </div>}
                        </div>

                        {/* Whatsapp number */}
                        <div className="item-div">
                            <div className="icon-div">
                                {(data?.report?.whatsapp_number === "Ok" && data?.report?.wn_verification === "Ok")
                                    ? <div className="icon-box success"><FaCheck /></div>
                                    : <div className="icon-box"><FaExclamation /></div>}
                            </div>
                            <div className="head-div">
                                <h3>Whatsapp number {(data?.report?.whatsapp_number === "Ok" && data?.report?.wn_verification !== 'Ok') && 'Verification'}</h3>
                                <p>{(data?.report?.whatsapp_number !== "Ok" || data?.report?.wn_verification !== "Ok")
                                    && "To complete, navigate to Profile > Contact info > Whatsapp number."}</p>
                            </div>
                            {(data?.report?.whatsapp_number !== "Ok" || data?.report?.wn_verification !== "Ok") &&
                                <div className="action-div">
                                    <SingleButton classNames={'sm btn-secondary'} name={'Setup'} onClick={() => navigate('/my-account/profile?page=more#contact_info')} />
                                </div>}
                        </div>

                        {/* Email */}
                        <div className="item-div">
                            <div className="icon-div">
                                {data?.report?.email_address === 'Ok'
                                    ? <div className="icon-box success"><FaCheck /></div>
                                    : <div className="icon-box"><FaExclamation /></div>}
                            </div>
                            <div className="head-div">
                                <h3>Email Address</h3>
                                <p>{data?.report?.email_address !== "Ok" && "To complete, navigate to Profile > Contact info > Email Address."}</p>
                            </div>
                            {data?.report?.email_address !== "Ok" &&
                                <div className="action-div">
                                    <SingleButton classNames={'sm btn-secondary'} name={'Setup'} onClick={() => navigate('/my-account/profile?page=more#contact_info')} />
                                </div>}
                        </div>

                        {/* Designation */}
                        <div className="item-div">
                            <div className="icon-div">
                                {data?.report?.designation === 'Ok'
                                    ? <div className="icon-box success"><FaCheck /></div>
                                    : <div className="icon-box"><FaExclamation /></div>}
                            </div>
                            <div className="head-div">
                                <h3>Designation</h3>
                                <p>{data?.report?.designation !== "Ok" && "You cannot set the data, Contact the admin"}</p>
                            </div>
                        </div>

                        {/* Staff Unique ID */}
                        <div className="item-div">
                            <div className="icon-div">
                                {data?.report?.sid === 'Ok'
                                    ? <div className="icon-box success"><FaCheck /></div>
                                    : <div className="icon-box"><FaExclamation /></div>}
                            </div>
                            <div className="head-div">
                                <h3>Staff Unique ID</h3>
                                <p>{data?.report?.sid !== "Ok" && "You cannot set the data, Contact the admin"}</p>
                            </div>
                        </div>

                        {/* Salary, Work days & time */}
                        <div className="item-div">
                            <div className="icon-div">
                                {(data?.report?.salary === "Ok" && data?.report?.working_days === "Ok" && data?.report?.working_time === "Ok")
                                    ? <div className="icon-box success"><FaCheck /></div>
                                    : <div className="icon-box"><FaExclamation /></div>}
                            </div>
                            <div className="head-div">
                                <h3>Salary, Work days & time </h3>
                                <p>{(data?.report?.salary !== "Ok" || data?.report?.working_days !== "Ok" || data?.report?.working_time !== "Ok")
                                    && "You cannot set the data, Contact the admin."}</p>
                            </div>
                        </div>

                        {/* Join date, Work mode & employee type */}
                        <div className="item-div">
                            <div className="icon-div">
                                {(data?.report?.join_date === "Ok" && data?.report?.work_mode === "Ok" && data?.report?.e_type === "Ok")
                                    ? <div className="icon-box success"><FaCheck /></div>
                                    : <div className="icon-box"><FaExclamation /></div>}
                            </div>
                            <div className="head-div">
                                <h3>Join date, Work mode & employee type </h3>
                                <p>{(data?.report?.join_date !== "Ok" || data?.report?.work_mode !== "Ok" || data?.report?.e_type !== "Ok")
                                    && "You cannot set the data, Contact the admin."}</p>
                            </div>
                        </div>

                        {/* Password */}
                        <div className="item-div">
                            <div className="icon-div">
                                {data?.report?.password_update === 'Ok'
                                    ? <div className="icon-box success"><FaCheck /></div>
                                    : <div className="icon-box"><FaExclamation /></div>}
                            </div>
                            <div className="head-div">
                                <h3>Password security</h3>
                                <p>{data?.report?.password_update !== "Ok" && "To completed, navigate to  More > Settings > Change Password."}</p>
                            </div>
                            {data?.report?.password_update !== "Ok" &&
                                <div className="action-div">
                                    <SingleButton classNames={'sm btn-secondary'} name={'Setup'} onClick={() => navigate('/my-account/security-privacy?page=more')} />
                                </div>}
                        </div>

                        {/* Sessions */}
                        <div className="item-div">
                            <div className="icon-div">
                                {data?.report?.number_of_sessions === 'Ok'
                                    ? <div className="icon-box success"><FaCheck /></div>
                                    : <div className="icon-box"><FaExclamation /></div>}
                            </div>
                            <div className="head-div">
                                <h3>Sign In Sessions</h3>
                                <p>{data?.report?.number_of_sessions !== "Ok" && data?.report?.number_of_sessions}</p>
                            </div>
                            {data?.report?.number_of_sessions !== "Ok" &&
                                <div className="action-div">
                                    <SingleButton classNames={'sm btn-secondary'} name={'Terminate'}
                                        onClick={() => navigate(`/my-account/your-device?dvcId=${dvcId}&session_terminate=profile_status`)} />
                                </div>}
                        </div>


                    </div>
                </>}
        </div>
    )
}

export default ProfileComplete