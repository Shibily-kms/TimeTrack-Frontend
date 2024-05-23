import React from 'react'
import './radio.scss'

const RadioInput = ({
    label, name, checked, onChangeFun, value, isRequired = true
}) => {
    return (
        <div className="radio-input-div">
            <label>
                <input type="radio" name={name} checked={checked} onChange={onChangeFun} value={value} required={isRequired} />
                <span>{label}</span>
            </label>
        </div>
    )
}

export default RadioInput