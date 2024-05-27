import React from 'react'
import './normal-input.scss'


const Select2Input = ({
    label = 'Label',
    name = 'name',
    id,
    type,
    onChangeFun,
    value = null,
    colorCode,
    placeholder,
    isRequired = true,
    options = []
}) => {
    return (
        <div className='input-model-div normal-input'>
            <div>
                <input list='options'
                    type={type ? type : "text"}
                    name={name}
                    id={id || name}
                    value={value}
                    placeholder={placeholder}
                    required={isRequired}
                    onChange={onChangeFun}
                />
                <datalist id="options">
                    {options?.[0] && options.map((option) => <option value={option}></option>)}
                </datalist>
                <label htmlFor={id || name}>{label}</label>
            </div>
        </div >
    )
}

export default Select2Input