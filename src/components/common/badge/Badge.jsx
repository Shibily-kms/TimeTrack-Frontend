import React from 'react'
import './badge.scss'

const Badge = ({ text, icon, className, title, styles }) => {
    return (
        <div title={title} className={`badge-div ${className}`} style={{ ...styles }}> {icon}{text}</div >
    )
}

export default Badge