import React from 'react'
import './alert-box.scss'
import { FaInfoCircle } from "react-icons/fa";

const AlertBox = ({ icon, title, messages, classNames, styles }) => {
    return (
        <div className={"alert-box-div alt-info " + classNames} style={styles}>
            <div className="icon-section">
                {icon ? icon : <FaInfoCircle />}
            </div>
            <div className="content-section">
                {title && <h4>{title}</h4>}
                {messages}
            </div>
        </div>
    )
}

export default AlertBox