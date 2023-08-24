import React, { useEffect, useState } from 'react'
import Header from '../../../components/admin/header/Header'
import AddDesignation from '../../../components/admin/models/Add_designation'
import EditDesignation from '../../../components/admin/models/EditDesignation'
import IconWithMessage from '../../../components/common/spinners/SpinWithMessage'
import Title from '../../../components/common/title/Title'
import './designations.scss'
import { adminAxios } from '../../../config/axios'
import { IoCloseCircleOutline, IoTrashBin } from 'react-icons/io5'
import { FiEdit2 } from 'react-icons/fi'
import { BsTrash3 } from 'react-icons/bs'
import { AiOutlinePlus } from 'react-icons/ai'
import { toast } from 'react-hot-toast'
import { stringToLocalTime } from '../../../assets/javascript/date-helper'
import { BiLoaderAlt } from 'react-icons/bi'

function Designations() {

    const [data, setData] = useState([])
    const [model, setModel] = useState(null)
    const [editData, setEditData] = useState({})
    const [loading, setLoading] = useState('')

    useEffect(() => {
        setLoading('initialLoad')
        adminAxios.get('/designations').then((response) => {
            setLoading('')
            setData(response.data?.data || [])
        })
    }, [])

    const openEdit = (header, value) => {
        setEditData({ ...value, allow_origins: value.allow_origins, auto_punch_out: value.auto_punch_out || '17:30' })
        setModel(header)
    }

    const handleDelete = (id) => {
        let confirm = window.confirm('Are you delete this designation ?')
        if (confirm) {
            setLoading(id)
            adminAxios.delete(`/designation?id=${id}`).then((response) => {
                setData((state) => {
                    return state.filter(obj => obj._id !== id)
                })
                setLoading('')
            }).catch((error) => {
                toast.error(error.response.data.message)
                setLoading('')
            })
        }
    }

    return (
        <div className='designations'>
            <div className="header-div">
                <Header />
            </div>
            <div className="container">
                <div>
                    <Title sub={'Designation list'} />
                </div>
                <div className="top">
                    <button onClick={() => setModel('ADD NEW DESIGNATION')}><AiOutlinePlus /> Add Designation</button>
                </div>
                <div className="table-div">
                    {data?.[0] ?
                        <table id="list">
                            <tr>
                                <th>Sl no</th>
                                <th>Designation</th>
                                <th>Staff</th>
                                <th>Access</th>
                                <th>Auto Punch Out</th>
                                <th>Control</th>
                            </tr>
                            {data.map((value, index) => {
                                return <tr key={value._id}>
                                    <td>{++index}</td>
                                    <td>{value.designation}</td>
                                    <td style={{ textAlign: 'center' }}>{value.name.length}</td>
                                    <td style={{ textAlign: 'center' }}>{value?.allow_origins.map((origin) => <span key={origin}
                                        className={`text-badge ${origin}-text`}>{origin}</span>)}</td>
                                    <td style={{ textAlign: 'center' }}>{stringToLocalTime(value.auto_punch_out ? value.auto_punch_out : '17:30')}</td>
                                    <td style={{ textAlign: 'center' }}>
                                        <div className='buttons' >
                                            <button title='Edit' onClick={() => openEdit('EDIT DESIGNATION', value)}
                                                className='button-small-icon edit'><FiEdit2 /></button>
                                            <button title='Remove' onClick={() => handleDelete(value._id)}
                                                className={loading === value._id ? 'button-small-icon delete loading-icon' : 'button-small-icon delete'}>
                                                {loading === value._id ? <BiLoaderAlt /> : <BsTrash3 />}</button>
                                        </div>
                                    </td>
                                </tr>
                            })}
                        </table>
                        : <>
                            <div className='no-data'>
                                <IconWithMessage icon={!loading === 'initialLoad' && <IoTrashBin />}
                                    message={loading === 'initialLoad' ? 'Loading...' : 'No Data'}
                                    spin={loading === 'initialLoad' ? true : false} />
                            </div>
                        </>}
                </div>
            </div>

            {
                model ?
                    <>
                        <div className="model" >
                            <div className="border">
                                <div className="shadow" onClick={() => setModel('')}></div>
                                <div className={model === 'WORKS LIST' ? "box large-box" : 'box'}>
                                    <div className="header">
                                        <div className="title">
                                            <h5>{model}</h5>
                                        </div>
                                        <div className="close-icon" onClick={() => setModel('')}>
                                            <IoCloseCircleOutline />
                                        </div>
                                    </div>
                                    <div className="content">
                                        {model === 'ADD NEW DESIGNATION' && <AddDesignation setModel={setModel} setData={setData} />}
                                        {model === 'EDIT DESIGNATION' &&
                                            <EditDesignation setModel={setModel} editData={editData} setEditData={setEditData} setData={setData} />}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </> : ''
            }
        </div >
    )
}

export default Designations