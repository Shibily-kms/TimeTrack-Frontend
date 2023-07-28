import React, { useState } from 'react'
import './textInput.scss'
import { AiOutlinePlus } from 'react-icons/ai'
import { BiLoaderAlt } from 'react-icons/bi'
import { adminAxios } from '../../../config/axios'
import { toast } from 'react-hot-toast'

function AddTextInput({ setWorks, designationId }) {
    const [work, setWork] = useState('')
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setWork(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (work.length >= 3) {
            setLoading(true)
            adminAxios.post('/regular-work', { designationId, regular_work: work }).then((response) => {
                setWorks((state) => {
                    return [...state, response.data.data]
                })
                setWork('')
                setLoading(false)
            }).catch((error) => {
                toast.error(error.response.data.message)
                setWork('')
                setLoading(false)
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
                        <button className={loading && 'loading-icon'}>{loading ? <BiLoaderAlt /> : <AiOutlinePlus />}</button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default AddTextInput