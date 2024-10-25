import React from 'react'
import './filter-customer.scss'
import NormalInput from '../../../components/common/inputs/NormalInput'
import { TbSquareLetterCFilled } from "react-icons/tb";


const FilterCustomer = () => {
    return (
        <div className='filter-customer-comp-div'>
            <form action="">
                <NormalInput label='Type here' name='s' type='text' isRequired={false} rightIcon={<TbSquareLetterCFilled />} />
            </form>
        </div>
    )
}

export default FilterCustomer