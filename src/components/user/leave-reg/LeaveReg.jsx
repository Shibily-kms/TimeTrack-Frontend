import React, { useState } from 'react'
import './leave-reg.scss'
import SingleButton from '../../common/buttons/SingleButton'
import NormalInput from '../../common/inputs/NormalInput'
import SelectInput from '../../common/inputs/SelectInput'
import AlertBox from '../../common/alert/AlertBox'
import { userAxios } from '../.././../config/axios'
import { toast } from '../../../redux/features/user/systemSlice'
import { useDispatch } from 'react-redux'
import { YYYYMMDDFormat } from '../../../assets/javascript/date-helper'


const LeaveReg = ({ setModal, setData }) => {
    //type 0 ==> Half Day
    //type 1 ==> Full Day
    const [form, setForm] = useState({ leave_type: 0 })
    const dispatch = useDispatch()
    const [loading, setLoading] = useState('')

    const leaveReasons = [
        { option: 'Emergency', value: "Emergency" },
        { option: 'Personal affairs', value: "Personal affairs" },
        { option: 'Health issues', value: "Health issues" },
        { option: 'Other', value: "other" },
    ]

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleChangeType = (leave_type) => {
        setForm({
            ...form,
            leave_type: leave_type,
            end_date: leave_type === 0 && form?.from_date ? form?.from_date : form?.end_date || ''
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading('submit')
        userAxios.post('/leave-application', form).then((response) => {
            setData((state) => [response?.data, ...state])
            dispatch(toast.push.success({ message: 'Leave application submitted' }))
            setModal({ status: false })
            setLoading('')
        }).catch((error) => {
            setLoading('')
            dispatch(toast.push.error({ message: error.message }))
        })

    }

    return (
        <div className="leave-reg-div">
            <div className="choose-type-div">
                <SingleButton name={'Half Day'} classNames={form?.leave_type ? 'btn-gray' : 'btn-tertiary'} onClick={() => handleChangeType(0)} />
                <SingleButton name={'Full Day'} classNames={form?.leave_type ? 'btn-tertiary' : 'btn-gray'} onClick={() => handleChangeType(1)} />
            </div>
            {form?.reason === 'Health issues' && <AlertBox messages={'Medical certificate should be submitted if required by admin'} />}
            <form action="" onSubmit={handleSubmit}>
                <NormalInput label={form?.leave_type ? 'From Date' : 'Date'} type='date' name='from_date' value={form?.from_date} onChangeFun={handleChange}
                    min={YYYYMMDDFormat(new Date())} />
                {form?.leave_type ? <NormalInput label='End Date' type='date' name='end_date' value={form?.end_date} onChangeFun={handleChange} /> : ''}
                <SelectInput label='Reason' name='reason' onChangeFun={handleChange} values={leaveReasons}
                    firstOption={{ option: 'Select...', value: '' }} />
                <NormalInput label='Comment' type='text' name='comment' value={form?.comment} onChangeFun={handleChange} isRequired={false} />
                <SingleButton name={'Register a Leave'} classNames={'btn-tertiary lg'} style={{ width: '100%' }} loading={loading === 'submit'} />
            </form>
        </div>
    )
}

export default LeaveReg