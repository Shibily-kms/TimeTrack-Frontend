import React from 'react'
import './modal.scss'
import { GrClose } from "react-icons/gr";

function Modal({ modal = { content: null, title: null, status: false, width: '400px' }, setModal }) {
    return (
        <>
            <div div className={modal?.status ? 'modal-div' : 'modal-hide-div'} >
                <div className="modal-boarder">
                    <div className="modal-shadow-div" onClick={() => setModal({ status: false })}></div>
                    <div className="modal-content" style={{ width: modal?.width ? modal.width : '400px' }}>
                        <div className="modal-top">
                            <div className="left">
                                <h4>{modal?.title}</h4>
                            </div>
                            <div className="right" onClick={() => setModal({ status: false })}>
                                <span className='close-icon'><GrClose /></span>
                            </div>
                        </div>
                        <div className="model-center">
                            <div className="model-center-content">
                                {modal?.content}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default Modal