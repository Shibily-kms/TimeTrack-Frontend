import React from 'react'
import './badge.scss'

const Badge = ({ text, icon, className, title, styles, onClick }) => {
    return (
        <span title={title} className={`badge-div ${className}`} style={{ ...styles }} onClick={onClick}> {icon}{text}</span >
    )
}

export default Badge