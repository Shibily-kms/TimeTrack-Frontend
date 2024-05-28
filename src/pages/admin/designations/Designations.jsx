import React, { useEffect, useState } from 'react'
import './designations.scss'
import AddDesignation from '../../../components/admin/models/Add_designation'
import EditDesignation from '../../../components/admin/models/EditDesignation'
import SpinWithMessage from '../../../components/common/spinners/SpinWithMessage'
import TableFilter from '../../../components/common/table-filter/TableFilter'
import SingleButton from '../../../components/common/buttons/SingleButton'
import Modal from '../../../components/common/modal/Modal'
import { adminAxios } from '../../../config/axios'
import { IoTrashBin } from 'react-icons/io5'
import { FaPlus } from "react-icons/fa6";
import { GrEdit } from 'react-icons/gr'
import { GoTrash } from "react-icons/go";
import { setAdminActivePage, toast } from '../../../redux/features/user/systemSlice'
import { useDispatch, useSelector } from 'react-redux'

function Designations({ setPageHead }) {
    const dispatch = useDispatch()
    const [data, setData] = useState([])
    const [modal, setModal] = useState(null)
    const [loading, setLoading] = useState('fetch')
    const { admin } = useSelector((state) => state.adminAuth)

    useEffect(() => {
        setPageHead({ title: 'Designation List' })
        dispatch(setAdminActivePage('designation-list'))

        setLoading('fetch')
        adminAxios.get('/designations').then((response) => {
            setLoading('')
            setData(response?.data || [])
        }).catch((error) => {
            dispatch(toast.push.error({ message: error.message }))
        })

        // eslint-disable-next-line
    }, [])

    const openModal = (title, content) => {
        setModal({ status: true, title: title, content })
    }

    const handleDelete = (id) => {
        let confirm = window.confirm('Are you delete this designation ?')
        if (confirm) {
            setLoading(id)
            adminAxios.delete(`/designation?id=${id}`).then(() => {
                setData((state) => {
                    return state.filter(obj => obj._id !== id)
                })
                setLoading('')
            }).catch((error) => {
                dispatch(toast.push.error({ message: error.message }))
                setLoading('')
            })
        }
    }


    return (
        <div className='designationList-page-div'>
            <Modal modal={modal} setModal={setModal} />
            <div className="table-div">
                {data?.[0] ?
                    <TableFilter srlNo={true} topRight={admin?.pro_admin && <SingleButton name={'Designation'} stIcon={<FaPlus />} classNames={'md btn-tertiary'}
                        onClick={() => openModal('Create Designation', <AddDesignation setData={setData} setModel={setModal} />)} />}>
                        <table id="list">
                            <thead>
                                <tr>
                                    <th>Designation</th>
                                    <th>Staffs Count</th>
                                    {admin?.pro_admin && <th>Control</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((value, index) => {
                                    return <tr key={value._id}>
                                        <td>{value.designation}</td>
                                        <td style={{ textAlign: 'center' }}>{value.name.length}</td>
                                        {admin?.pro_admin && <td style={{ textAlign: 'center' }}>
                                            <div className='buttons' >
                                                <SingleButton title='Edit' classNames={'icon-only btn-blue'} stIcon={<GrEdit />}
                                                    onClick={() => openModal('Edit Designation', <EditDesignation setModal={setModal} setData={setData} editData={value} />)} />
                                                <SingleButton title='Delete' classNames={'icon-only btn-danger '} stIcon={<GoTrash />} onClick={() => handleDelete(value._id)}
                                                    loading={loading === value._id} />
                                            </div>
                                        </td>}
                                    </tr>
                                })}
                            </tbody>
                        </table>
                    </TableFilter>
                    : <SpinWithMessage load={loading === 'fetch'} height={'300px'} fullView
                        icon={<IoTrashBin />} message={'Empty list'} />}
            </div>
        </div >
    )
}

export default Designations