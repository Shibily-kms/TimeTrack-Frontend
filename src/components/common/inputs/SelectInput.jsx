import React, { useState } from 'react'
import './normal-input.scss'
import NormalInput from './NormalInput'


function SelectInput({
    label = 'Label',
    name = 'name',
    id,
    onChangeFun,
    colorCode,
    isRequired = true,
    values = [],
    firstOption = null
}) {

    const [text, setText] = useState('')
    const [ifOther, setIfOther] = useState(false)


    const handleSelect = (e) => {
        setIfOther(e.target.value === 'other')
        onChangeFun(e)
        if (e.target.value !== 'other') {
            setText('')
        }
    }

    const handleOther = (e) => {
        setText(e.target.value)
        onChangeFun(e)
    }


    return (
        <div className='input-model-div select-input'>
            <div>
                <select required={isRequired} onChange={handleSelect} name={name} id={id || name}>
                    {firstOption && <option value={firstOption.value || ''}>{firstOption.option}</option>}
                    {values?.map((option, index) => <option selected={option?.selected || ifOther} key={index} value={option.value || ''}>{option.option}</option>)}
                </select>
                <label htmlFor={id || name}>{label}</label>
            </div>
            {ifOther && <NormalInput label='Type other' name={name} id={name + 'other'} onChangeFun={handleOther} value={text} />}
        </div>
    )
}

export default SelectInput