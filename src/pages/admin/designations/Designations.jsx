import React, { useEffect, useState } from 'react'
import AddDesignation from '../../../components/admin/models/Add_designation'
import EditDesignation from '../../../components/admin/models/EditDesignation'
import SpinWithMessage from '../../../components/common/spinners/SpinWithMessage'
import TableFilter from '../../../components/common/table-filter/TableFilter'
import SingleButton from '../../../components/common/buttons/SingleButton'
import Modal from '../../../components/common/modal/Modal'
import { adminAxios } from '../../../config/axios'
import { IoTrashBin } from 'react-icons/io5'
import { FaPlus } from "react-icons/fa6";
import { GrEdit } from 'react-icons/gr'
import { GoTrash } from "react-icons/go";
import { setAdminActivePage, toast } from '../../../redux/features/user/systemSlice'
import { useDispatch, useSelector } from 'react-redux'
import TanStackTable from '../../../components/common/table/TanStackTable'
import DropDown from '../../../components/common/drop-down/DropDown'
import { HiDotsHorizontal } from 'react-icons/hi'

function Designations({ setPageHead }) {
    const dispatch = useDispatch()
    const [data, setData] = useState([])
    const [modal, setModal] = useState(null)
    const [loading, setLoading] = useState('fetch')
    const { user } = useSelector((state) => state.userAuth)

    useEffect(() => {
        setPageHead({ title: 'Designation List' })
        dispatch(setAdminActivePage('designation-list'))

        setLoading('fetch')
        adminAxios.get('/designations').then((response) => {
            setLoading('')
            setData(response?.data?.map((designation, index) => ({
                'Idx No': index + 1,
                Designation: designation?.designation,
                designation_id: designation?._id,
                'Staff Count': designation?.name?.length || 0,
            })) || [])
        }).catch((error) => {
            dispatch(toast.push.error({ message: error.message }))
        })

        // eslint-disable-next-line
    }, [])

    const openModal = (title, content) => {
        setModal({ status: true, title: title, content })
    }

    const handleDelete = (id) => {
        let confirm = window.confirm('Are you delete this designation ?')
        if (confirm) {
            setLoading(id)
            adminAxios.delete(`/designation?id=${id}`).then(() => {
                setData((state) => {
                    return state.filter(obj => obj.designation_id !== id)
                })
                setLoading('')
            }).catch((error) => {
                dispatch(toast.push.error({ message: error.message }))
                setLoading('')
            })
        }
    }

    const columns = [
        { header: 'Idx No', accessorKey: 'Idx No', enableHiding: false, enableSorting: false },
        { header: 'Designation', accessorKey: 'Designation', enableHiding: false, },
        { header: 'Staff Count', accessorKey: 'Staff Count' },
        ...(user?.allowed_origins?.some(access => ['ttcr_pro_write'].includes(access)) ? [{
            header: 'Control',
            cell: ({ row }) => (<div className="button-div" style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                <DropDown
                    dropButton={{
                        stIcon: <HiDotsHorizontal />,
                        className: 'icon-only btn-secondary'
                    }}
                    items={[
                        {
                            items: [
                                {
                                    label: 'Edit', icon: <GrEdit />,
                                    onClick: () => openModal('Edit Designation', <EditDesignation setModal={setModal} setData={setData} editData={row.original} />)
                                },
                                // ! Edit not setup.  //? Edit not setup
                                ...(row.original?.['Staff Count'] <= 0
                                    ? [{ label: 'Delete', theme: 'danger', icon: <GoTrash />, onClick: () => handleDelete(row.original?.designation_id) }]
                                    : []),
                            ],
                        }
                    ]}
                />
            </div>),
            enableSorting: false,
            enableColumnFilter: false,
        }] : []),
    ];


    return (
        <div className='designationList-page-div'>
            <Modal modal={modal} setModal={setModal} />
            <div className="table-div">
                {data?.[0] ?
                    <TanStackTable
                        columns={columns}
                        data={data}
                        topComponents={user?.allowed_origins?.some(access => ['ttcr_pro_write'].includes(access)) &&
                            <SingleButton name={'Designation'} stIcon={<FaPlus />} classNames={'md btn-tertiary'}
                                onClick={() => openModal('Create Designation', <AddDesignation setData={setData} setModel={setModal} />)} />}
                    />
                    : <SpinWithMessage load={loading === 'fetch'} height={'300px'} fullView
                        icon={<IoTrashBin />} message={'Empty list'} />}
            </div>
        </div >
    )
}

export default Designations