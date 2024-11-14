import React, { useRef, useState } from 'react'
import './search-customer.scss'
import NormalInput from '../../common/inputs/NormalInput'
import SingleButton from '../../common/buttons/SingleButton'
import { IoSendSharp } from 'react-icons/io5'
import { cnPv2Axios } from '../../../config/axios'
import SpinWithMessage from '../../common/spinners/SpinWithMessage'
import { TbLocationX } from 'react-icons/tb'

const SearchCity = ({ setModal, setFormData, setPinCodeList }) => {
    const inputRef = useRef()
    const [data, setData] = useState([])
    const [text, setText] = useState('')
    const [loading, setLoading] = useState(false)
    const [doSearch, setDoSearch] = useState(false)
    const [readySearch, setReadySearch] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true)
        setDoSearch(true)
        if (Number(text) !== NaN) {
            cnPv2Axios.get(`/l/location/city/search?key=${text}`).then((response) => {
                setData(response.data || [])
                setLoading(false)
            })
        }
    }

    const handleChange = (e) => {

        setText(e.target.value)
        if (!isNaN(Number(e.target.value)) && e.target.value.length === 6) {
            setReadySearch(true)
        } else if (isNaN(Number(e.target.value)) && e.target.value.length > 2) {
            setReadySearch(true)
        } else {
            setReadySearch(false)
        }

    }

    const chooseOption = (data) => {
        setFormData((state) => ({
            ...state,
            city: data?.city_name || '',
            state: data?.state_name || '',
            country: data?.country_name || '',
        }))
        setPinCodeList(data?.pin_codes?.map((pin) => ({ option: pin, value: pin })))
        setModal({ status: false, title: null, content: null })
    }

    return (
        <div className="search-customer-comp-div">
            {data?.[0] ? <div className="result-div">
                {data?.map((area) => {
                    return <div className="item-div" onClick={() => chooseOption(area)}>
                        <p>{area?.city_name}, {area?.state_name}, {area?.country_name} | {area?.pin_codes?.map((pin) => `${pin}, `)}</p>
                    </div>
                })}
            </div>
                : doSearch && <SpinWithMessage icon={<TbLocationX />} message='No matching city name or postal code found in our installation area.' />}
            <form action="" onSubmit={handleSubmit}>
                <p className='smallTD2' style={{ marginBottom: '10px' }}>To find a city by its name or postal code, please enter at least 3 characters for the city name or a 6-digit postal code.</p>
                <div className="search-input-div">
                    <NormalInput ref={inputRef} label='Search' autoFocus style={{ width: '100%' }} onChangeFun={handleChange}
                        value={text} type='text' minLength={3} step={1} />
                    <SingleButton type={readySearch ? 'submit' : 'button'} classNames={readySearch ? 'icon-only search-button' : 'icon-only search-button hide-button'}
                        stIcon={<IoSendSharp />} loading={loading} />
                </div>
            </form>
        </div >
    )
}

export default SearchCity