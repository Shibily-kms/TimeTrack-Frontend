import React, { useState } from 'react'
import NormalInput from '../../common/inputs/NormalInput'
import SelectInput from '../../common/inputs/SelectInput'
import SingleButton from '../../common/buttons/SingleButton'
import { adminAxios } from '../../../config/axios'
import { useDispatch } from 'react-redux'
import { toast } from '../../../redux/features/user/systemSlice'

const CreateQr = ({ setModal, setQrList }) => {
    const dispatch = useDispatch();
    const [form, setForm] = useState({ qr_type: 'punch' })

    // const typeList = [
    //     { option: 'Punch', value: 'punch' }
    // ]

    const expireList = [
        { option: 'Today', value: '0' },
        { option: 'Tomorrow', value: '1' },
        { option: '7 Days', value: '7' },
        { option: '14 Days', value: '14' },
        { option: '28 Days', value: '28' }
    ]

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        adminAxios.post('/qr-code', form).then((response) => {
            setQrList((state) => [{
                _id: response.data?._id,
                'QR Id': response.data?.qrId,
                'QR Name': response.data?.name,
                'Last Used': 'Not used',
                'Used Count': 0
            }, ...state])
            dispatch(toast.push.success({ message: 'New QR Created' }))
            setModal({ status: false })
        }).catch((err) => {
            dispatch(toast.push.error({ message: err.message }))
        })
    }

    return (
        <div className="qr-code-form-div">
            <form action="" style={{ display: 'flex', flexDirection: 'column', gap: "15px" }} onSubmit={handleSubmit}>
                {/* <SelectInput label='Qr Type' name='qr_type' onChangeFun={handleChange}
                    firstOption={{ option: 'Select...', value: '' }} values={typeList} /> */}
                <NormalInput label='QR Code Name' name='name' value={form?.name} onChangeFun={handleChange} />
                <SelectInput label='Expire Until' name='expire_until' onChangeFun={handleChange}
                    firstOption={{ option: 'Select...', value: '' }} values={expireList} />

                <SingleButton name={'Submit'} style={{ width: '100%' }} classNames={'lg btn-tertiary'} />
            </form>
        </div>
    )
}

export default CreateQr