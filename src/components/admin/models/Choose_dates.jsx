import React, { useState } from 'react'
import './style.scss';
import { adminAxios } from '../../../config/axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Choose_dates({ setModel }) {
    const [form, setForm] = useState({ from_date: "", to_date: "" })
    const navigate = useNavigate()
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        adminAxios.get(`/works-data?from_date=${form.from_date}&to_date=${form.to_date}`).then((response) => {
            navigate('/admin/staff-work-details', { state: response.data.work_data })
            setModel(null)
        }).then((error) => {
            toast.error(error.response.data.message)
        })
    }

    return (
        <div>
            <div className='add-design'>
                <div className="inputs">
                    <form onSubmit={handleSubmit}>
                        <div className="input-div">
                            <label htmlFor="from_date">From date</label>
                            <input type='date' name='from_date' id='from_date' value={form.from_date} required onChange={handleChange} />
                        </div>
                        <div className="input-div">
                            <label htmlFor="to_date">End date</label>
                            <input type='date' name='to_date' id='to_date' value={form.to_date} required onChange={handleChange} />
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