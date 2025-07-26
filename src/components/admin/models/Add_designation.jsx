import React, { useState } from 'react'
import { adminAxios } from '../../../config/axios'
import { toast } from '../../../redux/features/user/systemSlice'
import NormalInput from '../../common/inputs/NormalInput';
import SingleButton from '../../common/buttons/SingleButton';
import { useDispatch } from 'react-redux';

function Add_designation({ setModel, setData }) {
    const dispatch = useDispatch()
    const [form, setForm] = useState({})
    const [loading, setLoading] = useState(false)
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true)
        adminAxios.post('/designation', form).then((response) => {
            dispatch(toast.push.success({ message: response.message }))
            setData((state) => {
                return [{
                    'Idx No': 0,
                    Designation: response?.data?.designation,
                    designation_id: response?.data?._id,
                    'Staff Count': response?.data?.name?.length || 0,
                }, ...state]
            })
            setModel(null)
            setLoading(false)
        }).catch((error) => {
            dispatch(toast.push.error({ message: error.message }))
            setLoading(false)
        })

    }
    return (
        <div className='add-design'>
            <div className="inputs">
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <NormalInput label={'Designation'} name={'designation'} value={form?.designation} onChangeFun={handleChange} type='text' />
                    <SingleButton name={'Create'} type={'submit'} style={{ width: '100%' }} classNames={'lg btn-tertiary'}
                        loading={loading} />
                </form>
            </div >
        </div >
    )
}

export default Add_designation