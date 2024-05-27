import React, { useEffect, useState } from 'react'
import { adminAxios } from '../../../config/axios'
import { setAdminActivePage, toast } from '../../../redux/features/user/systemSlice'
import { useDispatch } from 'react-redux'
import TableFilter from '../../../components/common/table-filter/TableFilter'
import CreateQr from '../../../components/admin/create-qr/CreateQr'
import SingleButton from '../../../components/common/buttons/SingleButton'
import { FaPlus } from "react-icons/fa6";
import Modal from '../../../components/common/modal/Modal'
import { YYYYMMDDFormat } from '../../../assets/javascript/date-helper'
import './style.scss'
import { GoTrash } from 'react-icons/go'
import { IoIosLink } from 'react-icons/io'
import Badge from '../../../components/common/badge/Badge'
import { FaInfoCircle } from 'react-icons/fa'
import { baseUrl } from '../../../config/axios'
import SpinWithMessage from '../../../components/common/spinners/SpinWithMessage'


const QrGenerator = ({ setPageHead }) => {
    const dispatch = useDispatch();
    const [qrList, setQrList] = useState([])
    const [modal, setModal] = useState({})
    const [loading, setLoading] = useState(true)

    const handleDelete = (id) => {

        const ask = window.confirm('Are you delete this Qr Code ?')
        if (ask) {
            adminAxios.delete(`/qr-code?_id=${id}`).then(() => {
                setQrList((state) => state.map((item) => {
                    if (item._id === id) {
                        return {
                            ...item,
                            delete: new Date()
                        }
                    }
                    return item
                }))
                dispatch(toast.push.success({ message: 'Deleted!' }))

            }).catch((err) => {
                dispatch(toast.push.error({ message: err?.message }))
            })
        }
    }

    const handleCopy = (qrData) => {

        const qrCodeLink = `${baseUrl}/qr-code/?qrId=${qrData?.qrId}&type=viewOnly`

        if (qrCodeLink) {

            if (!navigator.clipboard) {
                dispatch(toast.push.error({ message: `Clipboard functionality not supported in this browser!, Write from Below text.`, autoClose: false }));
                dispatch(toast.push.info({ message: `${qrCodeLink}`, autoClose: false }));

                return;
            }

            navigator.clipboard.writeText(qrCodeLink)
                .then(() => {
                    dispatch(toast.push.success({ message: 'QR Code link Copied!' }))
                })
                .catch(() => dispatch(toast.push.error({ message: 'Try agin!' })));



        }
    }

    useEffect(() => {
        setPageHead({ title: "QR Generator" })
        dispatch(setAdminActivePage('qr-generator'))

        setLoading(true)
        adminAxios.get('/qr-code/list?type=punch').then((response) => {
            setQrList(response?.data)
            setLoading(false)
        }).catch(() => {
            dispatch(toast.push.error({ message: 'Low Internet connection' }))
            setLoading(false)
        })

        // eslint-disable-next-line
    }, [])

    return (
        <div className="qr-generator-page-div">
            <Modal modal={modal} setModal={setModal} />
            {loading
                ? <SpinWithMessage load height={'300px'} />
                : <TableFilter topRight={<SingleButton name={'QR Code'} stIcon={<FaPlus />} classNames={'btn-tertiary'}
                    onClick={() => setModal({ status: true, title: 'Create QR Code', content: <CreateQr setModal={setModal} setQrList={setQrList} /> })} />}>
                    <table>
                        <thead>
                            <tr>
                                <th>QR Name & Id</th>
                                <th>Expire Date</th>
                                <th>Last used</th>
                                <th>Used Count</th>
                                <th>Control</th>
                            </tr>
                        </thead>
                        <tbody>
                            {qrList?.map((qr) => <tr className={(qr?.delete || qr?.expire_date < YYYYMMDDFormat(new Date())) ? 'deleted-item' : ""}>
                                <td>{qr.name}<br></br>{qr.qrId}</td>
                                <td style={{ textAlign: 'center' }}>{new Date(qr?.expire_date).toDateString()}
                                </td>
                                <td style={{ textAlign: 'center' }}>{qr?.last_used ? new Date(qr?.last_used).toDateString() : 'Not used'} <br></br>
                                    {qr?.last_used ? new Date(qr?.last_used).toLocaleTimeString() : ''}</td>
                                <td style={{ textAlign: 'center' }}>{qr.used_count}</td>
                                <td>
                                    <div className="button-div">
                                        {(qr?.delete || qr?.expire_date < YYYYMMDDFormat(new Date()))
                                            ? qr?.delete ? <Badge text={'Deleted'} icon={<FaInfoCircle />} /> : <Badge text={'Expired'} icon={<FaInfoCircle />} />
                                            : <>
                                                <SingleButton title={'Copy Link'} classNames={'icon-only'} stIcon={<IoIosLink />}
                                                    onClick={() => handleCopy(qr)} />
                                                <SingleButton title={'Delete'} classNames={'icon-only btn-danger'} stIcon={<GoTrash />}
                                                    onClick={() => handleDelete(qr?._id)} />
                                            </>}
                                    </div>
                                </td>
                            </tr>)}
                        </tbody>
                    </table>
                </TableFilter>}

        </div>
    )
}

export default QrGenerator