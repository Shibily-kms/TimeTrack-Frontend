import React, { useEffect, useState } from 'react'
import Header from '../../../components/admin/header/Header'
import './access-sales.scss'
import { adminAxios } from '../../../config/axios'
import { IoSettingsSharp, IoCloseCircleOutline } from 'react-icons/io5'
import { toast } from 'react-toastify'

function AccessSales() {
    const [data, setData] = useState([])
    const [model, setModel] = useState(null)
    const [settings, setSettings] = useState({ id: null, allow_sales: false, auto_punch_out: '17:30' })
    useEffect(() => {
        adminAxios.get('/designations').then((response) => {
            setData(response.data.designations)
        })
    }, [])

    const closeModel = () => {
        setModel(null)
        setSettings({ id: null, allow_sales: false, auto_punch_out: '17:30' })
    }

    const openModel = (value) => {
        setModel(value)
        setSettings({ id: null, allow_sales: value.allow_sales || false, auto_punch_out: value.auto_punch_out || '17:30' })
    }

    const handleAllow = (e, id) => {
        setSettings({
            ...settings,
            id, allow_sales: e.target.value === 'true',
        })
    }

    const handleChange = (e, id) => {
        setSettings({
            ...settings,
            id, auto_punch_out: e.target.value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (settings.id) {
            adminAxios.put('/designation/settings', settings).then((response) => {
                setData((prev) => prev.map((obj) => {
                    if (settings.id === obj._id) {
                        return {
                            ...obj,
                            allow_sales: settings.allow_sales,
                            auto_punch_out: settings.auto_punch_out
                        }
                    }
                    return obj
                }))
                closeModel()
                toast.success('Changes Applied')
            })
        }
    }

    return (
        <div>
            <div className="header-div">
                <Header />
            </div>
            <div className="container">
                <div className="table-div">
                    <table id="list">
                        {data?.[0] ? <>
                            <tr>
                                <th>Sl no</th>
                                <th>Designation</th>
                                <th>Access Sales</th>
                                <th>Auto Punch Out</th>
                                <th>Action</th>
                            </tr>
                            {data.map((value, index) => {
                                return <tr >
                                    <td>{++index}</td>
                                    <td>{value.designation}</td>
                                    <td>{value.allow_sales ? 'Yes' : 'No'}</td>
                                    <td>{value.auto_punch_out ? value.auto_punch_out : '17:30'}</td>
                                    <td>
                                        <div>
                                            <button onClick={() => openModel(value)} className='button-small-icon '><IoSettingsSharp /></button>
                                        </div>
                                    </td>
                                </tr>
                            })}
                        </>
                            : <>
                                <tr>
                                    <td style={{ textAlign: 'center' }}>no data</td>
                                </tr>
                            </>}
                    </table>

                </div>
            </div>
            {model ?
                <>
                    <div className="model" >
                        <div className="boader">
                            <div className="shadow" onClick={() => closeModel(null)}></div>
                            <div className="box">
                                <div className="header">
                                    <div className="title">
                                        <h5>{"Settings"}</h5>
                                    </div>
                                    <div className="close-icon" onClick={() => closeModel(null)}>
                                        <IoCloseCircleOutline />
                                    </div>
                                </div>
                                <div className="content">
                                    <form action="" onSubmit={handleSubmit}>
                                        <div className="new-input-div">
                                            <select id="source" name="source" required onChange={(e) => handleAllow(e, model._id)} >
                                                <option selected={model.allow_sales ? true : false} value={true} defaultValue={true}>Yes</option>
                                                <option selected={model.allow_sales ? false : true} value={false} defaultValue={false}>No</option>
                                            </select>
                                            <label htmlFor="source">Access to Sales Page</label>
                                        </div>
                                        <div className="new-input-div">
                                            <input type="time" name='auto_punch_out' required onChange={(e) => handleChange(e, model._id)}
                                                value={settings.auto_punch_out} />
                                            <label htmlFor="pin">Auto Punch Out Time</label>
                                        </div>
                                        <div className={settings?.id ? "button-div" : "button-div hide"}>
                                            <button type={settings?.id ? "submit" : "button"}>Save</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </> : ''}
        </div>
    )
}

export default AccessSales