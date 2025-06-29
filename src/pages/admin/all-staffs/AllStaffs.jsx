import React, { useEffect, useState } from 'react'
import './all-staffs.scss'
import TableFilter from '../../../components/common/table-filter/TableFilter'
import SpinWithMessage from '../../../components/common/spinners/SpinWithMessage'
import { ttCv2Axios } from '../../../config/axios'
import { getTimeFromSecond } from '../../../assets/javascript/date-helper'
import { setAdminActivePage, toast } from '../../../redux/features/user/systemSlice'
import { RiShieldStarLine } from "react-icons/ri";
import { useDispatch, useSelector } from 'react-redux'
import Modal from '../../../components/common/modal/Modal'
import SingleButton from '../../../components/common/buttons/SingleButton'
import { useNavigate } from 'react-router-dom'
import { FaCheck, FaPlus, FaUsers } from "react-icons/fa6";
import Badge from '../../../components/common/badge/Badge'
import { IoMdSettings } from 'react-icons/io'
import CommonUpdate from '../../../components/admin/common-update/CommonUpdate'
import AlertBox from '../../../components/common/alert/AlertBox'
import { joinStringsFromArray } from '../../../assets/javascript/find-helpers'


function AllStaffs({ setPageHead }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState('')
    const [data, setData] = useState([])
    const [modal, setModal] = useState({ status: false })
    const [allStaff, setAllStaff] = useState(false)
    const { user } = useSelector((state) => state.userAuth)
    const [birthList, setBirthList] = useState([])
    const [joinList, setJoinList] = useState('')


    const getActiveStaffList = () => {
        ttCv2Axios.get('/worker/account/list').then((response) => {
            setData(response.data)
            setLoading('')
        }).catch((error) => {
            setLoading('')
            dispatch(toast.push.error({ message: error.message }))
        })
    }

    const getAllStaffList = () => {
        ttCv2Axios.get('/worker/account/list?all=yes').then((response) => {
            setData(response.data)
            setLoading('')
        }).catch((error) => {
            setLoading('')
            dispatch(toast.push.error({ message: error.message }))
        })
    }

    useEffect(() => {
        setPageHead({
            title: 'Staff List', right: <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                {user?.allowed_origins?.includes('ttcr_stfAcc_write') && <SingleButton stIcon={<IoMdSettings />} classNames={'icon-only'}
                    onClick={() => setModal({
                        status: true, title: 'Common Update',
                        content: <CommonUpdate setModal={setModal} setData={setData} />
                    })} />}
            </div>
        })
        getActiveStaffList()
        setLoading('initialData')
        dispatch(setAdminActivePage('staff-list'))

        // eslint-disable-next-line
    }, [user])

    useEffect(() => {
        const todayDate = new Date().getDate()
        const todayMonth = new Date().getMonth()
        const birthNames = []
        const joinNames = []

        if (data?.[0]) {
            data?.map((staff) => {
                if (new Date(staff?.dob).getDate() === todayDate && new Date(staff?.dob).getMonth() === todayMonth) {
                    birthNames.push(staff?.full_name)
                }

                if (new Date(staff?.join_date).getDate() === todayDate && new Date(staff?.join_date).getMonth() === todayMonth) {
                    const years = new Date().getFullYear() - new Date(staff?.join_date).getFullYear()
                    if (years > 0) {
                        joinNames.push(`${staff?.full_name} has completed ${years} year(s)`)
                    }
                }

                return staff
            })
        }

        setBirthList(birthNames)
        setJoinList(joinNames)
    }, [data])

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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '10px 0 0 0' }}>
                {birthList?.length > 0 ? <AlertBox title={'Birth Day Alert!'} messages={<span>Today is the birthday of {joinStringsFromArray(birthList)}</span>} /> : ""}
                {joinList?.length > 0 ? <AlertBox title={'Work Anniversary Alert!'} messages={<span>{joinStringsFromArray(joinList)} with our company.</span>} /> : ''}
            </div>
            <div className="table-div">
                {data?.[0] ? <>
                    <TableFilter srlNo={true} topRight={<div className='button-div'>
                        {user?.allowed_origins?.includes('ttcr_stfAcc_write') && <SingleButton name={'Staff'} stIcon={<FaPlus />}
                            classNames={'btn-tertiary'} onClick={() => navigate('/admin/staff-list/account/new')} />}
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
                                            {value?.full_name} {value?.pro_account && <span className='pro-icon' title='Pro account badge'><RiShieldStarLine /></span>}
                                            <br></br> <small>{value?.sid}</small>
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