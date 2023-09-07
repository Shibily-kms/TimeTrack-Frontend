import React, { useState } from 'react'
import Header from '../../../components/admin/header/Header'
import TopBar from '../../../components/admin/staff-work/TopBar'
import './date-basie.scss'
import DateWorkAnalyze from '../../../components/admin/staff-work/DateWorkAnalyze'
import ViewModal from '../../../components/admin/staff-work/ViewModal'
import EditWorkData from '../../../components/admin/staff-work/EditWorkData'

function DateBasie() {
    const [viewModal, setViewModal] = useState({ open: false })
    const [editModal, setEditModal] = useState({ open: false })
    const [selected, setSelected] = useState({})

    const closeViewModal = () => {
        setViewModal({ open: false })
        setEditModal({ open: false })
    }

    const openViewModal = (data, info, type) => {
        setViewModal({ data, info, type, open: true })
    }
    const openEditModal = (data) => {
        setEditModal({ data, open: true })
    }

    return (
        <div className='staff-works'>
            <div className='main'>
                <div className="header-div">
                    <Header />
                </div>
                <div >
                    <TopBar oneDay={selected} />
                </div>
                <div >
                    <DateWorkAnalyze openModal={openViewModal} openEditModal={openEditModal} selected={selected} setSelected={setSelected} />
                </div>
            </div>
            {viewModal.open &&
                <div className="modal-border-div">
                    <div className="border">
                        <div className="modal-shadow" onClick={() => closeViewModal()}></div>
                        <div className="modal-place-div">
                            <ViewModal data={viewModal.data} info={viewModal.info}
                                type={viewModal.type} closeModal={closeViewModal} />
                        </div>
                    </div>
                </div>
            }
            {editModal.open &&
                <div className="modal-border-div">
                    <div className="border">
                        <div className="modal-shadow" onClick={() => closeViewModal()}></div>
                        <div className="modal-div">
                            <EditWorkData data={editModal.data} closeModal={closeViewModal} />
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default DateBasie