import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setAdminActivePage, toast } from '../../../redux/features/user/systemSlice'
import { adminAxios, leaveAxios, ttCv2Axios } from '../../../config/axios';
import Modal from '../../../components/common/modal/Modal';
import Badge from '../../../components/common/badge/Badge';
import SingleButton from '../../../components/common/buttons/SingleButton';
import SpinWithMessage from '../../../components/common/spinners/SpinWithMessage';
import TableFilter from '../../../components/common/table-filter/TableFilter';
import LeaveAction from '../../../components/admin/leave-action/LeaveAction';
import { readTheLetters } from '../../../assets/javascript/l2-helper';
import { RiFileList3Fill } from 'react-icons/ri';

const LeaveApp = ({ setPageHead }) => {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState('fetch')
    const [data, setData] = useState([])
    const [modal, setModal] = useState({ status: false })
    const { user } = useSelector((state) => state.userAuth)

    useEffect(() => {
        setPageHead({ title: 'Leave Letters', desc: 'Last 15 days actions and current pending applications' })
        dispatch(setAdminActivePage('leave-letters'))

        ttCv2Axios.get(`/L2/leaves?status=active`).then((response) => {
            setLoading('')
            const letters = readTheLetters(response?.data?.list || [])
            setData(letters)
        }).catch((error) => {
            dispatch(toast.push.success({ message: error?.message }))
            setLoading('')
        })
    }, [])


    return (
        <div className="leave-app-page-div">
            <Modal modal={modal} setModal={setModal} />
            {loading === 'fetch' || !data?.[0]
                ? <SpinWithMessage load={loading === 'fetch'} height={'400px'} icon={<RiFileList3Fill />} message='No new leave letter request' />
                : <TableFilter >
                    <table>
                        <thead>
                            <tr>
                                <th>#Token ID</th>
                                <th>Reg date & By</th>
                                <th>Req. Days</th>
                                <th>Status</th>
                                <th>Control</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.map((item) => <tr key={item?.token_id}>
                                <td>{item?.token_id}</td>
                                <td>{new Date(item.reg_date_time).toDateString()}<br></br>{item?.full_name}</td>
                                <td> {item?.requested_count >= 1
                                    ? `${item?.requested_count} Day(s)`
                                    : `${item?.requested_half === 1 ? 'Before noon' : 'After noon'}`}</td>
                                <td ><Badge
                                    className={
                                        item?.leave_status === 'Pending' ? 'gray-fill'
                                            : item?.leave_status === 'Approved' ? 'success-fill'
                                                : 'error-fill'
                                    }
                                    text={`${item?.self_cancel ? 'Self' : ""} 
                                    ${item?.edited ? 'Modified & approved' : item?.leave_status}`} /></td>
                                <td>
                                    <div className="button-div" style={{ display: 'flex', justifyContent: 'center' }}>
                                        <SingleButton title={'Copy Link'} name={user?.allowed_origins.includes('ttcr_l2_write') ? 'Action' : 'View'}
                                            onClick={() => setModal({
                                                status: true,
                                                title: item?.token_id,
                                                content: <LeaveAction singleData={item} setData={setData} setModal={setModal} />
                                            })} />
                                    </div>
                                </td>
                            </tr>)}
                        </tbody>
                    </table>
                </TableFilter>}
        </div>
    )
}

export default LeaveApp