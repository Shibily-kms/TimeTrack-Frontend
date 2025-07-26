import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setAdminActivePage, toast } from '../../../redux/features/user/systemSlice'
import { ttCv2Axios } from '../../../config/axios';
import Modal from '../../../components/common/modal/Modal';
import Badge from '../../../components/common/badge/Badge';
import SingleButton from '../../../components/common/buttons/SingleButton';
import SpinWithMessage from '../../../components/common/spinners/SpinWithMessage';
import TanStackTable from '../../../components/common/table/TanStackTable';
import LeaveAction from '../../../components/admin/leave-action/LeaveAction';
import { readTheLetters } from '../../../assets/javascript/l2-helper';
import { RiFileList3Fill } from 'react-icons/ri';

const LeaveApp = ({ setPageHead }) => {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState('fetch')
    const [data, setData] = useState([])
    const [modal, setModal] = useState({ status: false })
    const { user } = useSelector((state) => state.userAuth)

    const columns = [
        { header: 'Token ID', accessorKey: 'Token Id', enableHiding: false },
        { header: 'Reg date', accessorKey: 'Reg date', enableHiding: false, },
        { header: 'Reg by', accessorKey: 'Reg by' },
        { header: 'Req Days', accessorKey: 'Req Days' },
        { header: 'Apr Days', accessorKey: 'Apr Days' },
        { header: 'Reason', accessorKey: 'Reason' },
        { header: 'Comment', accessorKey: 'Comment' },
        { header: 'Status', accessorKey: 'Status' },
        {
            header: 'Control',
            cell: ({ row }) => (
                <div className="button-div" style={{ display: 'flex', justifyContent: 'center' }}>
                    <SingleButton title={'Copy Link'} name={user?.allowed_origins.includes('ttcr_l2_write') ? 'Action' : 'View'}
                        onClick={() => setModal({
                            status: true,
                            title: row?.original?.['Token Id'],
                            content: <LeaveAction singleData={row?.original} setData={setData} setModal={setModal} />
                        })} />
                </div>
            ),
            enableSorting: false,
            enableColumnFilter: false,
        },
    ];

    useEffect(() => {
        setPageHead({ title: 'Leave Letters', desc: 'Last 15 days actions and current pending applications' })
        dispatch(setAdminActivePage('leave-letters'))

        ttCv2Axios.get(`/L2/leaves?status=active`).then((response) => {
            setLoading('')
            const letters = readTheLetters(response?.data?.list || [])

            setData(letters?.map((letter, index) => ({
                _id: letter?._id,
                'Token Id': letter?.token_id || '-',
                'Reg date': new Date(letter?.reg_date_time).toDateString() || '-',
                'Reg by': letter?.full_name || '-',
                'Req Days': letter?.requested_count >= 1 ? `${letter?.requested_count} Day(s)` : `${letter?.requested_half === 1 ? 'Before noon' : 'After noon'}`,
                'Apr Days': letter?.leave_status === 'Approved'
                    ? letter?.approved_count >= 1 ? `${letter?.approved_count} Day(s)` : `${letter?.approved_half === 1 ? 'Before noon' : 'After noon'}`
                    : '-',
                'Status': letter?.leave_status || '-',
                'Reason': letter?.leave_reason || '-',
                'Comment': letter?.comment || '-',
                'approved_days': letter?.approved_days || [],
                'edited': letter?.edited || false,
                'self_action': letter?.self_action,
                'action_by': letter?.action_by,
                'action_date_time': letter?.action_date_time,
                requested_days: letter?.requested_days,
                staff_id: letter?.staff_id,
                _cellStyle: {
                    Status: letter?.leave_status === 'Pending' ? { backgroundColor: '#73737340' }
                        : letter?.leave_status === 'Approved' ? { color: '#007936', backgroundColor: '#00793640' }
                            : { backgroundColor: '#d3003840', color: '#d30038' }
                },
            })))
        }).catch((error) => {
            dispatch(toast.push.error({ message: error?.message }))
            setLoading('')
        })
        // eslint-disable-next-line
    }, [])


    return (
        <div className="leave-app-page-div">
            <Modal modal={modal} setModal={setModal} />
            {loading === 'fetch' || !data?.[0]
                ? <SpinWithMessage load={loading === 'fetch'} height={'400px'} icon={<RiFileList3Fill />} message='No new leave letter request' />
                : <TanStackTable
                    columns={columns}
                    data={data}
                    rowCheckBox={false}
                    columnVisible={{ Reason: false, Comment: false, 'Apr Days': false }}
                />}
        </div>
    )
}

export default LeaveApp