import React, { useEffect, useState } from 'react'
import './search-customer.scss'
import { IoSearch } from 'react-icons/io5'
import { LuPackageSearch } from 'react-icons/lu'
import { TbNotificationOff } from 'react-icons/tb'
import { FiDownload } from 'react-icons/fi'
import { cnPv2Axios } from '../../../config/axios'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from '../../../redux/features/user/systemSlice'
import { FaCircleUser } from 'react-icons/fa6'
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
        search_key: '',
        post: '',
        city_id: '',
        product_search: ''
    })
    const [cityList, setCityList] = useState([])
    const [postList, setPostList] = useState([])


    const handleOpenSearch = () => {
        setModal({
            status: true,
            title: "Search Options",
            content: <SearchCustomerComp searchInputs={searchInputs} setSearchInputs={setSearchInputs} cityList={cityList}
                setDoSearch={setDoSearch} postList={postList} setPostList={setPostList} />
        })
    }

    const handleOpenAllCustomer = () => {
        setModal({ status: true, title: "Download All Customer", content: <DownloadAllCustomer setModal={setModal} /> })
    }

    const handleOpenSomeCustomer = () => {
        setModal({ status: true, title: "Download Result", content: <DownloadAllCustomer data={data} setModal={setModal} /> })
    }

    useEffect(() => {
        setPageHead({ title: 'Search customer', desc: 'Find a customer using filtration steps' })


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
            cnPv2Axios.get(`/customer/filter?search_key=${searchInputs?.search_key || ''}&product_search=${searchInputs.product_search || ''}&city_id=${searchInputs?.city_id || ''}&post=${searchInputs?.post || ''}`)
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
                    return <div className="customer-card-div" key={customer?.customer_id}>
                        <Link to={`/customer/${customer?.customer_id}/view`} target="_blank">
                            <div className="icon-div">
                                <FaCircleUser />
                            </div>
                        </Link>
                        <div className="text-div" onClick={() => navigate(`/customer/${customer?.customer_id}/view`)}>
                            <div className="name-div">
                                <h4>{customer?.customer_name}</h4>
                            </div>
                            <p>CID : {customer?.customer_id}</p>
                            <p>{customer?.address?.address}, {customer?.address?.place}{customer?.address?.land_mark ? `, ${customer?.address?.land_mark}` : ''}</p>
                            <p>P.O {customer?.address?.post}, {customer?.address?.city_name} City - {customer?.address?.pin_code}</p>
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
                <div className="buttons" style={{ gridTemplateColumns: '1fr' }}>
                    <SingleButton name={'Search'} stIcon={<IoSearch />} classNames={'lg btn-tertiary'}
                        onClick={handleOpenSearch} style={{ width: '100%' }} />
                </div>
            </div> : ""}


        </div>
    )
}

export default SearchCustomer
