import React, { useState } from 'react'
import { adminAxios } from '../../../config/axios'
import { toast } from '../../../redux/features/user/systemSlice'
import NormalInput from '../../common/inputs/NormalInput'
import SingleButton from '../../common/buttons/SingleButton'
import { useDispatch } from 'react-redux'

function EditDesignation({ setModal, editData, setData }) {
    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
        _id: editData?.designation_id,
        designation: editData?.Designation
    })

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (form._id) {
            setLoading(true)
            adminAxios.put('/designation', form).then(() => {
                setData((prev) => prev.map((obj) => {
                    if (form._id === obj.designation_id) {
                        return {
                            ...obj,
                            Designation: form.designation
                        }
                    }
                    return obj
                }))
                setModal('')
                dispatch(toast.push.success({ message: 'Updated' }))
                setLoading(false)
            }).catch((error) => {
                dispatch(toast.push.error({ message: error.message }))
                setLoading(false)
            })
        } else {
            dispatch(toast.push.warning({ message: "Some error, Try again!" }))
        }
    }


    return (
        <div className='add-design'>
            <div className="inputs">
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <NormalInput label='Designation' name='designation' value={form?.designation} onChangeFun={handleChange} />
                    <SingleButton name={'Update'} loading={loading} classNames={'lg btn-tertiary'} style={{ width: '100%' }} />
                </form>
            </div>
        </div>
    )
}

export default EditDesignation