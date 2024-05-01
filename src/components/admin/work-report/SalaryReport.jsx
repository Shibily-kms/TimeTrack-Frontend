import React, { useState } from 'react'
import './salary-report.scss'
import { BsFillTrash3Fill } from "react-icons/bs";
import { FaPlus } from "react-icons/fa6";
import SingleButton from '../../common/buttons/SingleButton';
import { findTotalSalaryAmt } from '../../../assets/javascript/calc-helper'
import { createRandomId } from '../../../assets/javascript/id-helper'
import { adminAxios } from '../../../config/axios';
import { toast } from '../../../redux/features/user/systemSlice';
import { useDispatch } from 'react-redux';

const SalaryReport = ({ data, setData, setModal, viewOnly }) => {

    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
        _id: data?._id,
        allowed_salary: data?.allowed_salary || 0,
        allowance: data?.allowance || [
            {
                _id: 'ITEM_01',
                type: 'Food',
                amount: 0
            },
            {
                _id: 'ITEM_02',
                type: 'Petrol',
                amount: 0
            }
        ],
        incentive: data?.incentive || [
            {
                _id: 'ITEM_01',
                type: 'Sales',
                amount: 0
            },
            {
                _id: 'ITEM_02',
                type: 'Service',
                amount: 0
            },
            {
                _id: 'ITEM_03',
                type: 'Turnover',
                amount: 0
            }
        ],
        for_round_amount: data?.for_round_amount || 0
    })

    const handleNormalInput = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value ? Number(e.target.value) : ''
        })
    }

    const handleTypeInput = (e, item, type) => {
        setForm({
            ...form,
            [type]: form[type]?.map((obj) => {
                if (obj._id === item._id) {
                    return {
                        ...obj,
                        [e.target.name]: e.target.value && e.target.name === 'amount'
                            ? Number(e.target.value)
                            : e.target.value
                    }
                }
                return obj
            })

        })
    }

    const addSubItem = (type) => {
        setForm({
            ...form,
            [type]: [
                ...form[type],
                { _id: createRandomId(5, 'ITEM_'), type: '', amount: '' }
            ]
        })
    }

    const removeSubItem = (type, id) => {
        setForm({
            ...form,
            [type]: form[type]?.filter((item) => item._id !== id)
        })
    }

    const handleUpdate = (e) => {
        e.preventDefault();
        if (!viewOnly) {
            setLoading(true)
            adminAxios.put('/analyze/work-report', form).then(() => {
                setData((state) => state.map((a) => {
                    if (a?._id === form?._id) {
                        return {
                            ...a,
                            allowed_salary: form?.allowed_salary,
                            allowance: form?.allowance,
                            incentive: form?.incentive,
                            for_round_amount: form?.for_round_amount
                        }
                    }
                    return a
                }))
                setModal({ status: false })
                setLoading(false)
                dispatch(toast.push.success({ message: "Updated" }))
            }).catch((error) => {
                dispatch(toast.push.error({ message: error.message }))
            })
        }
    }

    return (
        <div className='salary-report-div'>
            <div className="total-show">
                <p>This Month Total Salary</p>
                <h2>₹{parseFloat(findTotalSalaryAmt(form)).toFixed(2)}</h2>
            </div>
            <form action="" onSubmit={handleUpdate}>
                <div className="small-input-div">
                    <span>Attendance basie</span>
                    <input type="number" value={form?.allowed_salary} disabled onChange={handleNormalInput}
                        name='allowed_salary' placeholder='0.00' min={0} />
                </div>
                <div className="small-input-div">
                    <span>Round amount</span>
                    <input type="number" value={form?.for_round_amount} disabled={viewOnly} onChange={handleNormalInput}
                        name='for_round_amount' placeholder='0.00' min={0} />
                </div>

                {(form?.allowance?.[0] || !viewOnly) && <div className="sub-head">
                    <h4>Allowances</h4>
                    {!viewOnly && <SingleButton name={'Add'} classNames={'sm btn-tertiary'} stIcon={<FaPlus />}
                        onClick={() => addSubItem('allowance')} type={'button'} />}

                </div>}
                {form?.allowance?.map((item, index) => <div key={index} className="small-input-div">
                    <input type="text" value={item?.type} disabled={viewOnly} onChange={(e) => handleTypeInput(e, item, 'allowance')}
                        name='type' placeholder={'Item ' + (index + 1)} required />
                    <input type="number" value={item?.amount} disabled={viewOnly} onChange={(e) => handleTypeInput(e, item, 'allowance')}
                        name='amount' placeholder={'0.00'} min={0} required />
                    {!viewOnly && <BsFillTrash3Fill onClick={() => removeSubItem('allowance', item._id)} />}
                </div>)}

                {(form?.allowance?.[0] || !viewOnly) && <div className="sub-head">
                    <h4>Incentives</h4>
                    {!viewOnly && <SingleButton name={'Add'} classNames={'sm btn-tertiary'} stIcon={<FaPlus />}
                        onClick={() => addSubItem('incentive')} type={'button'} />}
                </div>}

                {form?.incentive?.map((item, index) => <div key={index} className="small-input-div">
                    <input type="text" value={item?.type} disabled={viewOnly} onChange={(e) => handleTypeInput(e, item, 'incentive')}
                        name='type' placeholder={'Item ' + (index + 1)} required />
                    <input type="number" value={item?.amount} disabled={viewOnly} onChange={(e) => handleTypeInput(e, item, 'incentive')}
                        name='amount' placeholder={'0.00'} min={0} required />
                    {!viewOnly && <BsFillTrash3Fill onClick={() => removeSubItem('incentive', item._id)} />}
                </div>)}
                {!viewOnly && <SingleButton name={'Update'} classNames={'lg btn-tertiary'}
                    style={{ width: '100%', marginTop: '15px' }} loading={loading} />}
            </form>
        </div>
    )
}

export default SalaryReport