import React, { useState } from 'react'
import './textInput.scss'
import { AiOutlinePlus } from 'react-icons/ai'
import { adminAxios } from '../../../config/axios'
import { toast } from 'react-toastify'

function AddTextInput({ setWorks, designationId }) {
    const [work, setWork] = useState('')

    const handleChange = (e) => {
        setWork(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (work.length >= 3) {
            adminAxios.post('/regular-work', { designationId, regular_work: work }).then((response) => {
                setWorks((state) => {
                    return [...state, response.data.work]
                })
                setWork('')
            }).catch((error) => {
                toast.error(error.response.data.message)
                setWork('')
            })
        } else {
            toast.error('Must have 3 letters')
        }
    }

    return (
        <div className='add-text-input'>
            <form action="" onSubmit={handleSubmit}>
                <div>
                    <div className="item-div">
                        <input className='text-input' name="work" value={work} placeholder='Write a work' onChange={handleChange} />
                    </div>
                    <div className="actions">
                        <button><AiOutlinePlus /></button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default AddTextInput