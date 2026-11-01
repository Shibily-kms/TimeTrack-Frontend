import React, { useEffect, useState } from 'react'
import './style.scss'
import NormalInput from '../../common/inputs/NormalInput'
import SelectInput from '../../common/inputs/SelectInput'
import SingleButton from '../../common/buttons/SingleButton'
import { useDispatch } from 'react-redux'
import { toast } from '../../../redux/features/user/systemSlice'

const SearchCustomer = ({ searchInputs, cityList, setSearchInputs, setDoSearch, postList, setPostList }) => {
    const dispatch = useDispatch();
    const [form, setForm] = useState(searchInputs)
    const [readyToSubmit, setReadyToSubmit] = useState(false)
    const [posts, setPosts] = useState(postList || [])

    const handleChange = (e) => {

        if (e.target.name === 'city_id') {
            setForm({
                ...form,
                city_id: e.target.value,
                post: ''
            })

            const theCity = cityList?.filter((a) => a.value === e.target.value)?.[0]

            setPosts(theCity?.posts?.map((a) => ({ option: a, value: a })) || [])
            setPostList(theCity?.posts?.map((a) => ({ option: a, value: a })) || [])

            return;
        }

        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        // validation
        if ((form?.search_key && form?.search_key?.length < 3) || (form?.product_search && form?.product_search?.length < 3)) {
            dispatch(toast.push.error({ message: 'Enter at least 3 characters' }))
            return;
        }

        // update
        setSearchInputs(form)
        setDoSearch(true)
    }

    const resetInputs = () => {
        setForm({
            search_key: '',
            post: '',
            city_id: '',
            product_search: ''
        })

        setPosts([])
        setPostList([])
    }

    useEffect(() => {
        if (
            (!form?.search_key || form?.search_key?.length < 3) &&
            (!form?.product_search || form?.product_search?.length < 3) &&
            !form?.city_id &&
            !form?.post
        ) {
            setReadyToSubmit(false)
        } else {
            setReadyToSubmit(true)
        }
    }, [form])


    return (
        <div className="search-customer-comp-div">
            <form action="" onSubmit={handleSubmit}>
                <div>
                    <NormalInput label='Enter something...' name='search_key' value={form?.search_key || ''} onChangeFun={handleChange} isRequired={false} />
                    <small>Search using customer id, customer name, address, place and contacts</small>
                </div>
                <SelectInput label='City' name='city_id' values={cityList?.map((a) => ({ ...a, selected: a.value === form?.city_id }))} onChangeFun={handleChange} isRequired={false}
                    firstOption={{ option: 'Select...', value: '' }} />
                {posts?.[0] && <SelectInput label='Post Offices' name='post' values={posts?.map((a) => ({ ...a, selected: a.value === form?.post }))} onChangeFun={handleChange} isRequired={false}
                    firstOption={{ option: 'Select...', value: '' }} />}
                <div>
                    <NormalInput label='Search product...' name='product_search' value={form?.product_search || ''} onChangeFun={handleChange} isRequired={false} />
                    <small>Search variant code / variant name</small>
                </div>
                <SingleButton type={'submit'} name={'Search Customer'} classNames={'lg btn-tertiary'} style={{ width: "100%" }}
                    disabled={!readyToSubmit} />
                <p className='reset-text' onClick={resetInputs}>Reset options</p>
            </form>
        </div>
    )
}

export default SearchCustomer