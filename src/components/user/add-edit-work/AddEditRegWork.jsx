import React, { useState } from 'react'
import './style.scss';
import NormalInput from '../../common/inputs/NormalInput'
import SelectInput from '../../common/inputs/SelectInput'
import SingleButton from '../../common/buttons/SingleButton';
import { toast } from '../../../redux/features/user/systemSlice'
import { useDispatch } from 'react-redux';
import { adminAxios, userAxios } from '../../../config/axios';
import { addNewRegularWork, updateRegularWork } from '../../../redux/features/user/dayWorksSlice'

const AddEditRegWork = ({ updateData, setModal, admin, staff_id, setData }) => {
    const baseApiAxios = admin ? adminAxios : userAxios
    const [form, setForm] = useState({
        title: updateData?.title || '',
        type: updateData?.repeat_type || 'daily',
        days: [...(updateData?.weekly || []), ...(updateData?.monthly || [])]
    })
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)

    const repeatTypes = [
        { option: 'Daily', value: 'daily', selected: updateData?.repeat_type === 'daily' },
        { option: 'Weekly', value: 'weekly', selected: updateData?.repeat_type === 'weekly' },
        { option: 'Monthly', value: 'monthly', selected: updateData?.repeat_type === 'monthly' }
    ]

    const weeks = [0, 1, 2, 3, 4, 5, 6]
    const days = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })

        if (e.target.name === 'type') {
            setForm({
                ...form,
                [e.target.name]: e.target.value,
                days: []
            })
        }
    }

    const handleDaySelect = (selectedDay) => {
        if (form?.days.includes(selectedDay)) {
            setForm({
                ...form,
                days: form?.days.filter((day) => day !== selectedDay)
            })
        } else {
            setForm({
                ...form,
                days: [...form.days, selectedDay]
            })
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (form?.type !== 'daily' && form?.days.length < 1) {
            dispatch(toast.push.error({ message: 'Select any days' }))
            return;
        }

        setLoading(true)

        if (updateData) {
            baseApiAxios.put('/regular-work', { ...form, work_Id: updateData._id }).then((response) => {
                if (admin) {
                    setData((state) => {
                        return state?.map((item) => {
                            if (item._id === updateData._id) {
                                return response.data
                            }
                            return item
                        })
                    })
                } else {
                    dispatch(updateRegularWork(response.data))
                }
                dispatch(toast.push.success({ message: "Updated" }))
                setLoading(false)
                setModal({ status: false })
            }).catch((error) => {
                dispatch(toast.push.error({ message: error?.message || "Error founded, Try ones more!" }))
                setLoading(false)
            })
        } else {
            baseApiAxios.post('/regular-work', { ...form, self: admin ? false : true, staff_id }).then((response) => {
                if (admin) {
                    setData((state) => ([...state, response.data]))
                } else {
                    dispatch(addNewRegularWork(response.data))
                }
                dispatch(toast.push.success({ message: "New regular work added to list" }))
                setLoading(false)
                setModal({ status: false })
            }).catch((error) => {
                dispatch(toast.push.error({ message: error?.message || "Error founded, Try ones more!" }))
                setLoading(false)
                setModal({ status: false })
            })
        }
    }

    return (
        <div className="addEditRegWork-div">
            <form action="" onSubmit={handleSubmit}>
                <NormalInput label='Title' name='title' type={'text'} value={form?.title} onChangeFun={handleChange} />
                <SelectInput label='Repeat' values={repeatTypes} name='type' onChangeFun={handleChange} />
                <div className="select-button-option-div">
                    {/* Weekly */}
                    {form.type === 'weekly' && weeks.map((day, index) => <div key={day} className={form?.days.includes(day) ? "option-div selected" : "option-div"}>
                        <div onClick={() => handleDaySelect(day)}>
                            {daysOfWeek[day]}
                        </div>
                    </div>)}
                    {/* Monthly */}
                    {form.type === 'monthly' && days.map((day, index) => <div key={day} className={form?.days.includes(day) ? "option-div selected" : "option-div"}>
                        <div onClick={() => handleDaySelect(day)}>
                            {day}
                        </div>
                    </div>)}
                </div>
                <SingleButton type={'submit'} style={{ width: '100%' }} classNames={'lg btn-tertiary'} name={'Submit'}
                    loading={loading} />
            </form>
        </div>
    )
}

export default AddEditRegWork