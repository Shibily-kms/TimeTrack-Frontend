import React, { useEffect, useState } from 'react'
import './add-staff.scss'
import { adminAxios } from '../../../config/axios'
import { setAdminActivePage, toast } from '../../../redux/features/user/systemSlice'
import NormalInput from '../../../components/common/inputs/NormalInput';
import SelectInput from '../../../components/common/inputs/SelectInput'
import SingleButton from '../../../components/common/buttons/SingleButton';
import AlertBox from '../../../components/common/alert/AlertBox';
import { useDispatch } from 'react-redux';

const AddStaff = ({ setPageHead }) => {
    const dispatch = useDispatch()
    const [form, setFrom] = useState({})
    const [designations, setDesignations] = useState([])
    const [loading, setLoading] = useState('')

    const genderList = [
        { option: 'Select...', value: "" },
        { option: 'Male', value: "Male" },
        { option: 'Female', value: "Female" },
        { option: 'Other', value: "Other" },
    ]

    const handleChange = (e) => {
        setFrom({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setLoading('submit')
        if (form.first_name[0] === ' ' || form.last_name[0] === ' ' || form.sid[0] === ' ') {
            dispatch(toast.push.error({ message: 'Space is not accepted as the first character' }))
            setLoading('')
            return
        }
        adminAxios.post('/staff', form).then(() => {
            dispatch(toast.push.success({ message: 'Success, new customer created' }))
            setLoading('')
            setFrom({})
        }).catch((error) => {
            dispatch(toast.push.error({ message: error.message }))
            setLoading('')
        })
    }

    useEffect(() => {
        adminAxios.get('/designations').then((response) => {
            setDesignations(response?.data?.map((single) => ({ option: single.designation, value: single._id })) || [])
        })

        setPageHead({ title: 'Add New Staff' })
        dispatch(setAdminActivePage('add-staff'))
        // eslint-disable-next-line
    }, [])

    return (
        <div className='add-staff-page'>
            <AlertBox messages={[
                <><span>• More staff details add using <b>Edit option</b> in staff list.</span><br></br></>,
                <span>• Use <b>Date of birth</b> for password when logging into staff account. Formate: YYYY-MM-DD (1999-05-13)</span>
            ]} />
            <div className="boarder">
                <form action="" onSubmit={handleSubmit}>
                    <div className="sections">
                        <NormalInput name='first_name' id={'first_name'} value={form?.first_name} onChangeFun={handleChange} label='First Name' />
                        <NormalInput name='last_name' id={'last_name'} value={form?.last_name} onChangeFun={handleChange} label='Last Name' />
                        <NormalInput name='sid' id={'sid'} value={form?.sid} onChangeFun={handleChange} label='Staff ID (SRL NO)' />
                        <SelectInput name='gender' id={'gender'} values={genderList} onChangeFun={handleChange} label='Gender' />
                        <NormalInput name='email_id' id={'email_id'} type='email' value={form?.email_id} onChangeFun={handleChange} label='Email Address' />
                        <NormalInput name='contact1' id={'contact1'} type='number' value={form?.contact1} onChangeFun={handleChange} label='Mobile number' />
                        <SelectInput name='designation' id={'designation'} values={designations} onChangeFun={handleChange} label='Designation'
                            firstOption={{ option: 'Select...', value: '' }} />
                        <NormalInput name='dob' id={'dob'} type='date' value={form?.dob} onChangeFun={handleChange} label='Date of Birth' max={`${new Date().getFullYear() - 18}-12-31`} />

                    </div>
                    <div className="actions">
                        <SingleButton name={'Create New'} classNames={'lg btn-tertiary'} type={'submit'} loading={loading === 'submit'} />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddStaff