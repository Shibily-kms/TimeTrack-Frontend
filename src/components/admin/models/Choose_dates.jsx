import React, { useState } from 'react'
import './style.scss';
import { useNavigate } from 'react-router-dom';

function Choose_dates({ setModel }) {
    const [form, setForm] = useState({
        from_date: new Date().toISOString().split('T')[0],
        to_date: new Date().toISOString().split('T')[0]
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
        navigate('/admin/staff-work-details/date-basie', { state: { ...form, type: 'date-basie' } })
        setModel(null)
    }

    return (
        <div>
            <div className='add-design'>
                <div className="inputs">
                    <form onSubmit={handleSubmit}>
                        <div className="input-div">
                            <label htmlFor="from_date">From date</label>
                            <input type='date' name='from_date' id='from_date' max={form?.to_date} value={form.from_date} required onChange={handleChange} />
                        </div>
                        <div className="input-div">
                            <label htmlFor="to_date">End date</label>
                            <input type='date' name='to_date' id='to_date' max={new Date().toISOString().split('T')[0]} value={form.to_date} required onChange={handleChange} />
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