import React, { useState, useEffect } from 'react'
import './edit-work-data.scss'
import { IoClose } from 'react-icons/io5'
import { BiLoaderAlt } from 'react-icons/bi'
import { adminAxios } from '../../../config/axios'
import { toast } from 'react-hot-toast'

function EditWorkData({ data, closeModal }) {
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({ punch_in: null, punch_out: null })

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handelSubmit = (e) => {
        setLoading(true)
        e.preventDefault();
        const ask = window.confirm('Are you sure update this work ?')
        
        if (ask) {
            const date = `${data.year}-${(data.month + 1).toString().padStart(2, '0')}-${data.date.toString().padStart(2, '0')}`

            adminAxios.put('/work-analyze', { ...form, date, staff_id: data.staff_id }).then((response) => {
                setLoading(false)
                toast.success('Updated. Refresh now!')
                closeModal({ open: false })
            }).catch((error) => {
                toast.error(error.response.data.message)
            })
        }

    }

    useEffect(() => {
        setForm({
            punch_in: data?.punch?.in?.split(':').slice(0, 2).join(':'),
            punch_out: data?.punch?.out?.split(':').slice(0, 2).join(':') || null
        })
    }, [data])

    return (
        <div className='edit-work-data'>
            <div className="box-div">
                <div className="head">
                    <h5 className="title">Edit data</h5>
                    <div className="icon-div" onClick={() => closeModal()}>
                        <IoClose />
                    </div>
                </div>
                <div className="body-content">
                    <form action="" onSubmit={handelSubmit}>
                        <div className="text-input-div">
                            <input type="time" id='punch_in' name='punch_in' value={form.punch_in || ''}
                                onChange={handleChange} />
                            <label htmlFor="punch_in">Punch In</label>
                        </div>

                        <div className="text-input-div">
                            <input type="time" id='punch_out' name='punch_out' value={form.punch_out || ''}
                                onChange={handleChange} />
                            <label htmlFor="punch_out">Punch Out</label>
                        </div>

                        <div className="actions">
                            <button type={loading === 'submit' ? 'button' : 'submit'} >
                                {loading === 'submit' ? <span className='loading-icon'><BiLoaderAlt /></span> : 'Update'}</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default EditWorkData