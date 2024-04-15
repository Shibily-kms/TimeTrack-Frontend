import React from 'react'
import './badge.scss'

const Badge = ({ text, icon, className, styles }) => {
    return (
        <div className={`badge-div ${className}`} style={{ ...styles }}> {icon}{text}</div >
    )
}

export default Badge