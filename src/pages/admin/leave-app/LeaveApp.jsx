import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setAdminActivePage, toast } from '../../../redux/features/user/systemSlice'
import { adminAxios } from '../../../config/axios';
import Modal from '../../../components/common/modal/Modal';
import Badge from '../../../components/common/badge/Badge';
import SingleButton from '../../../components/common/buttons/SingleButton';
import SpinWithMessage from '../../../components/common/spinners/SpinWithMessage';
import TableFilter from '../../../components/common/table-filter/TableFilter';
import LeaveAction from '../../../components/admin/leave-action/LeaveAction';

const LeaveApp = ({ setPageHead }) => {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState('fetch')
    const [data, setData] = useState([])
    const [modal, setModal] = useState({ status: false })
    const { admin } = useSelector((state) => state.adminAuth)

    const handleActionLeave = (singleData) => {
        setModal({ status: true, title: "Leave Action", content: <LeaveAction data={singleData} setData={setData} setModal={setModal} /> })
    }

    useEffect(() => {
        setPageHead({ title: 'Leave Letters' })
        dispatch(setAdminActivePage('leave-letters'))

        adminAxios.get('/leave-application').then((response) => {
            setLoading('')
            setData(response?.data)
        }).catch((error) => {
            dispatch(toast.push.success({ message: 'Cancelled' }))
            setLoading('')
        })
    }, [])


    return (
        <div className="leave-app-page-div">
            <Modal modal={modal} setModal={setModal} />
            {loading === 'fetch'
                ? <SpinWithMessage load height={'300px'} />
                : <TableFilter srlNo={true}>
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>#Token ID</th>
                                <th>Full name</th>
                                <th>Days</th>
                                <th>Status</th>
                                {admin?.pro_admin && <th>Control</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {data?.map((item) => <tr >
                                <td>{new Date(item.reg_date_time).toDateString()}</td>
                                <td>{item?.token_id}</td>
                                <td>{item?.full_name}</td>
                                <td> {item?.apply_leave?.days} Days</td>
                                <td ><Badge className={item.leave_status === 'Pending'
                                    ? 'gray-fill'
                                    : item.leave_status === 'Approved'
                                        ? 'success-fill'
                                        : 'error-fill'} text={`${item?.self_cancel ? 'Self' : ""} ${item?.leave_status}`} /></td>
                                {admin?.pro_admin && <td>
                                    <div className="button-div" style={{ display: 'flex', justifyContent: 'center' }}>
                                        <SingleButton title={'Copy Link'} name={'Action'}
                                            onClick={() => handleActionLeave(item)} />
                                    </div>
                                </td>}
                            </tr>)}
                        </tbody>
                    </table>
                </TableFilter>}
        </div>
    )
}

export default LeaveApp