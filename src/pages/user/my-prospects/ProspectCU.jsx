import React, { useEffect, useRef, useState } from 'react'
import './prospect-cu.scss'
import NormalInput from '../../../components/common/inputs/NormalInput'
import SelectInput from '../../../components/common/inputs/SelectInput'
import MobileInput from '../../../components/common/inputs/MobileInput'
import SingleButton from '../../../components/common/buttons/SingleButton'
import { TbSearch } from 'react-icons/tb'
import { prospect_urgency } from '../../../assets/javascript/const-data'
import SearchCustomer from '../../../components/user/Sales/SearchCustomer'
import Modal from '../../../components/common/modal/Modal'

const ProspectCU = ({ setPageHead }) => {

    const [prospectType, setProspectType] = useState([])
    const [prospectUrgency, setProspectUrgency] = useState([])
    const [form, setForm] = useState({})
    const [modal, setModal] = useState({ state: false })

    const handleOpenCidSearch = () => {
        setModal({ status: true, title: 'Search customer', content: <SearchCustomer setModal={setModal} setFormData={setForm} /> })
    }

    const closeModal = () => {
        setModal({ status: false, title: null, content: null })
    }

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleMobileNumber = (mobData) => {
        setForm({
            ...form,
            [mobData?.name]: mobData?.number
                ? {
                    country_code: mobData?.country_code || null,
                    number: mobData?.number || null
                }
                : undefined
        })
    }



    useEffect(() => {
        setProspectType(['Lead', 'Enquiry'].map((value, index) => ({ option: value, value: `${index + 1}` })))
        setProspectUrgency(prospect_urgency?.map((value, index) => ({ option: `${value}%`, value: `${value}` })))
        setPageHead({ title: "Register prospects" })
    }, [])


    return (
        <div className="prospectCU-page-div">
            <Modal modal={modal} setModal={setModal} />
            <form action="">
                <div className="input-group-div">
                    <SelectInput label='Prospect type' name='prospect_type' values={prospectType} firstOption={{ option: 'Select...', value: '' }}
                        onChangeFun={handleChange} />
                    <NormalInput label='Customer ID' value={form?.cid} name='cid' isRequired={false} rightIcon={<TbSearch />} onFocus={handleOpenCidSearch} />
                    <NormalInput label='First name' name='first_name' value={form?.first_name} onChangeFun={handleChange} />
                    <NormalInput label='Last name' name='last_name' value={form?.last_name} onChangeFun={handleChange} />
                    <NormalInput label='Address' value={form?.address} name='address' isRequired={false} onChangeFun={handleChange} />
                    <NormalInput label='Place' value={form?.place} name='place' isRequired={false} onChangeFun={handleChange} />
                    <NormalInput label='Post Office & Pin' value={form?.post ? `${form?.post} | ${form?.pin_code}` : ''} name='post_office'
                        isRequired={false} rightIcon={<TbSearch />} />
                    <NormalInput label='Land mark' value={form?.land_mark} name='land_mark' isRequired={false} onChangeFun={handleChange} />
                    <MobileInput label='Primary number' name='primary_number' value={`${form?.primary_number?.country_code}${form?.primary_number?.number}`}
                        onlyCountries={['in']} onChangeFun={handleMobileNumber} />
                    <MobileInput label='Secondary number' name='secondary_number' value={`${form?.secondary_number?.country_code}${form?.secondary_number?.number}`}
                        isRequired={false} onChangeFun={handleMobileNumber} />
                    <MobileInput label='Whatsapp number' name='whatsapp_number' value={`${form?.whatsapp_number?.country_code}${form?.whatsapp_number?.number}`}
                        isRequired={false} onChangeFun={handleMobileNumber} />
                    <SelectInput label='Urgency' name='urgency' values={prospectUrgency} firstOption={{ option: 'Select...', value: '' }} onChangeFun={handleChange} />
                    <NormalInput label='Source' value='' name='source' isRequired={false} rightIcon={<TbSearch />} />
                    <NormalInput label='Care of' value='' name='care_of' isRequired={false} rightIcon={<TbSearch />} />
                    <SelectInput label='Required product type' value='' name='required_product' isRequired={false} onChangeFun={handleChange} />
                    <NormalInput label='Comment' value='' name='reg_comment' isRequired={false} onChangeFun={handleChange} />
                </div>
                <SingleButton name={'Register'} style={{ width: '100%', marginTop: '15px' }} classNames={'lg btn-tertiary'} />
            </form>
        </div>
    )
}

export default ProspectCU