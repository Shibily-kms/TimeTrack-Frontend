import React, { useState } from 'react'
import './work-text.scss'
import { BsTrash3Fill } from 'react-icons/bs'
import { adminAxios } from '../../../config/axios'
import { BiLoaderAlt } from 'react-icons/bi'
import {toast} from 'react-hot-toast'

function EditTextInput({ work, setWorks }) {
    const [loading, setLoading] = useState('')


    const handleDelete = () => {
        const confirm = window.confirm('Are you delete this ?')
        if (confirm) {
            setLoading('delete')
            adminAxios.delete(`/regular-work?work_id=${work._id}`).then(() => {
                setWorks((state) => state.filter((value) => value._id !== work._id))
                setLoading('')
            }).catch((error) => {
                toast.error(error.response.data.message)
            })
        }
    }


    return (
        <div className='edit-text-input'>
            <form action="" >
                <div>
                    <div className="item-div">
                        <p className='text-input'>{work.work_name}</p>
                    </div>
                    <div className="actions">
                        <button type='button' className={loading ? 'delete loading-icon' : 'delete'}
                            onClick={handleDelete}>{loading ? <BiLoaderAlt /> : <BsTrash3Fill />}</button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default EditTextInput