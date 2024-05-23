import React from 'react'
import './radio.scss'

const CheckboxInput = ({
    label, name, checked, onChangeFun, value, isRequired = true
}) => {
    return (
        <div className="radio-input-div">
            <label>
                <input type="checkbox" name={name} checked={checked} onChange={onChangeFun} value={value} required={isRequired} />
                <span className='checkbox'>{label}</span>
            </label>
        </div>
    )
}

export default CheckboxInput