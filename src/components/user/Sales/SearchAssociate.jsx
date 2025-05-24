import React, { useRef, useState } from 'react'
import './search-customer.scss'
import NormalInput from '../../common/inputs/NormalInput'
import SingleButton from '../../common/buttons/SingleButton'
import { IoSendSharp } from 'react-icons/io5'
import { cnPv2Axios } from '../../../config/axios'
import SpinWithMessage from '../../common/spinners/SpinWithMessage'
import { TbPlugConnectedX } from 'react-icons/tb'

const SearchAssociate = ({ setModal, setFormData, type }) => {
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
            cnPv2Axios.get(`/associate/search?key=${text}`).then((response) => {
                setData(response.data || [])
                setLoading(false)
            })
        }
    }

    const handleChange = (e) => {

        setText(e.target.value)

        if (e.target.value.length > 2) {
            setReadySearch(true)
        } else {
            setReadySearch(false)
        }

    }

    const chooseOption = (data) => {
        setFormData((state) => ({
            ...state,
            [type]: data?.asot_id || '',
        }))
        setModal({ status: false, title: null, content: null })
    }

    const handleClearText = () => {
        setFormData((state) => ({
            ...state,
            [type]: '',
        }))
        setModal({ status: false, title: null, content: null })
    }

    return (
        <div className="search-customer-comp-div">
            {data?.[0] ? <div className="result-div">
                {data?.map((asot) => {
                    return <div className="item-div" onClick={() => chooseOption(asot)}>
                        <p>{asot?.asot_id}, {asot?.first_name} {asot?.last_name} | {asot?.asot_type} | {asot?.asot_type === 'Person'
                            && `${asot?.address?.address},${asot?.address?.city}, ${asot?.address?.state} | `}
                            {asot?.worker_type && `${asot?.worker_type} / ${asot?.worker_sub_type} | `}
                            {asot?.business?.company_name && `${asot?.business?.company_name}`}
                        </p>
                    </div>
                })}
            </div>
                : doSearch && !loading && <SpinWithMessage icon={<TbPlugConnectedX />} message='No matching associates found.' />}
            <form action="" onSubmit={handleSubmit}>
                <p className='smallTD2' style={{ marginBottom: '10px' }}>To find a associate by its name, title, address, place, cid or contacts,
                    <br></br>
                    please enter at least 3 characters for search.</p>
                <div className="search-input-div">
                    <NormalInput ref={inputRef} label='Search' autoFocus style={{ width: '100%' }} onChangeFun={handleChange}
                        value={text} type='text' minLength={3} step={1} />
                    <SingleButton type={readySearch ? 'submit' : 'button'} classNames={readySearch ? 'icon-only search-button' : 'icon-only search-button hide-button'}
                        stIcon={<IoSendSharp />} loading={loading} />
                    <p className='clear-text' onClick={handleClearText}>Clear Associate ID</p>
                </div>
            </form>
        </div >
    )
}

export default SearchAssociate