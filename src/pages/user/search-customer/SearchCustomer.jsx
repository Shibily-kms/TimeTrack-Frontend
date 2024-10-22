import React, { useEffect, useState } from 'react'
import SpinWithMessage from '../../../components/common/spinners/SpinWithMessage'
import { useSearchParams } from 'react-router-dom'
import { TbUserSearch, TbUserX } from 'react-icons/tb'
import SingleButton from '../../../components/common/buttons/SingleButton'
import { IoSearch } from 'react-icons/io5'
import Modal from '../../../components/common/modal/Modal'

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
                        <SingleButton name={'Search'} classNames={'btn-tertiary'} stIcon={<IoSearch />} />
                    </div>} />}

            {/* If result */}
            {result?.[0] && <></>}

        </div>
    )
}

export default SearchCustomer