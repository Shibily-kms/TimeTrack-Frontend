import React, { useEffect, useState } from 'react'
import './pro-accounts.scss'
import SingleButton from '../../../components/common/buttons/SingleButton'
import Modal from '../../../components/common/modal/Modal'
import TableFilter from '../../../components/common/table-filter/TableFilter'
import AddProAccount from '../../../components/admin/add-pro/AddProAccount'
import { FaUserPlus } from "react-icons/fa";
import { RiShieldStarLine } from "react-icons/ri";
import { ttCv2Axios } from '../../../config/axios'
import SpinWithMessage from '../../../components/common/spinners/SpinWithMessage'
import { useDispatch } from 'react-redux'
import { toast } from '../../../redux/features/user/systemSlice'
import { useNavigate } from 'react-router-dom'


const ProAccounts = ({ setPageHead }) => {
    const navigate = useNavigate()
    const [modal, setModal] = useState({ status: false })
    const dispatch = useDispatch()
    const [data, setData] = useState([])
    const [loading, setLoading] = useState('fetch')

    const handleOpenModal = () => {
        setModal({ status: true, title: 'Add Pro Account', content: <AddProAccount setModal={setModal} data={data} setData={setData} /> })
    }

    const handleDeactivate = (staff, origin) => {

        const ask = window.confirm("Are you ready for deactivate ?")
        if (ask) {
            setLoading(`deactivate${staff?.acc_id}${origin?.origin}`)
            ttCv2Axios.delete(`/worker/pro-account/deactivate?worker_id=${staff.acc_id}&origin=${origin?.origin}`).then(() => {
                setLoading('')
                setData((prevData) =>
                    prevData.map((a) => {
                        if (a.acc_id === staff.acc_id) {
                            return {
                                ...a,
                                pro_account: a.pro_account.filter((b) => b.origin !== origin.origin),
                            }
                        }
                        return a
                    })
                )
            }).catch((error) => {
                setLoading('')
                dispatch(toast.push.error({ message: error?.message }))
            })
        }

    }

    useEffect(() => {
        setPageHead({ title: "Pro Accounts", desc: 'Pro accounts list and assign new accounts' })


        ttCv2Axios.get('/worker/pro-account/list').then((response) => {
            setData(response?.data || [])
            setLoading('')
        }).catch((error) => {
            setLoading('')
            dispatch(toast.push.error({ message: error?.message }))
        })

        // eslint-disable-next-line
    }, [])


    return (
        <div className="pro-accounts-page-div">
            <Modal modal={modal} setModal={setModal} />
            <div className="accounts">
                {loading === 'fetch' || !data?.[0]
                    ? <SpinWithMessage load={loading === 'fetch'} height={'400px'} icon={<RiShieldStarLine />}
                        message='Create Pro account using below button' bottomContent={<div style={{ display: 'flex', justifyContent: 'center' }}>
                            <SingleButton stIcon={<FaUserPlus />} name={'Pro account'}
                                classNames={'btn-tertiary'} onClick={handleOpenModal} />
                        </div>} />
                    : <TableFilter srlNo={true} topRight={<SingleButton stIcon={<FaUserPlus />} name={'Pro account'}
                        classNames={'btn-tertiary'} onClick={handleOpenModal} />}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Full name</th>
                                    <th>Area</th>
                                    <th>Promoted Date</th>
                                    <th>Control</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.flatMap((staff) =>
                                    staff?.pro_account?.map((origin, i) => (
                                        <tr key={`${staff.acc_id}-${i}`}>
                                            <td style={{ cursor: 'pointer' }} onClick={() => navigate(`/admin/staff-list/${staff.acc_id}/profile`)}>
                                                {staff.full_name}</td>
                                            <td style={{ cursor: 'pointer' }} onClick={() => navigate(`/admin/staff-list/${staff.acc_id}/profile`)}>
                                                {String(origin.origin)?.toUpperCase()}</td>
                                            <td style={{ cursor: 'pointer' }} onClick={() => navigate(`/admin/staff-list/${staff.acc_id}/profile`)}>
                                                {new Date(origin.assign_date).toDateString()}</td>
                                            <td>
                                                <div className='buttons' >
                                                    <SingleButton name={'Deactivate'} title='Deactivate' classNames={'btn-danger '}
                                                        onClick={() => handleDeactivate(staff, origin)}
                                                        loading={loading === `deactivate${staff?.acc_id}${origin?.origin}`} />
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </TableFilter>}

            </div>
        </div>
    )
}

export default ProAccounts