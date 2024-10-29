import React, { useEffect, useState } from 'react'
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
    pattern,
    ref,
    onBlur,
    onFocus,
    autoFocus = false,
    minLength,
    maxLength
}) {
    const [inputType, setInputType] = useState('')

    useEffect(() => {
        if (inputType) {
            setInputType(type)
        }
        console.log(onBlur, onFocus)
        // eslint-disable-next-line
    }, [type])

    return (
        <div className='input-model-div normal-input'>
            <div>
                <input
                    ref={ref}
                    type={inputType || 'text'}
                    name={name}
                    id={id || name}
                    value={value}
                    placeholder={' ' + placeholder}
                    required={isRequired}
                    onChange={onChangeFun}
                    min={min}
                    max={max}
                    step={step}
                    onFocus={() => onFocus ? onFocus() : setInputType(type)}
                    onBlur={() => onBlur ? onBlur() : !value ? setInputType('text') : ''}
                    pattern={pattern}
                    autoFocus={autoFocus}
                    minLength={minLength}
                    maxLength={maxLength}
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