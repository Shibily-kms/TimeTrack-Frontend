import React, { useState } from 'react'
import './add-work.scss'
import { adminAxios } from '../../../config/axios';
import { useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'

function Add_work() {
    const location = useLocation()
    const [form, setForm] = useState({ designation: location?.state?.id, regular_work: '' })

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }
    const onSubmit = (e) => {
        e.preventDefault();
        adminAxios.post('/regular_work', form).then((response) => {
            toast.success(response.data.message)
            setForm({
                ...form,
                regular_work: ''
            })
        }).catch((error) => {
            toast.error(error.response.data.message)
            setForm({
                ...form,
                regular_work: ''
            })
        })
    }

    return (
        <div>
            <div className="add-work">
                <div className="boader">
                    <div className="box">
                        <div className="header">
                            <h4>Add Work</h4>
                        </div>
                        <div className="inputs">
                            <form onSubmit={onSubmit}>
                                <div className="input-div">
                                    <label htmlFor="designation">Designation</label>
                                    <input type="text" id='designation' required readOnly value={location?.state?.designation} />
                                </div>
                                <div className="input-div">
                                    <label htmlFor="regular_work">Regular work</label>
                                    <input type='text' name='regular_work' value={form?.regular_work} id='regular_work' required onChange={handleChange} />
                                </div>
                                <div className="button-div">
                                    <button type='submit'>Add</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Add_work