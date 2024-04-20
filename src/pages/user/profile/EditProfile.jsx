import React, { useEffect, useState } from 'react'
import './edit-profile.scss'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { userAxios } from '../../../config/axios'
import { toast } from '../../../redux/features/user/systemSlice'
import SpinWithMessage from '../../../components/common/spinners/SpinWithMessage'
import NormalInput from '../../../components/common/inputs/NormalInput'
import SelectInput from '../../../components/common/inputs/SelectInput'
import SingleButton from '../../../components/common/buttons/SingleButton'

const EditProfile = ({ setPageHead }) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { user } = useSelector((state) => state.userAuth)
    const [loading, setLoading] = useState('fetch')
    const [form, setForm] = useState({})
    const [genderList, setGenderList] = useState([])

    useEffect(() => {
        userAxios.get(`/profile?staffId=${user?._id}`).then((response) => {
            setLoading('')
            setForm({
                first_name: response.data?.first_name,
                last_name: response.data?.last_name,
                gender: response.data?.gender,
                address: response.data?.address?.address,
                place: response.data?.address?.place,
                post: response.data?.address?.post,
                district: response.data?.address?.district,
                state: response.data?.address?.state,
                pin_code: response.data?.address?.pin_code,
                email_id: response.data?.email_id,
                contact2: response.data?.contact2,
                whatsapp: response.data?.whatsapp
            })

            setGenderList([
                { option: 'Select...', value: "" },
                { option: 'Male', value: "Male", selected: response.data?.gender === 'Male' },
                { option: 'Female', value: "Female", selected: response.data?.gender === 'Female' },
                { option: 'Other', value: "Other", selected: response.data?.gender === 'Other' },
            ])


        }).catch((error) => {
            setLoading('')
            dispatch(toast.push.error({ message: error.message }))
        })

        setPageHead({ title: 'Edit Profile' })
    }, [])

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading('update')
        userAxios.put('/profile', { ...form, staff_id: user?._id }).then(() => {
            setLoading('')
            navigate('/profile?page=more')
            dispatch(toast.push.success({ message: 'Updated!' }))
        }).catch((error) => {
            setLoading('')
            dispatch(toast.push.error({ message: error.message }))
        })
    }


    return (
        <div className="edit-profile-div">
            {loading === 'fetch'
                ? <SpinWithMessage load={loading === 'fetch'} fullView />
                : <>
                    <form action="" onSubmit={handleSubmit}>
                        <div className="input-section">
                            <NormalInput label='Email Address' name='email_id' type='email' value={form?.email_id} onChangeFun={handleChange} />
                            <SelectInput label='Gender' name='gender' values={genderList} onChangeFun={handleChange}/>
                            <NormalInput label='Address' name='address' value={form?.address} onChangeFun={handleChange} />
                            <NormalInput label='Place' name='place' value={form?.place} onChangeFun={handleChange} />
                            <NormalInput label='Post Office' name='post' value={form?.post} onChangeFun={handleChange} />
                            <NormalInput label='District' name='district' value={form?.district} onChangeFun={handleChange} />
                            <NormalInput label='State' name='state' value={form?.state} onChangeFun={handleChange} />
                            <NormalInput label='Pin Code' name='pin_code' type='number' value={form?.pin_code} onChangeFun={handleChange} max={999999} min={111111}/>
                            <NormalInput label='Mobile number (2)' name='contact2' value={form?.contact2} onChangeFun={handleChange} isRequired={false} max={9999999999} min={5555555555}/>
                            <NormalInput label='Whatsapp' name='whatsapp' value={form?.whatsapp} onChangeFun={handleChange} />
                        </div>
                        <SingleButton type={'submit'} name={'Update'} classNames={'lg btn-tertiary'} loading={loading === 'update'} style={{ width: '100%' }} />
                    </form>
                </>}
        </div>
    )
}

export default EditProfile