import React, { useEffect, useState } from 'react'
import './style.scss'
import { adminAxios } from '../../../config/axios'
import { setAdminActivePage, toast } from '../../../redux/features/user/systemSlice'
import { useDispatch } from 'react-redux'
import CreateQr from '../../../components/admin/create-qr/CreateQr'
import SingleButton from '../../../components/common/buttons/SingleButton'
import { FaPlus } from "react-icons/fa6";
import Modal from '../../../components/common/modal/Modal'
import { YYYYMMDDFormat } from '../../../assets/javascript/date-helper'
import { GoTrash } from 'react-icons/go'
import { IoIosLink } from 'react-icons/io'
import { HiDotsHorizontal } from "react-icons/hi";
import Badge from '../../../components/common/badge/Badge'
import { FaInfoCircle } from 'react-icons/fa'
import { baseUrl } from '../../../config/axios'
import SpinWithMessage from '../../../components/common/spinners/SpinWithMessage'
import TanStackTable from '../../../components/common/table/TanStackTable'
import DropDown from '../../../components/common/drop-down/DropDown'


const QrGenerator = ({ setPageHead }) => {
    const dispatch = useDispatch();
    const [qrList, setQrList] = useState([])
    const [modal, setModal] = useState({})
    const [loading, setLoading] = useState(true)

    const columns = [
        { header: 'QR Id', accessorKey: 'QR Id', enableHiding: false },
        { header: 'QR Name', accessorKey: 'QR Name', enableHiding: false, },
        { header: 'Last Used', accessorKey: 'Last Used' },
        { header: 'Used Count', accessorKey: 'Used Count' },
        {
            header: 'Control',
            cell: ({ row }) => (
                <div className="button-div">
                    {(row?.original?.delete || row?.original?.expire_date < YYYYMMDDFormat(new Date()))
                        ? row?.original?.delete ? <Badge text={'Deleted'} icon={<FaInfoCircle />} /> : <Badge text={'Expired'} icon={<FaInfoCircle />} /> : <>
                            <DropDown
                                dropButton={{
                                    stIcon: <HiDotsHorizontal />,
                                    className: 'icon-only btn-secondary'
                                }}
                                items={[
                                    {
                                        items: [
                                            { label: 'Copy link', icon: <IoIosLink />, onClick: () => handleCopy(row?.original) },
                                            { label: 'Delete', theme: 'danger', icon: <GoTrash />, onClick: () => handleDelete(row?.original?._id) },
                                        ],
                                    }
                                ]}
                            />
                        </>}
                </div>
            ),
            enableSorting: false,
            enableColumnFilter: false,
        },
    ];

    const handleDelete = (id) => {

        const ask = window.confirm('Are you delete this Qr Code ?')
        if (ask) {
            adminAxios.delete(`/qr-code?_id=${id}`).then(() => {
                setQrList((state) => state.map((item) => {
                    if (item._id === id) {
                        return {
                            ...item,
                            delete: new Date(),
                            _rowStyle: { backgroundColor: '#d3003830', color: "#d30038" }
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

        const qrCodeLink = `${baseUrl}:3000/qr-code/?qrId=${qrData?.['QR Id']}&type=viewOnly`

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
                .catch(() => dispatch(toast.push.error({ message: 'Try again!' })));
        }
    }

    useEffect(() => {
        setPageHead({ title: "QR Generator" })
        dispatch(setAdminActivePage('qr-generator'))

        setLoading(true)
        adminAxios.get('/qr-code/list?type=punch').then((response) => {
            setQrList(response?.data?.map((qr, index) => ({
                _id: qr?._id,
                'QR Id': qr?.qrId,
                'QR Name': qr?.name,
                'Last Used': qr?.last_used ? new Date(qr?.last_used).toDateString() : 'Not used',
                'Used Count': qr.used_count,
                delete: qr?.delete,
                disableCheckbox: (qr?.delete || qr?.expire_date < YYYYMMDDFormat(new Date())) || false,
                expire_date: qr?.expire_date,
                _rowStyle: (qr?.delete || qr?.expire_date < YYYYMMDDFormat(new Date())) ? { backgroundColor: '#d3003830', color: "#d30038" } : {}
            })))
            setLoading(false)
        }).catch((error) => {
            dispatch(toast.push.error({ message: error?.message }))
            setLoading(false)
        })

        // eslint-disable-next-line
    }, [])

    return (
        <div className="qr-generator-page-div">
            <Modal modal={modal} setModal={setModal} />
            {loading
                ? <SpinWithMessage load height={'300px'} />
                : <TanStackTable
                    columns={columns}
                    data={qrList}
                    topComponents={<SingleButton name={'QR Code'} stIcon={<FaPlus />} classNames={'btn-tertiary'}
                        onClick={() => setModal({ status: true, title: 'Create QR Code', content: <CreateQr setModal={setModal} setQrList={setQrList} /> })} />}
                />}
        </div >
    )
}

export default QrGenerator