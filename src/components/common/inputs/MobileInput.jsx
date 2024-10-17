import React, { useEffect, useState } from 'react'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import './mobile-input.scss'

function MobileInput({
    label = 'Mobile number',
    name = 'mobile',
    id,
    type = 'number',
    onChangeFun,
    value = '',
    isRequired = true,
    rightIcon = null,
    rightIconAction = null,
    onlyCountries,
    enableSearch
}) {
    const [inputType, setInputType] = useState('')

    const handleOnChange = (value, data) => {
        let countryCode = null, mobile = null
        if (value.length > data.dialCode.length) {
            countryCode = data.dialCode
            const codeLength = data.dialCode.length;
            mobile = value.slice(codeLength);
        } else {
            countryCode = value
        }

        onChangeFun({ country_code: countryCode, number: mobile, name })
    };
    useEffect(() => {
        if (inputType) {
            setInputType(type)
        }

        // eslint-disable-next-line
    }, [type])

    return (
        <div className='mobile-input'>
            <div>
                <PhoneInput
                    onlyCountries={onlyCountries || []}
                    country={'in'}
                    enableSearch={enableSearch}
                    value={value}
                    onChange={handleOnChange}
                    placeholder='91 98765-43210'
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

export default MobileInput