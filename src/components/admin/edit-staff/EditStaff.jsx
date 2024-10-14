import React, { useEffect, useState } from 'react'
import './edit-staff.scss'
import { adminAxios, ttCv2Axios } from '../../../config/axios'
import SpinWithMessage from '../../common/spinners/SpinWithMessage'
import { secondsToHHMM } from '../../../assets/javascript/date-helper'
import { toast } from '../../../redux/features/user/systemSlice'
import NormalInput from '../../common/inputs/NormalInput'
import SelectInput from '../../common/inputs/SelectInput'
import SingleButton from '../../common/buttons/SingleButton'
import { useDispatch } from 'react-redux'
import { work_modes, e_types } from '../../../assets/javascript/const-data';

function EditStaff({ data, setModal, setData }) {
    const dispatch = useDispatch()
    const [form, setFrom] = useState({})
    const [designations, setDesignations] = useState([])
    const [loading, setLoading] = useState('')
    const [workMode, setWorkMode] = useState([])
    const [eType, setETypes] = useState([])
    const [genderList, setGenderList] = useState([])
    const months = ['Jun', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    const handleChange = (e) => {
        setFrom({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleDesignationChange = (e) => {
        let desi = designations.filter((obj) => obj.value === e.target.value)
        
        setFrom({
            ...form,
            designation_id: e.target.value,
            designation: desi[0]?.option || null
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setLoading('submit')
        if (form?.first_name?.[0] === ' ' || form?.last_name?.[0] === ' ' || form?.place?.[0] === ' ') {
            dispatch(toast.push.error({ message: 'Space is not accepted as the first character' }))
            setLoading('')
            return
        }

        ttCv2Axios.put(`/worker/account/${form?._id}/info`, form).then(() => {

            let timeSplit = form?.current_working_time?.split(':')
            timeSplit = (timeSplit[0] * 3600) + (timeSplit[1] * 60)

            setData((state) => ({
                ...state,
                sid: form.sid,
                first_name: form.first_name,
                last_name: form.last_name,
                gender: form.gender,
                designation: form.designation,
                designation_id: form.designation_id,
                dob: form.dob,
                address: {
                    address: form?.address,
                    place: form?.place,
                    post: form?.post,
                    pin_code: form?.pin_code,
                    district: form?.district,
                    state: form?.state
                },
                current_salary: form.current_salary,
                current_working_days: form.current_working_days,
                current_working_time: timeSplit,
                join_date: form.join_date,
                work_mode: form.work_mode,
                e_type: form.e_type
            }))
            setLoading('')
            setModal({ status: false })
        }).catch((error) => {
            dispatch(toast.push.error({ message: error.message }))
            setLoading('')
        })
    }

    useEffect(() => {
        setFrom({
            _id: data?._id,
            sid: data?.sid,
            first_name: data?.first_name,
            last_name: data?.last_name,
            gender: data?.gender,
            designation: data?.designation,
            designation_id: data?.designation_id,
            dob: data?.dob,
            address: data?.address?.address,
            place: data?.address?.place,
            post: data?.address?.post,
            pin_code: data?.address?.pin_code,
            district: data?.address?.district,
            state: data?.address?.state,
            current_salary: data?.current_salary,
            current_working_days: data?.current_working_days,
            current_working_time: secondsToHHMM(data?.current_working_time || 0),
            join_date: data?.join_date,
            work_mode: data?.work_mode,
            e_type: data?.e_type
        })

        setGenderList([
            { option: 'Select...', value: "" },
            { option: 'Male', value: "Male", selected: 'Male' === data?.gender },
            { option: 'Female', value: "Female", selected: 'Female' === data?.gender },
            { option: 'Other', value: "Other", selected: 'Other' === data?.gender }
        ])

        setWorkMode(work_modes.map((a) => ({ option: a, value: a, selected: a === data?.work_mode })) || [])
        setETypes(e_types.map((a) => ({ option: a, value: a, selected: a === data?.e_type })) || [])

        adminAxios.get('/designations').then((result) => {
            setDesignations(result.data?.map((item) => ({ option: item?.designation, value: item?._id, selected: item?._id === data?.designation_id })) || [])
        })

        // eslint-disable-next-line
    }, [data])

    return (
        <div className='add-staff-div'>
            <div className="boarder">
                {loading === 'getData' ? <>
                    <SpinWithMessage load height={'300px'} />
                </>
                    : <form onSubmit={handleSubmit}>
                        <h3>Personal details</h3>
                        <div className="sections">
                            <NormalInput label='First Name' name='first_name' id={'first_name'} value={form?.first_name} onChangeFun={handleChange} />
                            <NormalInput label='Last Name' name='last_name' id={'last_name'} value={form?.last_name} onChangeFun={handleChange} />
                            <SelectInput label='Gender' name='gender' id={'gender'} values={genderList} onChangeFun={handleChange} />
                            <NormalInput label='Date of Birth' name='dob' type='date' id={'dob'} value={form?.dob} onChangeFun={handleChange}
                                max={`${new Date().getFullYear() - 18}-12-31`} />
                            <NormalInput label='Address' name='address' id={'address'} value={form?.address} onChangeFun={handleChange}
                                isRequired={false} />
                            <NormalInput label='Place' name='place' id={'place'} value={form?.place} onChangeFun={handleChange} isRequired={false} />
                            <NormalInput label='Post office' name='post' id={'post'} value={form?.post} onChangeFun={handleChange} isRequired={false} />
                            <NormalInput label='Pin code' name='pin_code' type='number' id={'pin_code'} value={form?.pin_code} onChangeFun={handleChange} isRequired={false} />
                            <NormalInput label='District' name='district' id={'district'} value={form?.district} onChangeFun={handleChange} isRequired={false} />
                            <NormalInput label='State' name='state' id={'state'} value={form?.state} onChangeFun={handleChange} isRequired={false} />
                        </div>
                        <h3>Profession details</h3>
                        <div className="sections">
                            <NormalInput label='Staff ID' name='sid' id={'sid'} value={form?.sid} onChangeFun={handleChange} />
                            <SelectInput label='Designation' name='designation_id' id={'designation_id'} values={designations} onChangeFun={handleDesignationChange}
                                firstOption={{ option: 'Select...', value: '' }} />
                            <NormalInput label='Current Salary' name='current_salary' type='number' id={'current_salary'} value={form?.current_salary}
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
                            <SingleButton type={'submit'} classNames={'lg btn-tertiary'} name={'Update Staff'} loading={loading === 'submit'} />
                        </div>
                        <p className='smallTD1' style={{ marginTop: '15px' }}>
                            Mobile numbers and email addresses can only be updated by users themselves, as any changes require OTP verification for security purposes.
                            Administrators are not authorized to modify these details.
                        </p>
                    </form>}
            </div>
        </div>
    )
}

export default EditStaff