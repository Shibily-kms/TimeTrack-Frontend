import React, { useEffect, useState } from 'react'
import './edit-staff.scss'
import { adminAxios } from '../../../config/axios'
import SpinWithMessage from '../../common/spinners/SpinWithMessage'
import { secondsToHHMM } from '../../../assets/javascript/date-helper'
import { toast } from '../../../redux/features/user/systemSlice'
import NormalInput from '../../common/inputs/NormalInput'
import SelectInput from '../../common/inputs/SelectInput'
import SingleButton from '../../common/buttons/SingleButton'
import { useDispatch } from 'react-redux'

function EditStaff({ setModal, setData, editId }) {
    const dispatch = useDispatch()
    const [form, setFrom] = useState({})
    const [designations, setDesignations] = useState([])
    const [loading, setLoading] = useState('getData')
    const [genderList, setGenderList] = useState([])
    const months = ['Jun', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    const handleChange = (e) => {
        setFrom({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleDesignationChange = (e) => {
        let desi = designations.filter((obj) => obj._id === e.target.value)
        setFrom({
            ...form,
            designation: e.target.value,
            designationName: desi[0]?.designation || null
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

        adminAxios.put('/staff', form).then(() => {
            dispatch(toast.push.success({ message: 'Updated!' }))
            setData((state) => state.map((value) => {
                if (value._id === form._id) {
                    let timeSplit = form?.current_working_time?.split(':')
                    timeSplit = (timeSplit[0] * 3600) + (timeSplit[1] * 60)
                    return {
                        _id: form._id,
                        sid: form.sid,
                        first_name: form.first_name,
                        last_name: form.last_name,
                        designation: { _id: form.designation, designation: form.designationName },
                        contact1: form.contact1,
                        current_salary: form?.current_salary,
                        current_working_days: form?.current_working_days,
                        current_working_time: timeSplit
                    }
                }
                return value
            }))
            setLoading('')
            setModal('')
        }).catch((error) => {
            dispatch(toast.push.error({ message: error.message }))
            setLoading('')
        })
    }

    useEffect(() => {
        setLoading('getData')
        adminAxios.get(`/staff/${editId}`).then((response) => {
            const data = response.data
            setFrom({
                _id: data?._id,
                sid: data?.sid,
                first_name: data?.first_name,
                last_name: data?.last_name,
                gender: data?.gender,
                email_id: data?.email_id,
                contact1: data?.contact1,
                contact2: data?.contact2,
                whatsapp: data?.whatsapp,
                designation: data?.designation?._id,
                designationName: data?.designation?.designation,
                dob: data?.dob,
                address: data?.address?.address,
                place: data?.address?.place,
                post: data?.address?.post,
                pin_code: data?.address?.pin_code,
                district: data?.address?.district,
                state: data?.address?.state,
                current_salary: data?.current_salary,
                current_working_days: data?.current_working_days,
                current_working_time: secondsToHHMM(data?.current_working_time || 0)
            })

            setGenderList([
                { option: 'Select...', value: "" },
                { option: 'Male', value: "Male", selected: 'Male' === data?.gender },
                { option: 'Female', value: "Female", selected: 'Female' === data?.gender },
                { option: 'Other', value: "Other", selected: 'Other' === data?.gender }
            ])
            setLoading('')
            adminAxios.get('/designations').then((result) => {
                setDesignations(result.data?.map((item) => ({ option: item?.designation, value: item?._id, selected: item?._id === data?.designation?._id })) || [])
            })
        }).catch((error) => {
            dispatch(toast.push.error({ message: error.message }))
        })
        // eslint-disable-next-line
    }, [])

    return (
        <div className='add-staff-div'>
            <div className="boarder">
                {loading === 'getData' ? <>
                    <SpinWithMessage load height={'300px'} />
                </>
                    : <form onSubmit={handleSubmit}>
                        <div className="sections">
                            <NormalInput label='Staff ID' name='sid' id={'sid'} value={form?.sid} onChangeFun={handleChange} />
                            <SelectInput label='Gender' name='gender' id={'gender'} values={genderList} onChangeFun={handleChange} />
                            <NormalInput label='First Name' name='first_name' id={'first_name'} value={form?.first_name} onChangeFun={handleChange} />
                            <NormalInput label='Last Name' name='last_name' id={'last_name'} value={form?.last_name} onChangeFun={handleChange} />
                            <NormalInput label='Email Address' name='email_id' type='email' id={'email_id'} value={form?.email_id} onChangeFun={handleChange} />
                            <NormalInput label='Date of Birth' name='dob' type='date' id={'dob'} value={form?.dob} onChangeFun={handleChange}
                                max={`${new Date().getFullYear() - 18}-12-31`} />
                            <NormalInput label='Mobile number (2)' name='contact2' type='number' id={'contact2'} value={form?.contact2} onChangeFun={handleChange}
                                isRequired={false} />
                            <NormalInput label='Whatsapp' name='whatsapp' type='number' id={'whatsapp'} value={form?.whatsapp} onChangeFun={handleChange}
                                isRequired={false} />
                            <SelectInput label='Designation' name='designation' id={'designation'} values={designations} onChangeFun={handleDesignationChange}
                                firstOption={{ option: 'Select...', value: '' }} />
                            <NormalInput label='Address' name='address' id={'address'} value={form?.address} onChangeFun={handleChange}
                                isRequired={false} />
                            <NormalInput label='Place' name='place' id={'place'} value={form?.place} onChangeFun={handleChange} isRequired={false} />
                            <NormalInput label='Post office' name='post' id={'post'} value={form?.post} onChangeFun={handleChange} isRequired={false} />
                            <NormalInput label='Pin code' name='pin_code' type='number' id={'pin_code'} value={form?.pin_code} onChangeFun={handleChange} isRequired={false} />
                            <NormalInput label='District' name='district' id={'district'} value={form?.district} onChangeFun={handleChange} isRequired={false} />
                            <NormalInput label='State' name='state' id={'state'} value={form?.state} onChangeFun={handleChange} isRequired={false} />
                            <NormalInput label='Current Salary' name='current_salary' type='number' id={'current_salary'} value={form?.current_salary}
                                min={'0'} onChangeFun={handleChange} />
                            <NormalInput label={`Working Days (${months[new Date().getMonth()]})`} name='current_working_days' type='number' id={'current_working_days'} value={form?.current_working_days}
                                max={'31'} min={'0'} onChangeFun={handleChange} />
                            <NormalInput label='Hours in a Day (HH:MM)' name='current_working_time' id={'current_working_time'} value={form?.current_working_time}
                                pattern="([01][0-9]|2[0-3]):[0-5][0-9]" onChangeFun={handleChange} />

                        </div>
                        <div className="actions">
                            <SingleButton type={'submit'} name={'Update Staff'} loading={loading === 'submit'} />
                        </div>
                    </form>}
            </div>
        </div>
    )
}

export default EditStaff