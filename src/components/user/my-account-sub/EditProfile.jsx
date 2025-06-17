import React, { useEffect, useState } from 'react'
import './edit-profile.scss'
import { useDispatch, useSelector } from 'react-redux'
import { ttSv2Axios } from '../../../config/axios'
import { toast } from '../../../redux/features/user/systemSlice'
import NormalInput from '../../common/inputs/NormalInput'
import SelectInput from '../../common/inputs/SelectInput'
import SingleButton from '../../common/buttons/SingleButton'
import { blood_groups } from '../../../assets/javascript/const-data'

const EditProfile = ({ userData, setUserData, setModal }) => {
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.userAuth)
    const [loading, setLoading] = useState('')
    const [form, setForm] = useState({})
    const [genderList, setGenderList] = useState([])
    const [bloodGroups, setBloodGroups] = useState([])

    useEffect(() => {

        setForm({
            gender: userData?.gender,
            blood_group: userData?.blood_group,
            address: userData?.address?.address,
            place: userData?.address?.place,
            post: userData?.address?.post,
            pin_code: userData?.address?.pin_code,
            district: userData?.address?.district,
            state: userData?.address?.state,
            country: userData?.address?.country,
        })

        setGenderList([
            { option: 'Select...', value: "" },
            { option: 'Male', value: "Male", selected: userData?.gender === 'Male' },
            { option: 'Female', value: "Female", selected: userData?.gender === 'Female' },
            { option: 'Other', value: "Other", selected: userData?.gender === 'Other' },
        ])
        setBloodGroups(blood_groups.map((a) => ({ option: `${a}ve`, value: a, selected: a === userData?.blood_group })))

        // eslint-disable-next-line
    }, [userData])

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading('update')
        ttSv2Axios.put(`/worker/account/${user?.acc_id}/address`, form).then(() => {
            setUserData((state) => ({
                ...state,
                gender: form.gender || null,
                blood_group: form.blood_group || null,
                address: {
                    address: form.address || null,
                    place: form.place || null,
                    post: form.post || null,
                    pin_code: form.pin_code || null,
                    district: form.district || null,
                    state: form.state || null,
                    country: form.country || null,
                }
            }))
            setLoading('')
            setModal({ status: false })
        }).catch((error) => {
            setLoading('')
            dispatch(toast.push.error({ message: error.message }))
        })
    }


    return (
        <div className="edit-profile-div">
            <p className='smallTD2'>Update your address and gender. Date of birth and profession information cannot be updated</p>
            <form action="" onSubmit={handleSubmit}>
                <div className="input-section">
                    <SelectInput label='Gender' name='gender' values={genderList} onChangeFun={handleChange} />
                    <SelectInput name='blood_group' id={'blood_group'} values={bloodGroups}
                        onChangeFun={handleChange} label='Blood Group' firstOption={{ option: 'Select...', value: '' }} isRequired={false} />
                    <NormalInput label='Address' name='address' value={form?.address} onChangeFun={handleChange} isRequired={false} />
                    <NormalInput label='Place' name='place' value={form?.place} onChangeFun={handleChange} />
                    <NormalInput label='Post Office' name='post' value={form?.post} onChangeFun={handleChange} />
                    <NormalInput label='Pin Code' name='pin_code' type='number' value={form?.pin_code} onChangeFun={handleChange}
                        max={999999} min={111111} isRequired={false} />
                    <NormalInput label='District' name='district' value={form?.district} onChangeFun={handleChange} isRequired={false} />
                    <NormalInput label='State' name='state' value={form?.state} onChangeFun={handleChange} />
                    <NormalInput label='Country' name='country' value={form?.country} onChangeFun={handleChange} />
                </div>
                <SingleButton type={'submit'} name={'Update'} classNames={'lg btn-tertiary'} loading={loading === 'update'} style={{ width: '100%' }} />
            </form>
        </div>
    )
}

export default EditProfile