import React, { useEffect, useState } from 'react'
import './search-customer.scss'
import { IoSearch } from 'react-icons/io5'
import { LuPackageSearch } from 'react-icons/lu'
import { TbNotificationOff } from 'react-icons/tb'
import { FiDownload } from 'react-icons/fi'
import { cnPv2Axios } from '../../../config/axios'
import { thisMonthFirstDay, thisMonthLastDay, YYYYMMDDFormat } from '../../../assets/javascript/date-helper'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from '../../../redux/features/user/systemSlice'
import { FaCircleUser } from 'react-icons/fa6'
import { FaStar } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import SingleButton from '../../../components/common/buttons/SingleButton'
import SpinWithMessage from '../../../components/common/spinners/SpinWithMessage'
import Modal from '../../../components/common/modal/Modal'
import SearchCustomerComp from '../../../components/user/search-customer/SearchCustomer'
import DownloadAllCustomer from '../../../components/user/search-customer/DownloadAllCustomer'


const SearchCustomer = ({ setPageHead }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.userAuth)
    const [data, setData] = useState([])
    const [doSearch, setDoSearch] = useState(false)
    const [loading, setLoading] = useState('')
    const [modal, setModal] = useState({ status: false, content: null })
    const [searchInputs, setSearchInputs] = useState({
        search: '',
        post: '',
        city_id: '',
        products: '',
        customer_status: [],
        flt_type: '',
        flt_from: YYYYMMDDFormat(thisMonthFirstDay(new Date())),
        flt_to: YYYYMMDDFormat(thisMonthLastDay(new Date()))
    })
    const [cityList, setCityList] = useState([])
    const [postList, setPostList] = useState([])
    const [filtrationTypes, setFiltrationTypes] = useState([])

    const handleOpenSearch = () => {
        setModal({
            status: true,
            title: "Search Options",
            content: <SearchCustomerComp searchInputs={searchInputs} setSearchInputs={setSearchInputs} cityList={cityList}
                filtrationTypes={filtrationTypes} setFiltrationTypes={setFiltrationTypes} setDoSearch={setDoSearch}
                postList={postList} setPostList={setPostList} />
        })
    }

    const handleOpenAllCustomer = () => {
        setModal({ status: true, title: "Download All Customer", content: <DownloadAllCustomer setModal={setModal} /> })
    }

    const handleOpenSomeCustomer = () => {
        setModal({ status: true, title: "Download Result", content: <DownloadAllCustomer data={data} setModal={setModal} /> })
    }

    useEffect(() => {
        setPageHead({ title: 'Search a customer', desc: 'Find a customer using filtration steps' })


        // fetch
        setLoading('fetch')
        cnPv2Axios.get('/l/location/city/search?area_type=service').then((response) => {
            const cities = response?.data?.map((s) => ({ option: s?.city_name, value: s?.city_id, pins: s?.pin_codes, posts: s?.post_offices }))
            setCityList([{ option: 'No City Customer', value: 'unknown' }, ...cities])
            setLoading('')
        }).catch((error) => {
            setLoading('')
            dispatch(toast.push.error({ message: error?.message }))
        })

        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        // do search

        if (doSearch) {
            // close search modal
            setModal({ status: false })

            //    search
            setLoading('fetch')
            cnPv2Axios.get(`/customer/filter?key=${searchInputs?.key || ''}&products=${searchInputs.products || ''}&customer_status=${searchInputs.customer_status || ''}&flt_type=${searchInputs.flt_type || ''}&flt_from=${searchInputs.flt_from || ''}&flt_to=${searchInputs.flt_to || ''}&city_id=${searchInputs?.city_id || ''}&post=${searchInputs?.post || ''}`)
                .then((response) => {
                    setData(response?.data)
                }).catch((error) => {
                    dispatch(toast.push.error({ message: error?.message }))
                }).finally(() => {
                    setLoading('')
                })

        }
    }, [searchInputs])

    return (
        <div className="search-customer-page-div">

            <Modal modal={modal} setModal={setModal} />

            {((data?.length || 0) > 0 && loading !== 'fetch') && <div className="content-div">
                <h3 style={{ textAlign: 'end' }}>{data?.length} Results</h3>
                {data?.map((customer) => {
                    return <div className="customer-card-div" key={customer?.cid}>
                        <Link to={`/customer/${customer?.cid}/view`} target="_blank">
                            <div className="icon-div">
                                <FaCircleUser />
                            </div>
                        </Link>
                        <div className="text-div" onClick={() => navigate(`/customer/${customer?.cid}/view`)}>
                            <div className="name-div">
                                <h4>{customer?.first_name} {customer?.last_name}</h4>
                                {customer?.star_rate > 0 && <div className="star">
                                    <FaStar />
                                    <p>{customer?.star_rate}</p>
                                </div>}
                            </div>
                            <p>CID : {customer?.cid} {customer?.purifier_customer_status && `| Purifier : ${customer?.purifier_customer_status} `} {customer?.wh_customer_status && `| Vessel : ${customer?.wh_customer_status}`}</p>
                            <p>{customer?.address?.address}, {customer?.address?.place}, {customer?.address?.city_name} City - {customer?.address?.pin_code}</p>
                            <p>PN : {customer?.primary_number?.number}  | SN : {customer?.secondary_number?.number} | WN : {customer?.whatsapp_number?.number}</p>
                        </div>
                    </div>
                })}

            </div>}

            {loading === 'fetch'
                ? <SpinWithMessage load height={'400px'} />
                : (!data?.length && !doSearch) // initial stage
                    ? <SpinWithMessage icon={<LuPackageSearch />} message='Search a customer using below button' height={'400px'}
                        bottomContent={<div style={{ display: 'flex', justifyContent: "center", gap: "10px" }}>
                            <SingleButton stIcon={<IoSearch />} classNames={'btn-tertiary'} onClick={handleOpenSearch} name={'Search customer'} />
                        </div>} />
                    : (doSearch && !data?.length)  // no data found
                        ? <SpinWithMessage icon={<TbNotificationOff />} message='No matched data' height={'400px'}
                            bottomContent={<div style={{ display: 'flex', justifyContent: "center" }}>
                                <SingleButton stIcon={<IoSearch />} name={'Search customer'} classNames={'btn-tertiary'} onClick={handleOpenSearch} />
                            </div>} />
                        : ''}

            {data?.length ? <div className="app-icon-div">
                <div className="buttons" style={user?.allowed_origins?.includes('ttur_customer_download') ? { gridTemplateColumns: '1fr 1fr' } : { gridTemplateColumns: '1fr' }}>
                    {user?.allowed_origins?.includes('ttur_customer_download') &&
                        <SingleButton name={'Download'} stIcon={<FiDownload />} classNames={'lg'}
                            onClick={handleOpenSomeCustomer} style={{ width: '100%' }} />}
                    <SingleButton name={'Search'} stIcon={<IoSearch />} classNames={'lg btn-tertiary'}
                        onClick={handleOpenSearch} style={{ width: '100%' }} />
                </div>
            </div> : ""}

            {(!data?.length && !doSearch && user?.allowed_origins?.includes('ttur_customer_download')) ? <div className="app-icon-div">
                <div className="buttons">
                    <SingleButton name={'Download Customer List'} stIcon={<FiDownload />} classNames={'lg'}
                        onClick={handleOpenAllCustomer} style={{ width: '100%' }} />
                </div>
            </div> : ""}
        </div>
    )
}

export default SearchCustomer