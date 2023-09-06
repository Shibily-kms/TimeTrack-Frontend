import React, { useEffect, useState } from 'react'
import './edit-staff.scss'
import { adminAxios } from '../../../config/axios'
import SpinWithMessage from '../../common/spinners/SpinWithMessage'
import { secondsToHHMM } from '../../../assets/javascript/date-helper'
import { toast } from 'react-hot-toast'
import { BiLoaderAlt } from 'react-icons/bi'

function EditStaff({ setModal, setData, editId }) {
    const [form, setFrom] = useState({})
    const [designations, setDesignations] = useState([])
    const [loading, setLoading] = useState('getData')
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
        if (form.first_name[0] === ' ' || form.last_name[0] === ' ' || form.place[0] === ' ') {
            toast.error('Space is not accepted as the first character')
            setLoading('')
            return
        }
        adminAxios.put('/staff', form).then(() => {
            toast.success('Updated!')
            setData((state) => state.map((value) => {
                if (value._id === form._id) {
                    return {
                        _id: form._id,
                        first_name: form.first_name,
                        last_name: form.last_name,
                        designation: { _id: form.designation, designation: form.designationName },
                        contact: form.contact
                    }
                }
                return value
            }))
            setLoading('')
            setModal('')
        }).catch((error) => {
            toast.error(error.response.data.message)
            setLoading('')
        })
    }



    useEffect(() => {
        setLoading('getData')
        adminAxios.get(`/staff/${editId}`).then((response) => {
            const data = response.data.data
            setFrom({
                _id: data?._id,
                first_name: data?.first_name,
                last_name: data?.last_name,
                email_id: data?.email_id,
                contact: data?.contact,
                designation: data?.designation?._id,
                designationName: data?.designation?.designation,
                dob: data?.dob,
                place: data?.address?.place,
                pin_code: data?.address?.pin_code,
                current_salary: data?.current_salary,
                current_working_days: data?.current_working_days,
                current_working_time: secondsToHHMM(data?.current_working_time || 0)
            })
            setLoading('')
        })
        adminAxios.get('/designations').then((response) => {
            setDesignations(response.data?.data || [])
        })
        // eslint-disable-next-line
    }, [])

    return (
        <div className='add-staff-div'>
            <div className="boarder">
                {loading === 'getData' ? <>
                    <div style={{ display: 'grid', placeContent: 'center', width: '100%' }}>
                        <SpinWithMessage message='fetch data...' />
                    </div>
                </>
                    :
                    <form onSubmit={handleSubmit}>
                        <div className="sections">
                            <div className="text-input-div">
                                <input type="text" id='first_name' name='first_name' value={form?.first_name} required onChange={handleChange} />
                                <label htmlFor="first_name">First name</label>
                            </div>
                            <div className="text-input-div">
                                <input type="text" id='last_name' name='last_name' value={form?.last_name} required onChange={handleChange} />
                                <label htmlFor="last_name">Last name</label>
                            </div>
                            <div className="text-input-div">
                                <input type="email" id='email_id' name='email_id' value={form?.email_id} required onChange={handleChange} />
                                <label htmlFor="email_id">Email Address</label>
                            </div>
                            <div className="text-input-div">
                                <input type="number" id='contact' name='contact' value={form?.contact} required onChange={handleChange} />
                                <label htmlFor="contact">Mobile no</label>
                            </div>
                            <div className="text-input-div">
                                <select id="designation" name="designation" required onChange={handleDesignationChange}>
                                    <option value={''}>{designations?.[0] ? "Choose" : 'Loading...'}</option>
                                    {designations.map((option, index) => {
                                        return <option selected={option._id === form?.designation} key={index} value={option._id} >{option?.designation}</option>
                                    })}

                                </select>
                                <label htmlFor="designation">Designation</label>
                            </div>
                            <div className="text-input-div">
                                <input type="date" id='dob' name='dob' max={`${new Date().getFullYear() - 18}-12-31`} value={form?.dob} required onChange={handleChange} />
                                <label htmlFor="dob">Date of Birth</label>
                            </div>
                            <div className="text-input-div">
                                <input type="text" id='place' name='place' value={form?.place} required onChange={handleChange} />
                                <label htmlFor="place">Place</label>
                            </div>
                            <div className="text-input-div">
                                <input type="number" id='pin_code' name='pin_code' value={form?.pin_code} required onChange={handleChange} />
                                <label htmlFor="pin_code">Pin code</label>
                            </div>
                            <div className="text-input-div">
                                <input type="number" id='current_salary' name='current_salary' min={'0'} value={form?.current_salary} required onChange={handleChange} />
                                <label htmlFor="current_salary">Current Salary</label>
                            </div>
                            <div className="text-input-div">
                                <input type="number" id='current_working_days' max={'31'} min={'0'} name='current_working_days' value={form?.current_working_days} required onChange={handleChange} />
                                <label htmlFor="current_working_days">Working days ({months[new Date().getMonth()]})</label>
                            </div>
                            <div className="text-input-div">
                                <input type="text" id='current_working_time' pattern="([01][0-9]|2[0-3]):[0-5][0-9]" name='current_working_time' value={form?.current_working_time} required onChange={handleChange} />
                                <label htmlFor="current_working_time">Hours in a day (HH:MM)</label>
                            </div>

                        </div>
                        <div className="actions">
                            <button type={loading === 'submit' ? 'button' : 'submit'} >
                                {loading === 'submit' ? <span className='loading-icon'><BiLoaderAlt /></span> : 'Update'}</button>
                        </div>
                    </form>}
            </div>
        </div>
    )
}

export default EditStaff