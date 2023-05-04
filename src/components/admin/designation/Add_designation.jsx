import React, { useState } from 'react'
import './add-designation.scss';
import { adminAxios } from '../../../config/axios'
import { toast } from 'react-toastify'

function Add_designation({ setModel }) {
    const [form, setForm] = useState({ user_name: null, password: null })
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        adminAxios.post('/designation', form).then((response) => {
            toast.success(response.data.message)
            setModel(null)
        }).catch((error) => {
            toast.error(error.response.data.message)
        })

    }
    return (
        <div className='add-design'>
            <div className="inputs">
                <form onSubmit={handleSubmit}>
                    <div className="input-div">
                        <label htmlFor="designation">Designation</label>
                        <input type="text" name='designation' id='designation' required onChange={handleChange} />
                    </div>
                    <div className="button-div">
                        <button type='submit'>Submit</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Add_designation