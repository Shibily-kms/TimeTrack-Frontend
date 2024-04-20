import React, { useEffect, useState } from 'react'
import './edit-profile.scss'
import { useDispatch, useSelector } from 'react-redux'
import { userAxios } from '../../../config/axios'
import { toast } from '../../../redux/features/user/systemSlice'
import SpinWithMessage from '../../../components/common/spinners/SpinWithMessage'
import NormalInput from '../../../components/common/inputs/NormalInput'
import SelectInput from '../../../components/common/inputs/SelectInput'
import SingleButton from '../../../components/common/buttons/SingleButton'

const EditProfile = ({ setPageHead }) => {
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.userAuth)
    const [loading, setLoading] = useState('fetch')
    const [form, setForm] = useState({})

    const genderList = [
        { option: 'Select...', value: "" },
        { option: 'Male', value: "Male", selected: user?.gender === 'Male' },
        { option: 'Female', value: "Female", selected: user?.gender === 'Female' },
        { option: 'Other', value: "Other", selected: user?.gender },
    ]


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
                email_id: response.data?.email_id
            })


        }).catch((error) => {
            setLoading('')
            dispatch(toast.push.error({ message: error.message }))
        })

        setPageHead({ title: 'Edit Profile' })
    }, [])


    return (
        <div className="edit-profile-div">
            {loading === 'fetch'
                ? <SpinWithMessage load={loading === 'fetch'} fullView />
                : <>
                    <form action="">
                        <div className="input-section">
                            <NormalInput label='First name' name='first_name' value={form?.first_name} onChangeFun={''} />
                            <NormalInput label='Last name' name='last_name' value={form?.last_name} onChangeFun={''} />
                            <SelectInput label='Gender' name='gender' values={genderList} onChangeFun={''} />
                            <NormalInput label='Address' name='address' value={form?.address} onChangeFun={''} />
                            <NormalInput label='Place' name='place' value={form?.place} onChangeFun={''} />
                            <NormalInput label='Post Office' name='post' value={form?.post} onChangeFun={''} />
                            <NormalInput label='District' name='district' value={form?.district} onChangeFun={''} />
                            <NormalInput label='State' name='state' value={form?.state} onChangeFun={''} />
                            <NormalInput label='Pin Code' name='pin_code' value={form?.pin_code} onChangeFun={''} />
                            <NormalInput label='Email Address' name='email_id' type='email' value={form?.email_id} onChangeFun={''} />
                        </div>
                        <SingleButton name={'Update'} classNames={'lg btn-tertiary'} style={{ width: '100%' }} />
                    </form>
                </>}
        </div>
    )
}

export default EditProfile