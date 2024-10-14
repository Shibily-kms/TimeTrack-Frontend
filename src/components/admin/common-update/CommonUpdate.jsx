import React, { useState } from 'react'
import './style.scss'
import { ttCv2Axios } from '../../../config/axios'
import { toast } from '../../../redux/features/user/systemSlice'
import NormalInput from '../../common/inputs/NormalInput'
import SingleButton from '../../common/buttons/SingleButton'
import { useDispatch } from 'react-redux'

function CommonUpdate({ setModal, setData }) {
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const months = ['Jun', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const [form, setForm] = useState({})

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setLoading(true)

        ttCv2Axios.put('/worker/profile/common-data', form).then(() => {
            setData((state) => state?.map((staff) => {
                if (!staff?.delete) {
                    let updateObj = {
                        current_working_days: Number(form?.current_working_days) || 0,
                    }

                    if (form?.current_working_time) {
                        const timeSplit = form?.current_working_time.split(':')
                        const current_working_time = (timeSplit[0] * 3600) + (timeSplit[1] * 60)
                        updateObj['current_working_time'] = Number(current_working_time) || 0
                    }

                    return {
                        ...staff,
                        ...updateObj
                    }
                }
                return staff
            }))
            setLoading(false)
            setModal({ status: false })
        }).catch((error) => {
            dispatch(toast.push.error({ message: error.message }))
            setLoading(false)
        })
    }

    return (
        <div className='common-update-sub-div'>
            <form action="" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: "column", gap: '15px' }}>
                <NormalInput label={`Working Days (${months[new Date().getMonth()]})`} name='current_working_days' type='number'
                    id={'current_working_days'} value={form?.current_working_days} max={'31'} min={'0'} onChangeFun={handleChange} />
                <NormalInput label='Hours in a Day (HH:MM)' name='current_working_time' id={'current_working_time'} value={form?.current_working_time}
                    pattern="([01][0-9]|2[0-3]):[0-5][0-9]" onChangeFun={handleChange} isRequired={false} />
                <SingleButton name={'Submit'} style={{ width: "100%" }} classNames={'lg btn-tertiary'} loading={loading} />
            </form>
        </div>
    )
}

export default CommonUpdate