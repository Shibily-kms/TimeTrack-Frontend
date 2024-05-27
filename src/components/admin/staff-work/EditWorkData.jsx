import React, { useState, useEffect } from 'react'
import './edit-work-data.scss'
import { adminAxios } from '../../../config/axios'
import { toast } from '../../../redux/features/user/systemSlice'
import NormalInput from '../../common/inputs/NormalInput'
import SingleButton from '../../common/buttons/SingleButton'
import { useDispatch } from 'react-redux'

function EditWorkData({ data, setModal }) {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({ punch_in: null, punch_out: null })

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handelSubmit = (e) => {
        e.preventDefault();
        const ask = window.confirm('Are you sure you want to update this work?')

        if (ask) {
            setLoading(true)
            const date = `${data.year}-${(data.month + 1).toString().padStart(2, '0')}-${data.date.toString().padStart(2, '0')}`

            adminAxios.put('/work-analyze', { ...form, date, staff_id: data.staff_id }).then(() => {
                setLoading(false)
                dispatch(toast.push.success({ message: 'Updated. Refresh now!' }))
                setModal({ open: false })
            }).catch((error) => {
                dispatch(toast.push.error({ message: error.message }))
            })
        }
    }

    useEffect(() => {
        setForm({
            punch_in: data?.punch?.in?.split(':').slice(0, 2).join(':'),
            punch_out: data?.punch?.out?.split(':').slice(0, 2).join(':') || null
        })
    }, [data])

    return (
        <div className='edit-work-data'>
            <form action="" onSubmit={handelSubmit}>
                <NormalInput label='Punch In' id={'punch_in'} name='punch_in' value={form.punch_in || ''} onChangeFun={handleChange} type='time' />
                <NormalInput label='Punch Out' id={'punch_out'} name='punch_out' value={form.punch_out || ''} onChangeFun={handleChange} type='time'
                    isRequired={false} />
                <SingleButton name={'Update'} type={loading === 'submit' ? 'button' : 'submit'}
                    loading={loading === 'submit'} style={{ width: '100%' }} classNames={'lg btn-tertiary'} />
            </form>
        </div>
    )
}

export default EditWorkData