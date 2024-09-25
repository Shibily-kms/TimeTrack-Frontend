import React, { useEffect, useState } from 'react'
import './all-staffs.scss'
import TableFilter from '../../../components/common/table-filter/TableFilter'
import SpinWithMessage from '../../../components/common/spinners/SpinWithMessage'
import {  workerAxios } from '../../../config/axios'
import { getTimeFromSecond } from '../../../assets/javascript/date-helper'
import { setAdminActivePage, toast } from '../../../redux/features/user/systemSlice'
import { useDispatch, useSelector } from 'react-redux'
import Modal from '../../../components/common/modal/Modal'
import SingleButton from '../../../components/common/buttons/SingleButton'
import { useNavigate } from 'react-router-dom'
import { FaCheck, FaPlus, FaUsers } from "react-icons/fa6";
import Badge from '../../../components/common/badge/Badge'


function AllStaffs({ setPageHead }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState('')
    const [data, setData] = useState([])
    const [modal, setModal] = useState({ status: false })
    const [allStaff, setAllStaff] = useState(false)
    const { user } = useSelector((state) => state.userAuth)


    const getActiveStaffList = () => {
        workerAxios.get('/account/list').then((response) => {
            setData(response.data)
            setLoading('')
        }).catch((error) => {
            setLoading('')
            dispatch(toast.push.error({ message: error.message }))
        })
    }

    const getAllStaffList = () => {
        workerAxios.get('/account/list?all=yes').then((response) => {
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
                    <TableFilter srlNo={true} topRight={user?.allowed_origins?.includes('ttcr_stfAcc_write') && <div className='button-div'>
                        <SingleButton name={'Staff Account'} stIcon={<FaPlus />}
                            classNames={'btn-tertiary'} onClick={() => navigate('/admin/staff-list/account/new')} />
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
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((value) => {
                                    return <tr key={value._id} className={value?.delete ? 'deleted-item' : ""}>

                                        <td style={{ cursor: "pointer" }} title='Click for show profile details' onClick={() => navigate(`/admin/staff-list/${value._id}/profile`)}>
                                            {value?.full_name}<br></br><small>{value?.sid}</small>
                                        </td>
                                        <td style={{ cursor: "pointer" }} onClick={() => navigate(`/admin/staff-list/${value._id}/profile`)}>
                                            {value.designation.designation}<br></br>
                                            <small>{value?.e_type} / {value?.work_mode}</small>
                                        </td>
                                        <td style={{ cursor: "pointer" }} onClick={() => navigate(`/admin/staff-list/${value._id}/profile`)}>
                                            +{value?.primary_number?.country_code} {value?.primary_number?.number}
                                            <br></br> {!value?.primary_number?.verified && <Badge text={'Unverified'} className={'error-fill'} />}
                                        </td>
                                        <td style={{ cursor: "pointer" }} onClick={() => navigate(`/admin/staff-list/${value._id}/profile`)}>
                                            {getTimeFromSecond(value.current_working_time) || 'Om'} x {value.current_working_days || 0}d
                                            <br></br><small>{getTimeFromSecond(value.current_working_time * value.current_working_days)}</small>
                                        </td>
                                        <td style={{ cursor: "pointer" }} onClick={() => navigate(`/admin/staff-list/${value._id}/profile`)}>₹{value.current_salary || 0}.00</td>

                                        <td style={{ display: 'none' }}>{value?.sid} {value?.e_type} {value?.work_mode}</td>
                                    </tr>
                                })}
                            </tbody>
                        </table>
                    </TableFilter>
                </>
                    :
                    <div className='no-data'>
                        <SpinWithMessage icon={<FaUsers />} message={'Crate a staff account using below button.'} load={loading === 'initialData'} height={'85vh'}
                            bottomContent={
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <SingleButton name={'Staff Account'} stIcon={<FaPlus />}
                                        classNames={'btn-tertiary'} onClick={() => navigate('/admin/staff-list/account/new')} />
                                </div>
                            } />
                    </div>
                }
            </div>
        </div >
    )
}

export default AllStaffs