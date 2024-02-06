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

    const handleCheck = (e) => {
        if (e.target.checked) {
            setEditData({
                ...editData,
                allow_origins: [...editData.allow_origins, e.target.value]
            })
        } else {
            setEditData({
                ...editData,
                allow_origins: editData.allow_origins.filter((elem) => elem !== e.target.value)
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
                        <input type="time" name='auto_punch_out' required onChange={handleChange}
                            value={editData.auto_punch_out} />
                        <label htmlFor="pin">Auto Punch Out Time</label>
                    </div>

                    <div className="checkbox-list">
                        <div className="checkbox-div">
                            <div className="items">
                                <input type="checkbox" checked={editData?.allow_origins.includes('Sales')} id="Sales" name='allow_origins'
                                    value="Sales" onChange={handleCheck} />
                                <label htmlFor="Sales">Sales</label>
                            </div>
                            <div className="items">
                                <input type="checkbox" checked={editData?.allow_origins.includes('SalesPro')} id="SalesPro" name='allow_origins'
                                    value="SalesPro" onChange={handleCheck} />
                                <label htmlFor="SalesPro">Sales Pro</label>
                            </div>
                            <div className="items">
                                <input type="checkbox" checked={editData?.allow_origins.includes('Accountant')} id="Accountant" name='allow_origins'
                                    value="Accountant" onChange={handleCheck} />
                                <label htmlFor="Accountant">Accountant</label>
                            </div>
                            <div className="items">
                                <input type="checkbox" checked={editData?.allow_origins.includes('PR_Service')} id="PR_Service" name='allow_origins'
                                    value="PR_Service" onChange={handleCheck} />
                                <label htmlFor="PR_Service">PR Service</label>
                            </div>
                            <div className="items">
                                <input type="checkbox" checked={editData?.allow_origins.includes('PR_Admin')} id="PR_Admin" name='allow_origins'
                                    value="PR_Admin" onChange={handleCheck} />
                                <label htmlFor="PR_Admin">PR Admin</label>
                            </div>
                            <div className="items">
                                <input type="checkbox" checked={editData?.allow_origins.includes('ControlNex')} id="ControlNex" name='allow_origins'
                                    value="ControlNex" onChange={handleCheck} />
                                <label htmlFor="ControlNex">ControlNex</label>
                            </div>
                            <div className="items">
                                <input type="checkbox" checked={editData?.allow_origins.includes('WH_Service')} id="WH_Service" name='allow_origins'
                                    value="WH_Service" onChange={handleCheck} />
                                <label htmlFor="WH_Service">WH Service</label>
                            </div>
                            <div className="items">
                                <input type="checkbox" checked={editData?.allow_origins.includes('WH_Admin')} id="WH_Admin" name='allow_origins'
                                    value="WH_Admin" onChange={handleCheck} />
                                <label htmlFor="WH_Admin">WH Admin</label>
                            </div>
                            <div className="items">
                                <input type="checkbox" checked={editData?.allow_origins.includes('Installation')} id="Installation" name='allow_origins'
                                    value="Installation" onChange={handleCheck} />
                                <label htmlFor="Installation">Installation</label>
                            </div>
                        </div>
                        <label className='head-label' htmlFor="">Origins access</label>
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