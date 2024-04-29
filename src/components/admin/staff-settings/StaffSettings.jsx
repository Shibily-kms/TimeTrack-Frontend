import React, { useEffect, useState } from 'react'
import './staff-settings.scss'
import { adminAxios, userAxios } from '../../../config/axios'
import { useDispatch } from 'react-redux'
import { toast } from '../../../redux/features/user/systemSlice'
import SpinWithMessage from '../../common/spinners/SpinWithMessage'
import NormalInput from '../../common/inputs/NormalInput'
import SelectInput from '../../common/inputs/SelectInput'
import MultiSelect from '../../common/inputs/MultiSelect'
import SingleButton from '../../common/buttons/SingleButton'

const StaffSettings = ({ setModal, staffId }) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState('fetch')
    const [form, setForm] = useState({ staff_id: staffId, punch_type: 'software', auto_punch_out: null, origins_list: [] })
    const [punchTypes, setPunchTypes] = useState([])
    const [originList, setOriginList] = useState([])
    const [selected, setSelected] = useState([])



    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleMultiSelect = (value) => {
        setForm({
            ...form,
            origins_list: value.map((item) => item.value)
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading('update')
        adminAxios.put('/staff/settings', form).then((response) => {
            dispatch(toast.push.success({ message: 'Settings updated' }))
            setModal({ status: false })
            setLoading('')
        }).catch((error) => {
            dispatch(toast.push.error({ message: error?.message }))
            setLoading('')
        })
    }

    useEffect(() => {
        adminAxios.get(`/staff/${staffId}`).then((response) => {
            adminAxios.get('/access-origins').then((result) => {
                let all = [], selected = []
                result?.data?.map((value) => {
                    if (response?.data?.origins_list?.includes(value)) {
                        selected.push({ label: value, value })
                    }
                    all.push({ label: value, value })
                    return;
                })
                setOriginList(all)
                setSelected(selected)
                setLoading('')

            })

            setForm({ ...form, staff_id: staffId, punch_type: response?.data?.punch_type || 'software', auto_punch_out: response?.data?.auto_punch_out || null })
            setPunchTypes([
                { option: 'Software', value: 'software', selected: response.data?.punch_type === 'software' },
                { option: 'Scanner', value: 'scanner', selected: response.data?.punch_type === 'scanner' }
            ])
        }).catch((error) => {
            setLoading('')
            dispatch(toast.push.error({ message: 'Invalid staff Id' }))
        })
    }, [])


    return (
        <div className="staff-settings-div">
            {loading === 'fetch'
                ? <SpinWithMessage load height={'200px'} />
                : <form action="" onSubmit={handleSubmit}>
                    <SelectInput label='Punch Type' name='punch_type' values={punchTypes} onChangeFun={handleChange} />
                    {form?.punch_type === 'software' &&
                        <NormalInput label='Auto punch out time' name='auto_punch_out' type='time' onChangeFun={handleChange} value={form?.auto_punch_out} />}
                    <MultiSelect label='Allowed Origins' name='origins_list' values={originList} selectedValue={selected}
                        onChangeFun={handleMultiSelect} />
                    <SingleButton type={'submit'} loading={loading === 'update'} name={'Update Settings'} style={{ width: '100%' }} classNames={'lg btn-tertiary'} />
                </form>}
        </div>
    )
}

export default StaffSettings