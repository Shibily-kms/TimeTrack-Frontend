import React from 'react'
import './add-designation.scss'
import { adminAxios } from '../../../config/axios'
import { toast } from 'react-toastify'

function EditDesignation({ setModel, editData, setEditData, setData }) {


    const handleChange = (e) => {
        setEditData({
            ...editData,
            [e.target.name]: e.target.value
        })
    }

    const handleAllow = (e) => {
        setEditData({
            ...editData,
            allow_sales: e.target.value === 'true'

        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editData._id) {
            adminAxios.put('/designation', editData).then(() => {
                setData((prev) => prev.map((obj) => {
                    if (editData._id === obj._id) {
                        if (editData.auto_punch_out !== obj.auto_punch_out && 14 <= new Date().getHours()) {
                            toast.info('The time changes will only take effect tomorrow')
                        }
                        return {
                            ...obj,
                            designation: editData.designation,
                            allow_sales: editData.allow_sales,
                            auto_punch_out: editData.auto_punch_out
                        }
                    }
                    return obj
                }))
                setModel('')
                toast.success('Changes Applied')
            }).catch((error) => {
                toast.error(error.response.data.message)
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
                        <select id="source" name="source" required onChange={handleAllow} >
                            <option selected={editData.allow_sales ? true : false} value={true} defaultValue={true}>Yes</option>
                            <option selected={editData.allow_sales ? false : true} value={false} defaultValue={false}>No</option>
                        </select>
                        <label htmlFor="source">Access to Sales Page</label>
                    </div>
                    <div className="new-input-div">
                        <input type="time" name='auto_punch_out' required onChange={handleChange}
                            value={editData.auto_punch_out} />
                        <label htmlFor="pin">Auto Punch Out Time</label>
                    </div>


                    <div className="button-div">
                        <button type='submit'>Submit</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditDesignation