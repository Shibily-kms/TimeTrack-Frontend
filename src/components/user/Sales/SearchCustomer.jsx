import React, { useRef, useState } from 'react'
import './search-customer.scss'
import NormalInput from '../../common/inputs/NormalInput'
import SingleButton from '../../common/buttons/SingleButton'
import { IoSendSharp } from 'react-icons/io5'
import { Link } from 'react-router-dom'
import { cnPv2Axios } from '../../../config/axios'

const SearchCustomer = ({ setModal, setFormData }) => {
    const inputRef = useRef()
    const [data, setData] = useState([])
    const [text, setText] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true)
        if (Number(text) !== NaN) {
            cnPv2Axios.get(`/customer/filter?key=${text}`).then((response) => {
                setData(response.data || [])
                setLoading(false)
            })
        }
    }

    const chooseCustomer = (data) => {
        setFormData((state) => ({
            ...state,
            cid: data?.cid,
            first_name: data?.first_name || '',
            last_name: data?.last_name || '',
            address: data?.address?.address || '',
            place: data?.address?.place || '',
            post: data?.address?.post || '',
            pin_code: data?.address?.pin_code || '',
            land_mark: data?.address?.land_mark || '',
            primary_number: data?.primary_number,
            secondary_number: data?.secondary_number,
            whatsapp_number: data?.whatsapp_number,
        }))
        setModal({ status: false, title: null, content: null })
    }

    return (
        <div className="search-customer-comp-div">
            {data?.[0] && <div className="result-div">
                {data?.map((customer) => {
                    return <div className="item-div" onClick={() => chooseCustomer(customer)}>
                        <p>CID : {customer?.cid} | {customer?.full_name}</p>
                        <p>{customer?.primary_number?.country_code} {customer?.primary_number?.number} | {customer?.address?.place || customer?.address?.post}</p>
                    </div>
                })}
            </div>}
            <form action="" onSubmit={handleSubmit}>
                <p className='smallTD2' style={{ marginBottom: '10px' }}>To find a customer by their Customer ID (CID) or mobile number.
                    Use the <Link to={'/search-customer'}><b>More {'>'} Search Customer</b></Link> option to access additional search features.</p>
                <div className="search-input-div">
                    <NormalInput ref={inputRef} label='Search' autoFocus style={{ width: '100%' }} onChangeFun={(e) => setText(e.target.value)}
                        value={text} type='number' minLength={3} />
                    <SingleButton type={'submit'} classNames={'icon-only search-button'} stIcon={<IoSendSharp />}
                        loading={loading} />
                </div>
            </form>
        </div>
    )
}

export default SearchCustomer