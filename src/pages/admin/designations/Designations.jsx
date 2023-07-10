import React, { useEffect, useState } from 'react'
import Header from '../../../components/admin/header/Header'
import AddDesignation from '../../../components/admin/models/Add_designation'
import EditDesignation from '../../../components/admin/models/EditDesignation'
import './designations.scss'
import { adminAxios } from '../../../config/axios'
import { IoCloseCircleOutline } from 'react-icons/io5'
import { FiEdit2 } from 'react-icons/fi'
import { BsTrash3Fill, BsListUl } from 'react-icons/bs'
import { AiOutlinePlus } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'


function Designations() {
    const navigate = useNavigate()
    const [data, setData] = useState([])
    const [model, setModel] = useState(null)
    const [editData, setEditData] = useState({})
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        adminAxios.get('/designations').then((response) => {
            setLoading(false)
            setData(response.data.designations)
        })
    }, [])

    const openModel = (header, value) => {
        setEditData({ ...value, allow_sales: value.allow_sales || false, auto_punch_out: value.auto_punch_out || '17:30' })
        setModel(header)
    }

    const handleDelete = (id) => {
        let confirm = window.confirm('Are you delete this designation ?')
        if (confirm) {
            adminAxios.delete(`/designation/${id}`).then((response) => {
                setData((state) => {
                    return state.filter(obj => obj._id !== id)
                })
            }).catch((error) => {
                toast.error(error.response.data.message)
            })
        }
    }




    return (
        <div className='designations'>
            <div className="header-div">
                <Header />
            </div>
            <div className="container">
                <div className="top">
                    <button onClick={() => setModel('ADD NEW DESIGNATION')}><AiOutlinePlus /> Add Designation</button>
                </div>
                <div className="table-div">
                    <table id="list">
                        {data?.[0] ? <>
                            <tr>
                                <th>Sl no</th>
                                <th>Designation</th>
                                <th>Access Sales</th>
                                <th>Auto Punch Out</th>
                                <th>Control</th>
                            </tr>
                            {data.map((value, index) => {
                                return <tr key={value._id}>
                                    <td>{++index}</td>
                                    <td>{value.designation}</td>
                                    <td>{value.allow_sales ? 'Yes' : 'No'}</td>
                                    <td>{value.auto_punch_out ? value.auto_punch_out : '17:30'}</td>
                                    <td>
                                        <div className='buttons'>
                                            <button title='Add works' onClick={() => navigate('/admin/add-work', { state: { id: value._id, designation: value.designation } })}
                                                className='button-small-icon '><BsListUl /></button>
                                            <button title='Edit' onClick={() => openModel('EDIT DESIGNATION', value)} className='button-small-icon edit'><FiEdit2 /></button>
                                            <button title='Remove' onClick={() => handleDelete(value._id)} className='button-small-icon delete'><BsTrash3Fill /></button>
                                        </div>
                                    </td>
                                </tr>
                            })}
                        </>
                            : <>
                                <tr>
                                    <td style={{ textAlign: 'center' }}>{loading ? 'loading...' : 'no data'}</td>
                                </tr>
                            </>}
                    </table>

                </div>
            </div>

            {model ?
                <>
                    <div className="model" >
                        <div className="boader">
                            <div className="shadow" onClick={() => setModel('')}></div>
                            <div className="box">
                                <div className="header">
                                    <div className="title">
                                        <h5>{model}</h5>
                                    </div>
                                    <div className="close-icon" onClick={() => setModel('')}>
                                        <IoCloseCircleOutline />
                                    </div>
                                </div>
                                <div className="content">
                                    {model === 'ADD NEW DESIGNATION' ? <AddDesignation setModel={setModel} setData={setData} /> : ""}
                                    {model === 'EDIT DESIGNATION' ?
                                        <EditDesignation setModel={setModel} editData={editData} setEditData={setEditData} setData={setData} />
                                        : ""}
                                </div>
                            </div>
                        </div>
                    </div>
                </> : ''}
        </div>
    )
}

export default Designations