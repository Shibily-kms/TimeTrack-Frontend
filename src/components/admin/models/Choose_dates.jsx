import React, { useEffect, useState } from 'react'
import './style.scss';
import { useNavigate } from 'react-router-dom';
import { adminAxios } from '../../../config/axios'

function Choose_dates({ setModel }) {
    const [loading, setLoading] = useState(false)
    const [staffs, setStaffs] = useState([])
    const [form, setForm] = useState({
        from_date: new Date().toISOString().split('T')[0],
        to_date: new Date().toISOString().split('T')[0],
        staff: ''
    })
    const navigate = useNavigate()
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate(`/admin/staff-work-analyze/${form.staff ? 'staff-basie' : 'date-basie'}`, {
            state: {
                ...form,
                type: form.staff ? 'staff-basie' : 'date-basie'
            }
        })
        setModel(null)
    }

    useEffect(() => {
        setLoading(true)
        adminAxios.get('/staff/all-list?all=yes').then((response) => {
            setLoading(false)
            setStaffs(response.data.data)
        })
    }, [])

    return (
        <div>
            <div className='add-design'>
                <div className="inputs">
                    <form onSubmit={handleSubmit}>
                        <div className="input-div">
                            <label htmlFor="from_date">From date</label>
                            <input type='date' name='from_date' id='from_date' min={'2023-07-07'} max={form?.to_date} value={form.from_date} required onChange={handleChange} />
                        </div>
                        <div className="input-div">
                            <label htmlFor="to_date">End date</label>
                            <input type='date' name='to_date' id='to_date' min={'2023-07-07'} max={new Date().toISOString().split('T')[0]} value={form.to_date} required onChange={handleChange} />
                        </div>
                        <div className="input-div">
                            <label htmlFor="staff">Staff</label>
                            <select name="staff" id="staff" onChange={handleChange}>
                                <option value="">{loading ? 'Loading...' : 'All'}</option>
                                {staffs?.map((staff) => <option key={staff._id} value={staff._id}>{staff.first_name + ' ' + staff.last_name}
                                    {staff.delete && ' (Removed)'}</option>)}
                            </select>
                        </div>
                        <div className="button-div">
                            <button type='submit'>Select</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Choose_dates