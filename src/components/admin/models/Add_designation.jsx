import React, { useState } from 'react'
import './style.scss';
import { adminAxios } from '../../../config/axios'
import { toast } from 'react-hot-toast'
import { BiLoaderAlt } from 'react-icons/bi'

function Add_designation({ setModel, setData }) {
    const [form, setForm] = useState({ user_name: null, password: null })
    const [loading, setLoading] = useState(false)
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true)
        adminAxios.post('/designation', form).then((response) => {
            toast.success(response.data.message)
            setData((state) => {
                return [...state, response.data.data]
            })
            setModel(null)
            setLoading(false)
        }).catch((error) => {
            toast.error(error.response.data.message)
            setLoading(false)
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
                        <button>  {loading ? <span className='loading-icon'><BiLoaderAlt /></span> : 'Create'}</button>
                    </div>
                </form>
            </div >
        </div >
    )
}

export default Add_designation