import React, { useEffect, useState } from 'react'
import './delete-staff.scss'
import { toast } from 'react-hot-toast'
import { adminAxios } from '../../../config/axios'
import { BiLoaderAlt } from 'react-icons/bi'

function DeleteStaff({ setModal, setData, deleteId }) {
    const [form, setForm] = useState({ type: null, message: '' })
    const [loading, setLoading] = useState(null)
    const [hide, setHide] = useState(true)

    useEffect(() => {
        if (form.type === 'hard' || form.message.length > 4) {
            setHide(false)
        } else {
            setHide(true)
        }
    }, [form])


    const handleChoose = (e) => {
        setForm({ ...form, type: e.target.value })
    }

    const handleChange = (e) => {
        setForm({ ...form, message: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const ask = window.confirm('Are you delete this staff ?')
        if (ask) {
            if (form.type) {
                setLoading(true)
                adminAxios.delete(`/staff?id=${deleteId}&type=${form.type}&message=${form.message}`).then((response) => {
                    setData((state) => state.filter((staff) => staff._id !== deleteId))
                    setModal('')
                    setLoading(false)
                }).catch((error) => {
                    toast.error(error.response.data.message)
                    setModal('')
                    setLoading(false)
                })
            } else {
                toast.error('Choose any option')
            }
        } else {
            setModal('')
        }
    }


    return (
        <div className='delete-staff'>
            <div className="boarder">
                <h5>Reasons for delete a staff :</h5>
                <form action="" onSubmit={handleSubmit}>
                    <div className="radio-input-div">
                        <input type="radio" id='hard' value={'hard'} name='reason' onChange={handleChoose} />
                        <label htmlFor="hard">Rectification / Removal <span>( Hard delete )</span></label>
                    </div>
                    <div className="radio-input-div">
                        <input type="radio" id='soft' value={'soft'} name='reason' onChange={handleChoose} />
                        <label htmlFor="soft">Left the company</label>
                    </div>
                    {form.type === 'soft' && <div className="text-input-div">
                        <input type="text" id='message' name='message' value={form.message} required onChange={handleChange} />
                        <label htmlFor="message">Type Reason</label>
                        <small>* Minimum 5 letters</small>
                    </div>}

                    <div className="buttons">
                        <button type={hide ? 'button' : 'submit'} className={hide && 'hide'}>{loading && <span className='loading-icon'>
                            <BiLoaderAlt /></span>} {form.type === 'soft' ? 'Leave' : 'Delete'}</button>
                    </div>
                </form>
            </div>

        </div>
    )
}

export default DeleteStaff