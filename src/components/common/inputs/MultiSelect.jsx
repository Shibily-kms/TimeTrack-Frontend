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
    selectedValue = []
}) {

    const animatedComponents = makeAnimated();

    const customStyles = {
        option: (provided, state) => ({
            ...provided,
            fontSize: '13px'
        })
    };


    return (
        <div className='multi-select-model-div'>
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
                />
                <label htmlFor={id || name}>{label}</label>
            </div>
        </div>
    )
}

export default MultiSelect