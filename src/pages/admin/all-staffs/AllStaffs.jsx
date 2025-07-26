import React, { useEffect, useState } from 'react'
import './all-staffs.scss'
import SpinWithMessage from '../../../components/common/spinners/SpinWithMessage'
import { ttCv2Axios } from '../../../config/axios'
import { getTimeFromSecond } from '../../../assets/javascript/date-helper'
import { setAdminActivePage, toast } from '../../../redux/features/user/systemSlice'
import { useDispatch, useSelector } from 'react-redux'
import Modal from '../../../components/common/modal/Modal'
import SingleButton from '../../../components/common/buttons/SingleButton'
import { useNavigate } from 'react-router-dom'
import { FaCheck, FaPlus, FaUsers } from "react-icons/fa6";
import { IoMdSettings } from 'react-icons/io'
import CommonUpdate from '../../../components/admin/common-update/CommonUpdate'
import AlertBox from '../../../components/common/alert/AlertBox'
import { joinStringsFromArray } from '../../../assets/javascript/find-helpers'
import TanStackTable from '../../../components/common/table/TanStackTable'



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

    const columns = [
        { header: 'Index', accessorKey: 'Index', enableHiding: false, enableSorting: false, },
        { header: 'Full Name', accessorKey: 'Full Name', enableHiding: false, },
        { header: 'SID', accessorKey: 'SID' },
        { header: 'Designation', accessorKey: 'Designation' },
        { header: 'Mobile No', accessorKey: 'Mobile No', enableHiding: false, },
        { header: 'Work mode', accessorKey: 'Work mode' },
        { header: 'Employee type', accessorKey: 'Employee type' },
        { header: 'DOB', accessorKey: 'dob' },
        { header: 'Join date', accessorKey: 'join_date' },
        { header: 'Working Time', accessorKey: 'Working Time' },
        { header: 'Salary', accessorKey: 'Salary' },

    ];

    const getActiveStaffList = () => {
        ttCv2Axios.get('/worker/account/list').then((response) => {
            setData(response.data?.map((staff, index) => ({
                Index: index + 1,
                _id: staff?._id,
                'Full Name': `${staff?.full_name} ${staff?.pro_account ? '✪' : ''}` || '-',
                SID: staff?.sid || '-',
                Designation: staff?.designation?.designation || '-',
                'Mobile No': `${staff?.primary_number?.country_code} ${staff?.primary_number?.number}`,
                'Work mode': staff?.work_mode || '-',
                'Employee type': staff?.e_type || '-',
                'Working Time': `${getTimeFromSecond(staff?.current_working_time || 0) || '0m'} x ${staff?.current_working_days}d = ${getTimeFromSecond((staff?.current_working_time || 0) * staff?.current_working_days) || '0m'}`,
                Salary: `₹ ${staff?.current_salary || 0}`,
                join_date: staff?.join_date,
                dob: staff?.dob,
                pro_account: staff?.pro_account,
                _rowStyle: { cursor: 'Pointer' },
                _onClick: () => navigate(`/admin/staff-list/${staff?._id}/profile`),
            })))
            setLoading('')
        }).catch((error) => {
            setLoading('')
            dispatch(toast.push.error({ message: error.message }))
        })
    }

    const getAllStaffList = () => {
        ttCv2Axios.get('/worker/account/list?all=yes').then((response) => {
            setData(response.data?.map((staff, index) => ({
                Index: index + 1,
                _id: staff?._id,
                'Full Name': `${staff?.full_name} ${staff?.pro_account ? '✪' : ''}` || '-',
                SID: staff?.sid || '-',
                Designation: staff?.designation?.designation || '-',
                'Mobile No': `${staff?.primary_number?.country_code} ${staff?.primary_number?.number}`,
                'Work mode': staff?.work_mode || '-',
                'Employee type': staff?.e_type || '-',
                'Working Time': `${getTimeFromSecond(staff?.current_working_time || 0) || '0m'} x ${staff?.current_working_days}d = ${getTimeFromSecond((staff?.current_working_time || 0) * staff?.current_working_days) || '0m'}`,
                Salary: `₹ ${staff?.current_salary || 0}`,
                join_date: staff?.join_date,
                dob: staff?.dob,
                pro_account: staff?.pro_account,
                _rowClassName: staff?.delete ? 'danger-row' : "",
                _rowStyle: { cursor: 'Pointer' },
                _onClick: () => navigate(`/admin/staff-list/${staff?._id}/profile`),
            })))
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
                    birthNames.push(staff?.['Full Name'])
                }

                if (new Date(staff?.join_date).getDate() === todayDate && new Date(staff?.join_date).getMonth() === todayMonth) {
                    const years = new Date().getFullYear() - new Date(staff?.join_date).getFullYear()
                    if (years > 0) {
                        joinNames.push(`${staff?.['Full Name']} has completed ${years} year(s)`)
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
                    <TanStackTable
                        columns={columns}
                        data={data}
                        rowCheckBox={false}
                        columnVisible={{ 'Work mode': false, 'Employee type': false, 'dob': false, join_date: false }}
                        topComponents={
                            <div className='button-div'>
                                {user?.allowed_origins?.includes('ttcr_stfAcc_write') && <SingleButton name={'Staff'} stIcon={<FaPlus />}
                                    classNames={'btn-tertiary'} onClick={() => navigate('/admin/staff-list/account/new')} />}
                                <SingleButton name={'All Staffs'} stIcon={allStaff && <FaCheck />}
                                    classNames={allStaff ? 'btn-primary' : 'btn-gray'} onClick={handleAllButton} loading={loading === 'listing'} />
                            </div>
                        }
                    />
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