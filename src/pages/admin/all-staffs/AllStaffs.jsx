import React, { useEffect, useState } from 'react'
import './all-staffs.scss'
import AddStaff from '../../../components/admin/edit-staff/EditStaff'
import EditStaff from '../../../components/admin/edit-staff/EditStaff'
import DeleteStaff from '../../../components/admin/models/DeleteStaff'
import TableFilter from '../../../components/common/table-filter/TableFilter'
import SpinWithMessage from '../../../components/common/spinners/SpinWithMessage'
import EditWorkList from '../../../components/admin/models/EditWorkList'
import { adminAxios } from '../../../config/axios'
import { getTimeFromSecond } from '../../../assets/javascript/date-helper'
import { BsTrash3 } from 'react-icons/bs'
import { AiOutlinePlus } from 'react-icons/ai'
import { FiEdit2, FiList } from 'react-icons/fi'
import { IoCloseCircleOutline } from 'react-icons/io5'
import { toast } from '../../../redux/features/user/systemSlice'
import { IoTrashBin } from 'react-icons/io5'
import { useDispatch } from 'react-redux'
import Modal from '../../../components/common/modal/Modal'
import SingleButton from '../../../components/common/buttons/SingleButton'
import { FaPlus } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom'
import { GrEdit } from "react-icons/gr";
import { TbUserEdit } from "react-icons/tb";


function AllStaffs({ setPageHead }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState('')
    const [data, setData] = useState([])
    const [modal, setModal] = useState({ status: false, width: '600px' })
    const [password, setPassword] = useState({ text: null, copied: false })
    const [doId, setDoId] = useState(null)

    useEffect(() => {
        setPageHead({ title: 'Staff List' })
        setLoading('initialData')
        adminAxios.get('/staff/all-list').then((response) => {
            setData(response.data)
            setLoading('')
        }).catch((error) => {
            setLoading('')
            dispatch(toast.push.error({ message: error.message }))
        })

        // eslint-disable-next-line
    }, [])



    const closeModel = () => {
        if (password.text && !password.copied) {
            toast.error('Must copy password')
            return
        }
        setModal()
        setPassword({ text: null, copied: false })
    }

    const openModal = (title, component) => {
        setModal({ ...modal, status: true, title, content: component })
        // setDoId(id)
    }


    return (
        <div className='staff-list-page-div'>
            <Modal modal={modal} setModal={setModal} />
            <div className="table-div">
                {data?.[0] ? <>
                    <TableFilter srlNo={true} >
                        <table id="list">
                            <thead>
                                <tr>
                                    <th>Full Name</th>
                                    <th>Designation</th>
                                    <th>Mobile No</th>
                                    <th>Work Details</th>
                                    <th>Salary</th>
                                    <th>Control</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((value) => {
                                    return <tr key={value._id} >

                                        <td style={{ cursor: "pointer" }} title='Click for show profile details' onClick={() => navigate(`/admin/staff-list/${value._id}/view`)}>
                                            {value?.first_name + ' ' + value?.last_name}<br></br><small>{value?.sid}</small>
                                        </td>
                                        <td style={{ cursor: "pointer" }} onClick={() => navigate(`/admin/staff-list/${value._id}/view`)}>
                                            {value.designation.designation}
                                        </td>
                                        <td onClick={() => navigate(`/admin/staff-list/${value._id}/view`)}>{value.contact1}</td>
                                        <td onClick={() => navigate(`/admin/staff-list/${value._id}/view`)}>
                                            {getTimeFromSecond(value.current_working_time) || 'Om'} x {value.current_working_days || 0}
                                            <br></br><small>{getTimeFromSecond(value.current_working_time * value.current_working_days)}</small>
                                        </td>
                                        <td onClick={() => navigate(`/admin/staff-list/${value._id}/view`)}>₹{value.current_salary || 0}.00</td>
                                        <td>
                                            <div className="button-div">
                                                <SingleButton title='Edit' classNames={'icon-only'} stIcon={<GrEdit />} onClick={() => openModal('Edit Staff')} />
                                            </div>
                                        </td>
                                        <td style={{ display: 'none' }}>{value?.sid}</td>
                                    </tr>
                                })}
                            </tbody>
                        </table>
                    </TableFilter>
                </>
                    :
                    <div className='no-data'>
                        <SpinWithMessage icon={<IoTrashBin />} message={'Empty list'} load={loading === 'initialData'} fullView />
                    </div>
                }
            </div>
        </div >
    )
}

export default AllStaffs