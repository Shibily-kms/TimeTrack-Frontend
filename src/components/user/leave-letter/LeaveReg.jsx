import React, { useState } from 'react'
import './leave-reg.scss'
import SingleButton from '../../common/buttons/SingleButton'
import NormalInput from '../../common/inputs/NormalInput'
import SelectInput from '../../common/inputs/SelectInput'
import { userAxios } from '../../../config/axios'
import { toast } from '../../../redux/features/user/systemSlice'
import { useDispatch } from 'react-redux'
import { YYYYMMDDFormat } from '../../../assets/javascript/date-helper'
import RadioInput from '../../common/inputs/RadioInput'



const LeaveReg = ({ setModal, setData }) => {
    //type .5 ==> Half Day
    //type 1 ==> Full Day

    const [form, setForm] = useState({})
    const [leave_type, setLeaveType] = useState(.5)
    const dispatch = useDispatch()
    const [loading, setLoading] = useState('')

    const leaveReasons = [
        { option: 'Emergency', value: "Emergency" },
        { option: 'Personal affairs', value: "Personal affairs" },
        { option: 'Health issues', value: "Health issues" },
        { option: 'Other', value: "other" },
    ]

    const handleChange = (e) => {
        if ((e.target.name === 'from_date' || e.target.name === 'to_date') && new Date(e.target.value).getDay() === 0) {
            return dispatch(toast.push.error({ message: "You can't select Sunday" }))
        }

        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleChangeType = (e) => {
        setLeaveType(Number(e.target.value))
        setForm({
            reason: form?.reason || null,
            comment: form?.comment || null
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading('submit')

        const days = []

        if (leave_type === 1) {
            // Select days
            let day = new Date(form?.from_date)
            while (day <= new Date(form?.end_date)) {

                if (day.getDay() !== 0) {
                    days.push([
                        YYYYMMDDFormat(day),
                        leave_type,
                        '09:30',
                        '17:30'
                    ])
                }

                day = new Date(day.setDate(new Date(day).getDate() + 1))
            }
        } else {
            let start_time = form?.time === '1' ? '09:30' : '13:30'
            let end_time = form?.time === '1' ? '13:00' : '17:30'
            days.push([form?.from_date, leave_type, start_time, end_time])
        }

        userAxios.post('/v2/L2/apply', {
            requested_days: days || [],
            reason: form?.reason || null,
            comment: form?.comment || null
        }).then((response) => {
            setData((state) => [response?.data, ...state])
            setModal({ status: false })
            setLoading('')
        }).catch((error) => {
            setLoading('')
            dispatch(toast.push.error({ message: error.message }))
        })

    }

    return (
        <div className="leave-reg-div">
            <div style={{ display: "flex", gap: '15px' }}>
                <RadioInput label={'Half Day'} name={'type'} value={.5} checked={leave_type === .5} onChangeFun={handleChangeType} />
                <RadioInput label={'Full Day'} name={'type'} value={1} checked={leave_type === 1} onChangeFun={handleChangeType} />
            </div>
            <form action="" onSubmit={handleSubmit}>
                <NormalInput label={leave_type === 1 ? 'From Date' : 'Date'} type='date' name='from_date' value={form?.from_date} onChangeFun={handleChange}
                    min={YYYYMMDDFormat(new Date())} />
                {leave_type === 1 ? <NormalInput label='End Date' type='date' name='end_date' value={form?.end_date} onChangeFun={handleChange} /> : ''}
                {leave_type === .5 && <div >
                    <RadioInput label={'Before noon'} name={'time'} value={1} onChangeFun={handleChange} />
                    <RadioInput label={'After noon'} name={'time'} value={2} onChangeFun={handleChange} />
                </div>}
                <SelectInput label='Reason' name='reason' onChangeFun={handleChange} values={leaveReasons}
                    firstOption={{ option: 'Select...', value: '' }} />
                <NormalInput label='Comment' type='text' name='comment' value={form?.comment} onChangeFun={handleChange} isRequired={false} />
                <SingleButton name={'Apply leave'} classNames={'btn-tertiary lg'} style={{ width: '100%' }} loading={loading === 'submit'} />
            </form>
            <p className='smallTD2' style={{ textAlign: 'justify' }}>Sundays are not counted as valid days, and the software automatically clears any Sundays within the selected date range.</p>
        </div>
    )
}

export default LeaveReg

