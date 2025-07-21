import React, { useEffect, useState } from 'react'
import './style.scss'
import NormalInput from '../../common/inputs/NormalInput'
import SelectInput from '../../common/inputs/SelectInput'
import CheckboxInput from '../../common/inputs/CheckboxInput'
import { thisMonthFirstDay, thisMonthLastDay, YYYYMMDDFormat } from '../../../assets/javascript/date-helper'
import SingleButton from '../../common/buttons/SingleButton'
import { useDispatch } from 'react-redux'
import { toast } from '../../../redux/features/user/systemSlice'
import RadioInput from '../../common/inputs/RadioInput'

const SearchCustomer = ({ searchInputs, cityList, setSearchInputs, filtrationTypes, setFiltrationTypes, setDoSearch }) => {
    const dispatch = useDispatch();
    const [form, setForm] = useState(searchInputs)
    const [moreOptions, setMoreOptions] = useState(filtrationTypes)
    const [readyToSubmit, setReadyToSubmit] = useState(false)


    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const productChange = (e) => {

        if (e.target.value === 'purifier' || e.target.value === 'whole_house') {
            setForm({
                ...form,
                products: e.target.value
            })

            if (e.target.value === 'purifier') {
                setMoreOptions([
                    { option: 'Installation', value: 'installed_at' },
                    { option: 'Next periodical service', value: 'next_periodical_service_date' },
                    { option: 'Package start', value: 'package_started_date' },
                    { option: 'Package expiry', value: 'package_expiry_date' },
                    { option: 'Carbon usage start', value: 'carbon_filter_start_date' },
                    { option: 'Carbon usage expiry', value: 'carbon_filter_expiry_date' },
                    { option: 'Tech last visited', value: 'technician_last_visited_date' },
                ])
            } else if (e.target.value === 'whole_house') {
                setMoreOptions([
                    { option: 'Installation', value: 'installed_at' },
                    { option: 'Next periodical service', value: 'next_periodical_service_date' },
                    { option: 'Package start', value: 'package_started_date' },
                    { option: 'Package expiry', value: 'package_expiry_date' },
                    { option: 'Tech last visited', value: 'technician_last_visited_date' },
                ])
            }
        } else {
            setForm({
                ...form,
                products: e.target.value,
                customer_status: [],
                flt_type: ''
            })
        }
    }

    const handleCustomerStatusChange = (e) => {
        const customer_status = form?.customer_status?.includes(e.target.value)
        if (customer_status) {
            setForm({
                ...form,
                customer_status: form.customer_status.filter((value) => e.target.value !== value)
            })
        } else {
            setForm({
                ...form,
                customer_status: [...form.customer_status, e.target.value]
            })
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        // validation
        if (form?.key && form?.key?.length < 3) {
            dispatch(toast.push.error({ message: 'Enter al least 3 characters' }))
            return;
        }

        // update
        setSearchInputs(form)
        setFiltrationTypes(moreOptions)
        setDoSearch(true)
    }

    const resetInputs = () => {
        setForm({
            search: '',
            products: '',
            city_id: '',
            customer_status: [],
            flt_type: '',
            flt_from: YYYYMMDDFormat(thisMonthFirstDay(new Date())),
            flt_to: YYYYMMDDFormat(thisMonthLastDay(new Date()))
        })
    }

    useEffect(() => {
        if ((!form?.key || form?.key?.length < 3) && !form?.products && !form?.city_id) {
            setReadyToSubmit(false)
        } else {
            setReadyToSubmit(true)
        }
    }, [form])


    return (
        <div className="search-customer-comp-div">
            <form action="" onSubmit={handleSubmit}>
                <div>
                    <NormalInput label='Enter something...' name='key' value={form?.key} onChangeFun={handleChange} isRequired={false} />
                    <small>Search using cid, name, address, place, pin code and contacts</small>
                </div>
                <SelectInput label='City' name='city_id' values={cityList?.map((a) => ({ ...a, selected: a.value === form?.city_id }))} onChangeFun={handleChange} isRequired={false}
                    firstOption={{ option: 'Select...', value: '' }} />
                <div className="p-type">
                    <p>Product type</p>
                    <div>
                        <RadioInput label={'Purifier'} name={'products'} value={'purifier'} isRequired={false} onChangeFun={productChange}
                            checked={form?.products?.includes('purifier')} />
                        <RadioInput label={'Vessel'} name={'products'} value={'whole_house'} isRequired={false} onChangeFun={productChange}
                            checked={form?.products?.includes('whole_house')} />
                        <RadioInput label={'Both'} name={'products'} value={'both'} isRequired={false} onChangeFun={productChange}
                            checked={form?.products?.includes('both')} />
                        <RadioInput label={'No one'} name={'products'} value={'no_one'} isRequired={false} onChangeFun={productChange}
                            checked={form?.products?.includes('no_one')} />
                    </div>
                </div>
                {(form?.products === 'purifier' || form?.products === 'whole_house') && <>
                    <div className="p-type">
                        <p>Customer status</p>
                        {console.log(!form?.products.includes('purifier'))}
                        <div>
                            <CheckboxInput label={'O/C'} name={'customer_status'} value={'O/C'} isRequired={false} onChangeFun={handleCustomerStatusChange}
                                checked={form?.customer_status?.includes('O/C')} />
                            <CheckboxInput label={'O/W'} name={'customer_status'} value={'O/W'} isRequired={false} onChangeFun={handleCustomerStatusChange}
                                checked={form?.customer_status?.includes('O/W')} />
                            <CheckboxInput label={'I/W'} name={'customer_status'} value={'I/W'} isRequired={false} onChangeFun={handleCustomerStatusChange}
                                checked={form?.customer_status?.includes('I/W')} />
                            <CheckboxInput label={'SSP'} name={'customer_status'} value={'SSP'} isRequired={false} onChangeFun={handleCustomerStatusChange}
                                checked={form?.customer_status?.includes('SSP')} />
                            {form?.products.includes('purifier') &&
                                <CheckboxInput label={'AMC'} name={'customer_status'} value={'AMC'} isRequired={false} onChangeFun={handleCustomerStatusChange}
                                    checked={form?.customer_status?.includes('AMC')} />}
                        </div>
                    </div>
                    <div className="more-option">
                        <p>More Filtration</p>
                        <div>
                            <SelectInput label={'Filtration types'} name={'flt_type'} isRequired={false} onChangeFun={handleChange}
                                firstOption={{ option: 'Select...', value: '' }} values={moreOptions?.map((a) => ({ ...a, selected: a.value === form?.flt_type }))} />
                            <NormalInput label={'From date'} name={'flt_from'} value={form?.flt_from || YYYYMMDDFormat(thisMonthFirstDay(new Date()))} type={'date'}
                                isRequired={false} onChangeFun={handleChange} />
                            <NormalInput label={'To date'} name={'flt_to'} value={form?.flt_to || YYYYMMDDFormat(thisMonthLastDay(new Date()))} type={'date'}
                                isRequired={false} onChangeFun={handleChange} />
                        </div>
                    </div>
                </>}
                <SingleButton type={'submit'} name={'Search Customer'} classNames={'lg btn-tertiary'} style={{ width: "100%" }}
                    disabled={!readyToSubmit} />
                <p className='reset-text' onClick={resetInputs}>Reset options</p>
            </form>
        </div>
    )
}

export default SearchCustomer