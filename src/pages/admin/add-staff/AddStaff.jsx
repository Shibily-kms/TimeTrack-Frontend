import React, { useEffect, useState } from 'react'
import './add-staff.scss'
import { adminAxios, ttCv2Axios } from '../../../config/axios'
import { setAdminActivePage, toast } from '../../../redux/features/user/systemSlice'
import NormalInput from '../../../components/common/inputs/NormalInput';
import SelectInput from '../../../components/common/inputs/SelectInput'
import SingleButton from '../../../components/common/buttons/SingleButton';
import AlertBox from '../../../components/common/alert/AlertBox';
import MobileInput from '../../../components/common/inputs/MobileInput';
import { createStaffFormValidation } from '../../../assets/javascript/validation-functions';
import { useDispatch } from 'react-redux';
import { PiDotFill } from "react-icons/pi";
import { work_modes, e_types } from '../../../assets/javascript/const-data';
import { useNavigate } from 'react-router-dom';


const AddStaff = ({ setPageHead }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [form, setForm] = useState({})
    const [designations, setDesignations] = useState([])
    const [workMode, setWorkMode] = useState([])
    const [eType, setETypes] = useState([])
    const [loading, setLoading] = useState('')
    const months = ['Jun', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    const genderList = [
        { option: 'Select...', value: "" },
        { option: 'Male', value: "Male" },
        { option: 'Female', value: "Female" },
        { option: 'Other', value: "Other" },
    ]

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleMobileNumber = (mobData) => {
        setForm({
            ...form,
            [mobData.name]: mobData?.number
                ? {
                    country_code: mobData?.country_code || null,
                    number: mobData?.number || null
                }
                : undefined
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setLoading('submit')

        const validation = createStaffFormValidation(form)
        if (validation) {
            dispatch(toast.push[validation[0]]({ message: validation[1] }))
            setLoading('')
            return
        }

        ttCv2Axios.post('/worker/new-account', form).then(() => {
            dispatch(toast.push.success({ message: 'New account created' }))
            navigate('/admin/staff-list')
        }).catch((error) => {
            dispatch(toast.push.error({ message: error.message }))
            setLoading('')
        })
    }

    useEffect(() => {
        adminAxios.get('/designations').then((response) => {
            setDesignations(response?.data?.map((single) => ({ option: single.designation, value: single._id })) || [])
        })
        setWorkMode(work_modes.map((a) => ({ option: a, value: a })) || [])
        setETypes(e_types.map((a) => ({ option: a, value: a })) || [])

        setPageHead({ title: 'Create staff account' })
        dispatch(setAdminActivePage('staff-list'))
        // eslint-disable-next-line
    }, [])


    return (
        <div className='add-staff-page'>
            <AlertBox messages={[
                <><span><PiDotFill /> <b>Primary Phone Number:</b> Ensure a valid primary phone number is entered, as this number will be used to send OTPs for account verification.</span><br></br></>,
                <><span><PiDotFill /> <b>Official Phone Number:</b> This number will be used to display on customer side and send official information via SMS or Whatsapp.</span><br></br></>,
                <><span><PiDotFill /> <b>Password :</b> For the initial login, staff members can either use their date of birth in the format YYYYMMDD (e.g., 19990513) or set up a new password using the "Forgot Password" option.</span><br></br></>,
            ]} />
            <div className="boarder">
                <form action="" onSubmit={handleSubmit}>
                    <div className="section-title-div">
                        <h3>About Staff</h3>
                    </div>
                    <div className="sections">
                        <NormalInput name='first_name' id={'first_name'} value={form?.first_name} onChangeFun={handleChange} label='First Name' />
                        <NormalInput name='last_name' id={'last_name'} value={form?.last_name} onChangeFun={handleChange} label='Last Name' />
                        <SelectInput name='gender' id={'gender'} values={genderList} onChangeFun={handleChange} label='Gender' />
                        <NormalInput name='dob' id={'dob'} type='date' value={form?.dob} onChangeFun={handleChange} label='Date of Birth' max={`${new Date().getFullYear() - 18}-12-31`} />

                        <NormalInput name='address' id={'address'} value={form?.address} onChangeFun={handleChange} label='Address' isRequired={false} />
                        <NormalInput name='place' id={'place'} value={form?.place} onChangeFun={handleChange} label='Place' isRequired={false} />
                        <NormalInput name='post' id={'post'} value={form?.post} onChangeFun={handleChange} label='Post office' isRequired={false} />
                        <NormalInput name='pin_code' id={'pin_code'} type='number' value={form?.pin_code} onChangeFun={handleChange}
                            label='Pin / Zip Code' isRequired={false} />
                        <NormalInput name='district' id={'district'} value={form?.district} onChangeFun={handleChange} label='District' isRequired={false} />
                        <NormalInput name='state' id={'state'} value={form?.state} onChangeFun={handleChange} label='State' isRequired={false} />

                        <MobileInput onChangeFun={handleMobileNumber} name='primary_number' value={`${form?.primary_number?.country_code}${form?.primary_number?.number}`}
                            label='Primary number' onlyCountries={['in']} />
                        <MobileInput onChangeFun={handleMobileNumber} name='secondary_number' value={`${form?.secondary_number?.country_code}${form?.secondary_number?.number}`}
                            label='Secondary number' onlyCountries={['in']} isRequired={false} />
                        <MobileInput onChangeFun={handleMobileNumber} name='whatsapp' value={`${form?.whatsapp?.country_code}${form?.whatsapp?.number}`}
                            label='Whatsapp number' onlyCountries={['in']} isRequired={false} />
                        <NormalInput name='email_id' id={'email_id'} type='email' value={form?.email_id} onChangeFun={handleChange} label='Email Address'
                            isRequired={false} />
                    </div>

                    <div className="section-title-div">
                        <h3>About Profession</h3>
                    </div>
                    <div className="sections">
                        <SelectInput name='designation' id={'designation'} values={designations} onChangeFun={handleChange} label='Designation'
                            firstOption={{ option: 'Select...', value: '' }} />
                        <NormalInput name='sid' id={'sid'} value={form?.sid} onChangeFun={handleChange} label='Staff ID (SRL NO)' />
                        <MobileInput onChangeFun={handleMobileNumber} name='official_number' value={`${form?.official_number?.country_code}${form?.official_number?.number}`}
                            label='Official number' onlyCountries={['in']} isRequired={false} />
                        <NormalInput label='Monthly Salary' name='current_salary' type='number' id={'current_salary'} value={form?.current_salary}
                            min={'0'} onChangeFun={handleChange} />
                        <NormalInput label={`Working Days (${months[new Date().getMonth()]})`} name='current_working_days' type='number' id={'current_working_days'} value={form?.current_working_days}
                            max={'31'} min={'0'} onChangeFun={handleChange} />
                        <NormalInput label='Hours in a Day (HH:MM)' name='current_working_time' id={'current_working_time'} value={form?.current_working_time}
                            pattern="([01][0-9]|2[0-3]):[0-5][0-9]" onChangeFun={handleChange} />
                        <NormalInput name='join_date' id={'join_date'} type='date' value={form?.join_date} onChangeFun={handleChange} label='Join Date' />
                        <SelectInput name='work_mode' id={'work_mode'} values={workMode} onChangeFun={handleChange} label='Work mode'
                            firstOption={{ option: 'Select...', value: '' }} />
                        <SelectInput name='e_type' id={'e_type'} values={eType} onChangeFun={handleChange} label='Employment type'
                            firstOption={{ option: 'Select...', value: '' }} />
                    </div>

                    <div className="actions">
                        <SingleButton name={'Create Account'} classNames={'xl btn-tertiary'} type={'submit'} loading={loading === 'submit'} />
                    </div>

                    <p className='smallTD1'>
                        The Staff Creation Form, managed by HR, collects essential information, including personal details, work-related data,
                        and account authentication credentials like the primary phone number and password. This form ensures that all necessary
                        staff information is securely gathered and organized, streamlining the onboarding process and supporting efficient HR
                        operations. It is a crucial tool for maintaining accurate employee records and ensuring secure access to staff accounts.
                    </p>
                </form>
            </div>
        </div>
    )
}

export default AddStaff