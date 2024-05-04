import React from 'react'
import './badge.scss'

const Badge = ({ text, icon, className, title, styles }) => {
    return (
        <span title={title} className={`badge-div ${className}`} style={{ ...styles }}> {icon}{text}</span >
    )
}

export default Badge