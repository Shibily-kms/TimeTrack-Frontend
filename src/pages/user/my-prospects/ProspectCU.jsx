import React, { useEffect, useState } from 'react'
import './prospect-cu.scss'
import NormalInput from '../../../components/common/inputs/NormalInput'
import SelectInput from '../../../components/common/inputs/SelectInput'
import MobileInput from '../../../components/common/inputs/MobileInput'
import SingleButton from '../../../components/common/buttons/SingleButton'
import { TbSearch } from 'react-icons/tb'
import { prospect_urgency } from '../../../assets/javascript/const-data'
import SearchCustomer from '../../../components/user/Sales/SearchCustomer'
import SearchCity from '../../../components/user/Sales/SearchCity'
import SearchAssociate from '../../../components/user/Sales/SearchAssociate'
import Modal from '../../../components/common/modal/Modal'
import { slUv1Axios } from '../../../config/axios'
import { useDispatch } from 'react-redux'
import { toast } from '../../../redux/features/user/systemSlice'
import { useNavigate } from 'react-router-dom'
import { YYYYMMDDFormat } from '../../../assets/javascript/date-helper'

const ProspectCU = ({ setPageHead }) => {

    const [prospectType, setProspectType] = useState([])
    const [prospectUrgency, setProspectUrgency] = useState([])
    const [form, setForm] = useState({})
    const [modal, setModal] = useState({ state: false })
    const [pinCodeList, setPinCodeList] = useState([])
    const [productTypes, setProductTypes] = useState([])
    const [loading, setLoading] = useState('')
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleOpenCidSearch = () => {
        setModal({
            status: true, title: 'Search customer', content: <SearchCustomer setModal={setModal} setFormData={setForm}
                setPinCodeList={setPinCodeList} />
        })
    }

    const handleOpenCitySearch = () => {
        setModal({
            status: true, title: 'Search city', content: <SearchCity setModal={setModal} setFormData={setForm}
                setPinCodeList={setPinCodeList} />
        })
    }

    const handleOpenAssociateSearch = (e) => {
        setModal({
            status: true, title: `Search associate of ${e.target.name}`, content: <SearchAssociate setModal={setModal} setFormData={setForm}
                setPinCodeList={setPinCodeList} type={e.target.name} />
        })
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

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading('submit')

        slUv1Axios.post('/prospect/register', { ...form, reg_by_type: 'Staff', reg_platform: 2 }).then(() => {
            navigate(`/my-prospects?month=${YYYYMMDDFormat(new Date()).slice(0, 7)}`)
            setLoading('')
        }).catch((error) => {
            setLoading('')
            dispatch(toast.push.error({ message: error.message }))
        })
    }

    useEffect(() => {
        setProspectType(['Lead', 'Enquiry'].map((value, index) => ({ option: value, value: `${index + 1}` })))
        setProspectUrgency(prospect_urgency?.map((value, index) => ({ option: `${value}`, value: `${index + 1}` })))
        setPageHead({ title: "Register prospects" })
        setProductTypes([
            { option: 'Purifier', value: 'Purifier' },
            { option: 'Vessel', value: 'Vessel' },
            { option: 'Purifier & Vessel', value: 'Purifier & Vessel' },
        ])
    }, [])


    return (
        <div className="prospectCU-page-div">
            <Modal modal={modal} setModal={setModal} />
            <form action="" onSubmit={handleSubmit}>
                <div className="input-group-div">
                    <SelectInput label='Prospect type' name='reg_type' values={prospectType} firstOption={{ option: 'Select...', value: '' }}
                        onChangeFun={handleChange} />
                    <NormalInput label='Customer ID' value={form?.cid} name='cid' isRequired={false} rightIcon={<TbSearch />} onFocus={handleOpenCidSearch} />
                    <NormalInput label='First name' name='first_name' value={form?.first_name} onChangeFun={handleChange} />
                    <NormalInput label='Last name' name='last_name' value={form?.last_name} onChangeFun={handleChange} />
                    <NormalInput label='Address' value={form?.address} name='address' isRequired={false} onChangeFun={handleChange} />
                    <NormalInput label='Place' value={form?.place} name='place' isRequired={false} onChangeFun={handleChange} />
                    <NormalInput label='City' value={form?.city} name='city'
                        isRequired={false} rightIcon={<TbSearch />} onFocus={handleOpenCitySearch} />
                    <SelectInput label='Pin code' value='' name='pin_code' isRequired={false} onChangeFun={handleChange}
                        firstOption={{ option: 'Select...', value: '' }} values={pinCodeList} />
                    <NormalInput label='State' value={form?.state} name='state' isRequired={false} onChangeFun={handleChange} />
                    <NormalInput label='Land mark' value={form?.land_mark} name='land_mark' isRequired={false} onChangeFun={handleChange} />
                    <MobileInput label='Primary number' name='primary_number' value={`${form?.primary_number?.country_code}${form?.primary_number?.number}`}
                        onlyCountries={['in']} onChangeFun={handleMobileNumber} />
                    <MobileInput label='Secondary number' name='secondary_number' value={`${form?.secondary_number?.country_code}${form?.secondary_number?.number}`}
                        isRequired={false} onChangeFun={handleMobileNumber} />
                    <MobileInput label='Whatsapp number' name='whatsapp_number' value={`${form?.whatsapp_number?.country_code}${form?.whatsapp_number?.number}`}
                        isRequired={false} onChangeFun={handleMobileNumber} />
                    <SelectInput label='Urgency' name='urgency' values={prospectUrgency} firstOption={{ option: 'Select...', value: '' }} onChangeFun={handleChange} />
                    <NormalInput label='Source' value={form?.source} name='source' isRequired={false} rightIcon={<TbSearch />} onFocus={handleOpenAssociateSearch} />
                    <NormalInput label='Care of' value={form?.care_of} name='care_of' isRequired={false} rightIcon={<TbSearch />} onFocus={handleOpenAssociateSearch} />
                    {form?.reg_type == 2 && <SelectInput label='Required product type' name='required_product' isRequired={false} onChangeFun={handleChange}
                        values={productTypes} firstOption={{ option: "Select...", value: '' }} />}
                    <NormalInput label='Comment' value={form?.reg_comment} name='reg_comment' isRequired={false} onChangeFun={handleChange} />
                </div>
                <SingleButton loading={loading === 'submit'} name={'Register'} style={{ width: '100%', marginTop: '15px' }} classNames={'lg btn-tertiary'} />
            </form>
        </div>
    )
}

export default ProspectCU