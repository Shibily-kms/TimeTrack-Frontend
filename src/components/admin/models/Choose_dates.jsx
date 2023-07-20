import React, { useState } from 'react'
import './style.scss';
import { adminAxios } from '../../../config/axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { BiLoaderAlt } from 'react-icons/bi'

function Choose_dates({ setModel }) {
    const [form, setForm] = useState({
        from_date: new Date().toISOString().split('T')[0],
        to_date: new Date().toISOString().split('T')[0]
    })
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true)
        adminAxios.get(`/works-data?from_date=${form.from_date}&to_date=${form.to_date}`).then((response) => {
            navigate('/admin/staff-work-details', { state: response.data.work_data })
            setModel(null)
            setLoading(false)
        }).then((error) => {
            setLoading(false)
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
                            <button type='submit'><span className={loading ? 'loading-icon' : 'hide'}><BiLoaderAlt /></span> Select</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Choose_dates