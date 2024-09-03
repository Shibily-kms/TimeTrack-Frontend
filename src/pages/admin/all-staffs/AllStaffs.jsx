import React, { useEffect, useState } from 'react'
import './all-staffs.scss'
import EditStaff from '../../../components/admin/edit-staff/EditStaff'
import TableFilter from '../../../components/common/table-filter/TableFilter'
import SpinWithMessage from '../../../components/common/spinners/SpinWithMessage'
import StaffSettings from '../../../components/admin/staff-settings/StaffSettings'
import { adminAxios } from '../../../config/axios'
import { getTimeFromSecond } from '../../../assets/javascript/date-helper'
import { setAdminActivePage, toast } from '../../../redux/features/user/systemSlice'
import { IoTrashBin } from 'react-icons/io5'
import { useDispatch, useSelector } from 'react-redux'
import Modal from '../../../components/common/modal/Modal'
import SingleButton from '../../../components/common/buttons/SingleButton'
import { useNavigate } from 'react-router-dom'
import { GrEdit } from "react-icons/gr";
import { FaCheck, FaPlus } from "react-icons/fa6";
import { FiSettings } from "react-icons/fi";


function AllStaffs({ setPageHead }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState('')
    const [data, setData] = useState([])
    const [modal, setModal] = useState({ status: false })
    const [allStaff, setAllStaff] = useState(false)
    const { admin } = useSelector((state) => state.adminAuth)


    const getActiveStaffList = () => {
        adminAxios.get('/staff/all-list').then((response) => {
            setData(response.data)
            setLoading('')
        }).catch((error) => {
            setLoading('')
            dispatch(toast.push.error({ message: error.message }))
        })
    }

    const getAllStaffList = () => {
        adminAxios.get('/staff/all-list?all=yes').then((response) => {
            setData(response.data)
            setLoading('')
        }).catch((error) => {
            setLoading('')
            dispatch(toast.push.error({ message: error.message }))
        })
    }

    useEffect(() => {
        setPageHead({ title: 'Staff List' })
        getActiveStaffList()
        setLoading('initialData')
        dispatch(setAdminActivePage('staff-list'))

        // eslint-disable-next-line
    }, [])

    const openModal = (title, component, width) => {
        setModal({ ...modal, status: true, title, content: component, width: width || null })
    }

    const handleAllButton = () => {
        setLoading('listing')
        setAllStaff(!allStaff)
        if (allStaff) {
            // Get Active Staff List
            getActiveStaffList()
        } else {
            // Get All Staff list
            getAllStaffList()
        }
    }


    return (
        <div className='staff-list-page-div'>
            <Modal modal={modal} setModal={setModal} />
            <div className="table-div">
                {data?.[0] ? <>
                    <TableFilter srlNo={true} topRight={<div className='button-div'>
                        {admin?.pro_admin && <SingleButton name={'Staff'} stIcon={<FaPlus />}
                            classNames={'btn-tertiary'} onClick={() => navigate('/admin/staff-list/add-staff')} />
                        }
                        <SingleButton name={'All Staffs'} stIcon={allStaff && <FaCheck />}
                            classNames={allStaff ? 'btn-primary' : 'btn-gray'} onClick={handleAllButton} loading={loading === 'listing'} />
                    </div>}>
                        <table id="list">
                            <thead>
                                <tr>
                                    <th>Full Name</th>
                                    <th>Designation</th>
                                    <th>Mobile No</th>
                                    <th>Work Details</th>
                                    <th>Salary</th>
                                    {admin?.pro_admin && <th>Control</th>}
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((value) => {
                                    return <tr key={value._id} className={value?.delete ? 'deleted-item' : ""}>

                                        <td style={{ cursor: "pointer" }} title='Click for show profile details' onClick={() => navigate(`/admin/staff-list/${value._id}/view`)}>
                                            {value?.first_name + ' ' + value?.last_name}<br></br><small>{value?.sid}</small>
                                        </td>
                                        <td style={{ cursor: "pointer" }} onClick={() => navigate(`/admin/staff-list/${value._id}/view`)}>
                                            {value.designation.designation}
                                        </td>
                                        <td onClick={() => navigate(`/admin/staff-list/${value._id}/view`)}>{value.contact1}</td>
                                        <td onClick={() => navigate(`/admin/staff-list/${value._id}/view`)}>
                                            {getTimeFromSecond(value.current_working_time) || 'Om'} x {value.current_working_days || 0}d
                                            <br></br><small>{getTimeFromSecond(value.current_working_time * value.current_working_days)}</small>
                                        </td>
                                        <td onClick={() => navigate(`/admin/staff-list/${value._id}/view`)}>₹{value.current_salary || 0}.00</td>
                                        {admin?.pro_admin && <td>
                                            {!value?.delete &&
                                                <div className="button-div">
                                                    <SingleButton title='Edit' classNames={'icon-only btn-blue'} stIcon={<GrEdit />}
                                                        onClick={() => openModal('Edit Staff', <EditStaff setModal={setModal} setData={setData} editId={value._id} />, '600px')} />
                                                    <SingleButton title='Staff Settings' classNames={'icon-only btn-primary '} stIcon={<FiSettings />}
                                                        onClick={() => openModal('Settings', <StaffSettings setModal={setModal} staffId={value._id} />)} />
                                                </div>}

                                        </td>}
                                        <td style={{ display: 'none' }}>{value?.sid}</td>
                                    </tr>
                                })}
                            </tbody>
                        </table>
                    </TableFilter>
                </>
                    :
                    <div className='no-data'>
                        <SpinWithMessage icon={<IoTrashBin />} message={'Empty list'} load={loading === 'initialData'} fullView bottomContent={<>
                            {admin?.pro_admin && <SingleButton name={'Create New Staff'} stIcon={<FaPlus />}
                                classNames={'btn-tertiary'} onClick={() => navigate('/admin/staff-list/add-staff')} />
                            }
                        </>} />
                    </div>
                }
            </div>
        </div >
    )
}

export default AllStaffs