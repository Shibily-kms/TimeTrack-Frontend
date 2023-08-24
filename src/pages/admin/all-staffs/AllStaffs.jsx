import React, { useEffect, useState } from 'react'
import Header from '../../../components/admin/header/Header'
import Title from '../../../components/common/title/Title'
import AddStaff from '../../../components/admin/add-staff/AddStaff'
import EditStaff from '../../../components/admin/edit-staff/EditStaff'
import DeleteStaff from '../../../components/admin/models/DeleteStaff'
import './all-staffs.scss'
import { adminAxios } from '../../../config/axios'
import { BsTrash3, BsListUl } from 'react-icons/bs'
import { AiOutlinePlus } from 'react-icons/ai'
import { FiEdit2 } from 'react-icons/fi'
import { IoCloseCircleOutline } from 'react-icons/io5'
import { toast } from 'react-hot-toast'
import IconWithMessage from '../../../components/common/spinners/SpinWithMessage'
import { IoTrashBin } from 'react-icons/io5'
import EditWorkList from '../../../components/admin/models/EditWorkList'

function AllStaffs() {
    const [loading, setLoading] = useState('')
    const [data, setData] = useState([])
    const [modal, setModal] = useState(null)
    const [password, setPassword] = useState({ text: null, copied: false })
    const [doId, setDoId] = useState(null)

    useEffect(() => {
        setLoading('initialData')
        adminAxios.get('/staff/all-list').then((response) => {
            setData(response.data.data)
            setLoading('')
        })
    }, [])



    const closeModel = () => {
        if (password.text && !password.copied) {
            toast.error('Must copy password')
            return
        }
        setModal()
        setPassword({ text: null, copied: false })
    }

    const openModal = (id, action) => {
        setModal(action)
        setDoId(id)
    }


    return (
        <div className='all-staffs'>
            <div className="header-div">
                <Header />
            </div>
            <div className="container">
                <div>
                    <Title sub={'All staffs'} />
                </div>
                <div className="top">
                    <button onClick={() => setModal('ADD NEW STAFF')}><AiOutlinePlus /> Add Staff</button>
                </div>
                <div className="table-div">
                    {data?.[0] ? <>
                        <table id="list">
                            <tr>
                                <th>Sl no</th>
                                <th>Full name</th>
                                <th>Designation</th>
                                <th>Mobile</th>
                                <th>Control</th>
                            </tr>
                            {data.map((value, index) => {
                                return <tr key={value._id}>
                                    <td>{++index}</td>
                                    <td>{value?.first_name ? value?.first_name + ' ' + value?.last_name : value?.user_name}</td>
                                    <td>{value.designation.designation}</td>
                                    <td>{value.contact}</td>
                                    <td>
                                        <div className='buttons'>
                                            <div className="button-div">
                                                <button title='Works list' onClick={() => openModal(value._id, 'WORKS LIST')}
                                                    className='button-small-icon '><BsListUl /></button>
                                                {value.work_count && <span>{value.work_count}</span>}
                                            </div>
                                            <div className="button-div">
                                                <button title='Edit' onClick={() => openModal(value._id, 'EDIT STAFF')}
                                                    className='button-small-icon edit'> <FiEdit2 /></button>
                                            </div>
                                            <div className="button-div">
                                                <button title='Remove' onClick={() => openModal(value._id, 'DELETE STAFF')}
                                                    className={'button-small-icon delete'}>  <BsTrash3 /></button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            })}
                        </table>
                    </>
                        :
                        <div className='no-data'>
                            <IconWithMessage icon={loading !== 'initialData' && <IoTrashBin />} message={loading === 'initialData' ? 'Loading...' : 'No Staffs'} spin={loading === 'initialData' ? true : false} />
                        </div>
                    }

                </div>
            </div>
            {
                modal ?
                    <>
                        <div className="modal" >
                            <div className="border">
                                <div className="shadow" onClick={() => closeModel()}></div>
                                <div className={modal === 'DELETE STAFF' ? "box" : 'box large-box'}>
                                    <div className="header">
                                        <div className="title">
                                            <h5>{modal}</h5>
                                        </div>
                                        <div className="close-icon" onClick={() => closeModel()}>
                                            <IoCloseCircleOutline />
                                        </div>
                                    </div>
                                    <div className="content">
                                        {modal === 'ADD NEW STAFF' && <AddStaff closeModel={closeModel} setData={setData}
                                            password={password.text} setPassword={setPassword} />}
                                        {modal === 'EDIT STAFF' && <EditStaff setModal={setModal} setData={setData} editId={doId} />}
                                        {modal === 'DELETE STAFF' && <DeleteStaff setModal={setModal} setData={setData} deleteId={doId} />}
                                        {modal === 'WORKS LIST' && <EditWorkList setModal={setModal} staffId={doId} />}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </> : ''
            }
        </div >
    )
}

export default AllStaffs