import React, { useEffect, useState } from 'react'
import './search-customer.scss'
import SpinWithMessage from '../../../components/common/spinners/SpinWithMessage'
import { useSearchParams } from 'react-router-dom'
import { TbUserSearch, TbUserX } from 'react-icons/tb'
import SingleButton from '../../../components/common/buttons/SingleButton'
import { IoSearch } from 'react-icons/io5'
import Modal from '../../../components/common/modal/Modal'
import CustomerProfile1 from '../../../components/user/profile-card/CustomerProfile1'
import FilterCustomer from '../../../components/user/Sales/FilterCustomer'

const SearchCustomer = ({ setPageHead }) => {
    const [result, setResult] = useState([])
    const [searchParams, setSearchParams] = useSearchParams()
    const [loading, setLoading] = useState('')
    const [doFilter, setDoFilter] = useState(false)
    const [modal, setModal] = useState({ status: false })

    useEffect(() => {
        setPageHead({ title: "Search customer" })
        // eslint-disable-next-line
    }, [])

    const handleOpenFilter = () => {
        setModal({ status: true, title: 'Filter', content: <FilterCustomer /> })
    }

    return (
        <div className="search-customer-page-div">
            <Modal modal={modal} setModal={setModal} />
            {/* If not result and initial */}
            {!result?.[0] && <SpinWithMessage height={'400px'}
                icon={!searchParams.get('s') && !doFilter && !result?.[0]
                    ? < TbUserSearch /> : <TbUserX />}
                message={!searchParams.get('s') && !doFilter && !result?.[0]
                    ? 'Search a customer using below button' : 'No matched customers'}
                bottomContent={!searchParams.get('s') && !doFilter && !result?.[0] &&
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
                        <SingleButton name={'Search'} classNames={'btn-tertiary'} stIcon={<IoSearch />}
                            onClick={handleOpenFilter} />
                    </div>} />}

            {/* If result */}
            {result?.[0] && <div className='result-div'>
                <CustomerProfile1 />
                <CustomerProfile1 />
                <CustomerProfile1 />
                <CustomerProfile1 />
                <CustomerProfile1 />
            </div>}

            {result?.[0] && <div className="app-icon-div">
                <SingleButton title={'Search customer'} stIcon={<IoSearch />} classNames={'icon-only btn-tertiary'}
                    style={{ padding: '15px', fontSize: '25px', borderRadius: '100px' }} onClick={handleOpenFilter} />
            </div>}

        </div>
    )
}

export default SearchCustomer