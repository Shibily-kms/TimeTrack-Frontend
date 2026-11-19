import React, { useEffect, useRef, useState } from 'react'
import './search-customer.scss'
import { IoSearch, IoLocationOutline } from 'react-icons/io5'
import { LuPackageSearch } from 'react-icons/lu'
import { TbNotificationOff } from 'react-icons/tb'
import { cnPv2Axios } from '../../../config/axios'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from '../../../redux/features/user/systemSlice'
import { saveSearchCustomer } from '../../../redux/features/user/searchCustomerSlice'
import { useNavigate } from 'react-router-dom'
import SingleButton from '../../../components/common/buttons/SingleButton'
import SpinWithMessage from '../../../components/common/spinners/SpinWithMessage'
import Modal from '../../../components/common/modal/Modal'
import SearchCustomerComp from '../../../components/user/search-customer/SearchCustomer'

const PAGE_LIMIT = 10


const SearchCustomer = ({ setPageHead }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cache = useSelector((state) => state.searchCustomer) || {}
    const [data, setData] = useState(cache?.data || [])
    const [doSearch, setDoSearch] = useState(cache?.doSearch || false)
    const [loading, setLoading] = useState('')
    const [modal, setModal] = useState({ status: false, content: null })
    const [searchInputs, setSearchInputs] = useState(cache?.searchInputs || {
        search_key: '',
        post: '',
        city_id: '',
        product_search: ''
    })
    const [cityList, setCityList] = useState([])
    const [postList, setPostList] = useState(cache?.postList || [])
    const [page, setPage] = useState(cache?.page || 0)
    const [hasMore, setHasMore] = useState(cache?.hasMore || false)
    const lastSearchedRef = useRef(cache?.doSearch ? cache?.searchInputs : null)
    const scrollYRef = useRef(0)


    const handleOpenSearch = () => {
        setModal({
            status: true,
            title: "Search Options",
            content: <SearchCustomerComp searchInputs={searchInputs} setSearchInputs={setSearchInputs} cityList={cityList}
                setDoSearch={setDoSearch} postList={postList} setPostList={setPostList} />
        })
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

    const fetchCustomers = (pageNo = 0) => {
        setLoading(pageNo === 0 ? 'fetch' : 'more')
        cnPv2Axios.get('/customer/filter', {
            params: {
                search_key: searchInputs?.search_key || '',
                product_search: searchInputs?.product_search || '',
                city_id: searchInputs?.city_id || '',
                post: searchInputs?.post || '',
                page: pageNo,
                limit: PAGE_LIMIT
            }
        }).then((response) => {
            const list = Array.isArray(response?.data) ? response.data : (response?.data?.data || [])
            setData((prev) => pageNo === 0 ? list : [...prev, ...list])
            setPage(pageNo)
            setHasMore(list.length === PAGE_LIMIT)
        }).catch((error) => {
            dispatch(toast.push.error({ message: error?.message }))
        }).finally(() => {
            setLoading('')
        })
    }

    const handleSeeMore = () => {
        fetchCustomers(page + 1)
    }

    useEffect(() => {
        // skip if these inputs are already searched (cached result restored on mount)
        if (searchInputs === lastSearchedRef.current) return

        // do search
        if (doSearch) {
            lastSearchedRef.current = searchInputs
            // close search modal
            setModal({ status: false })

            // new search starts from first page
            setData([])
            setHasMore(false)
            fetchCustomers(0)
        }
        // eslint-disable-next-line
    }, [searchInputs])

    // save search state to redux, so it is restored when coming back to this page
    useEffect(() => {
        dispatch(saveSearchCustomer({ searchInputs, data, page, hasMore, doSearch, postList }))
        // eslint-disable-next-line
    }, [searchInputs, data, page, hasMore, doSearch, postList])

    // restore & remember scroll position
    useEffect(() => {
        if (cache?.scrollY && cache?.data?.length) {
            setTimeout(() => window.scrollTo(0, cache.scrollY), 0)
        }
        const onScroll = () => { scrollYRef.current = window.scrollY }
        window.addEventListener('scroll', onScroll)
        return () => {
            window.removeEventListener('scroll', onScroll)
            dispatch(saveSearchCustomer({ scrollY: scrollYRef.current }))
        }
        // eslint-disable-next-line
    }, [])

    return (
        <div className="search-customer-page-div">

            <Modal modal={modal} setModal={setModal} />

            {((data?.length || 0) > 0 && loading !== 'fetch') && <div className="content-div">
                {data?.map((customer) => {
                    const address = customer?.address || {}
                    const line1 = [address?.address, address?.place, address?.land_mark].filter(Boolean).join(', ')
                    const line2 = [
                        address?.post ? `P.O ${address.post}` : '',
                        address?.city_name ? `${address.city_name} City` : '',
                    ].filter(Boolean).join(', ') + (address?.pin_code ? ` - ${address.pin_code}` : '')

                    return <div className="customer-card-div" key={customer?.customer_id}
                        onClick={() => navigate(`/customer/${customer?.customer_id}/view`)}>
                        <div className="card-head">
                            <h4>{customer?.customer_name}</h4>
                            <span className="cid-badge">CID {customer?.customer_id}</span>
                        </div>
                        {(line1 || line2) && <div className="address-div">
                            <IoLocationOutline />
                            <div>
                                {line1 && <p>{line1}</p>}
                                {line2 && <p>{line2}</p>}
                            </div>
                        </div>}
                    </div>
                })}

                {hasMore && <div style={{ display: 'flex', justifyContent: 'center', margin: '15px 0' }}>
                    <SingleButton name={'See more'} classNames={'btn-tertiary'} onClick={handleSeeMore}
                        loading={loading === 'more'} />
                </div>}

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
