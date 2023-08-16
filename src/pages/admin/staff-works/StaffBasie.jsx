import React, { useState } from 'react'
import './date-basie.scss'
import Header from '../../../components/admin/header/Header'
import TopBar from '../../../components/admin/staff-work/TopBar'
import StaffWorkAnalyze from '../../../components/admin/staff-work/StaffWorkAnalyze'
import ViewModal from '../../../components/admin/staff-work/ViewModal'


function StaffBasie() {
    const [viewModal, setViewModal] = useState({ open: false })
    const closeViewModal = () => {
        setViewModal(false)
    }

    const openViewModal = (data, info, type) => {
        setViewModal({ data, info, type, open: true })
    }
    return (
        <div className='staff-works'>
            <div className='main'>
                <div className="header-div">
                    <Header />
                </div>
                <div >
                    <TopBar staff={true} />
                </div>
                <div >
                    <StaffWorkAnalyze openModal={openViewModal} />
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
        </div>
    )
}

export default StaffBasie   