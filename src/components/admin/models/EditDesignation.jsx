import React, { useState } from 'react'
import './style.scss'
import { adminAxios } from '../../../config/axios'
import { toast } from 'react-hot-toast'
import { BiLoaderAlt } from 'react-icons/bi'

function EditDesignation({ setModel, editData, setEditData, setData }) {
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setEditData({
            ...editData,
            [e.target.name]: e.target.value
        })
    }

    const handleAllow = (e, type) => {

        if (e.target.value === 'true') {
            setEditData({
                ...editData,
                allow_origins: [...editData.allow_origins, type]
            })
        } else {
            setEditData({
                ...editData,
                allow_origins: editData.allow_origins.filter((elem) => elem !== type)
            })
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editData._id) {
            setLoading(true)
            adminAxios.put('/designation', editData).then(() => {
                setData((prev) => prev.map((obj) => {
                    if (editData._id === obj._id) {
                        return {
                            ...obj,
                            designation: editData.designation,
                            allow_origins: editData.allow_origins,
                            auto_punch_out: editData.auto_punch_out
                        }
                    }
                    return obj
                }))
                setModel('')
                toast.success('Changes Applied')
                setLoading(false)
            }).catch((error) => {
                toast.error(error.response.data.message)
                setLoading(false)
            })
        }
    }


    return (
        <div className='add-design'>
            <div className="inputs">
                <form onSubmit={handleSubmit}>
                    <div className="input-div">
                        <label htmlFor="designation">Designation</label>
                        <input type="text" name='designation' id='designation' value={editData.designation} required onChange={handleChange} />
                    </div>

                    <div className="new-input-div">
                        <select id="source" name="source" required onChange={(e) => handleAllow(e, 'Sales')} >
                            <option selected={editData?.allow_origins.includes('Sales')} value={true} defaultValue={true}>Yes</option>
                            <option selected={!editData?.allow_origins.includes('Sales')} value={false} defaultValue={false}>No</option>
                        </select>
                        <label htmlFor="source">Access to Sales Page</label>
                    </div>
                    <div className="new-input-div">
                        <input type="time" name='auto_punch_out' required onChange={handleChange}
                            value={editData.auto_punch_out} />
                        <label htmlFor="pin">Auto Punch Out Time</label>
                    </div>


                    <div className="button-div">
                        <button>  {loading ? <span className='loading-icon'><BiLoaderAlt /></span> : 'Update'}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditDesignation