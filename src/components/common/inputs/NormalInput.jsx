import React, { useState } from 'react'
import './normal-input.scss'

function NormalInput({
    label = 'Label',
    name = 'name',
    id,
    type = 'text',
    onChangeFun,
    value = '',
    colorCode,
    placeholder = '',
    isRequired = true,
    min = null,
    max = null,
    step,
    rightIcon = null,
    rightIconAction = null,
    style,
    pattern
}) {
    const [inputType, setInputType] = useState('text')

    return (
        <div className='input-model-div normal-input'>
            <div>
                <input
                    type={inputType}
                    name={name}
                    id={id || name}
                    value={value}
                    placeholder={' ' + placeholder}
                    required={isRequired}
                    onChange={onChangeFun}
                    min={min}
                    max={max}
                    step={step}
                    onFocus={() => setInputType(type)}
                    onBlur={() => { if (!value) setInputType('text') }}
                    pattern={pattern}
                />
                <label htmlFor={id || name}>{label}{isRequired && <span>*</span>}</label>


                {rightIcon && <>
                    <div className="icon-div" onClick={rightIconAction}>
                        {rightIcon}
                    </div>
                </>}
            </div>
        </div>
    )
}

export default NormalInput