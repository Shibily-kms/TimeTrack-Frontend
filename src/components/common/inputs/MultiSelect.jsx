import React from 'react'
import './multi-select.scss'
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

function MultiSelect({
    label = 'Label',
    name = 'name',
    id,
    onChangeFun,
    values = [],
    selectedValue = [],
    placeholder = 'Select...'
}) {

    const animatedComponents = makeAnimated();

    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            border: '1px solid var(--border-primary)',
            borderRadius: '5px',
            boxShadow: state.isFocused ? '0 0 0 1px var(--border-tertiary)' : 'none',
            '&:hover': {
                borderColor: 'var(--border-tertiary)'
            },
            backgroundColor: 'var(--background-primary)',
            padding: '14px 8px 0px 8px',
            fontSize: '15px'
        }),
        option: (provided, state) => ({
            ...provided,
            fontSize: '13px'
        })
    };


    return (
        <div className='multi-model-div multi-select-model-div'>
            <div>
                <Select
                    isMulti
                    name={name}
                    components={animatedComponents}
                    options={values}
                    defaultValue={selectedValue}
                    className="basic-multi-select"
                    classNamePrefix="Choose"
                    onChange={onChangeFun}
                    id={id || name}
                    styles={customStyles}
                    placeholder={placeholder}
                />
                <label htmlFor={id || name}>{label}</label>
            </div>
        </div>
    )
}

export default MultiSelect