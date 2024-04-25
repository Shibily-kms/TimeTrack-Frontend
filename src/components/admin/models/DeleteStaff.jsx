import React, { useEffect, useState } from 'react'
import './delete-staff.scss'
import { toast } from '../../../redux/features/user/systemSlice'
import { adminAxios } from '../../../config/axios'
import { BiLoaderAlt } from 'react-icons/bi'
import RadioInput from '../../../components/common/inputs/RadioInput'
import NormalInput from '../../common/inputs/NormalInput'
import SingleButton from '../../common/buttons/SingleButton'
import { useDispatch } from 'react-redux'

function DeleteStaff({ setModal, setData, deleteId }) {
    const dispatch = useDispatch()
    const [form, setForm] = useState({ type: null, message: '' })
    const [loading, setLoading] = useState(null)
    const [hide, setHide] = useState(true)

    useEffect(() => {
        if (form.type === 'hard' || form.message.length > 4) {
            setHide(false)
        } else {
            setHide(true)
        }
    }, [form])


    const handleChoose = (e) => {
        setForm({ ...form, type: e.target.value })
    }

    const handleChange = (e) => {
        setForm({ ...form, message: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const ask = window.confirm('Are you delete this staff ?')
        if (ask) {
            if (form.type) {
                setLoading(true)
                adminAxios.delete(`/staff?id=${deleteId}&type=${form.type}&message=${form.message}`).then(() => {
                    setData((state) => ({
                        ...state,
                        delete: true,
                        deleteReason: {
                            date: new Date(),
                            reason: form?.message || 'Hard Deleted'
                        },
                    }))
                    setModal('')
                    setLoading(false)
                }).catch((error) => {
                    dispatch(toast.push.error({ message: error.message }))
                    setModal('')
                    setLoading(false)
                })
            } else {
                dispatch(toast.push.error({ message: 'Choose any option' }))
            }
        } else {
            setModal('')
        }
    }


    return (
        <div className='delete-staff'>
            <div className="boarder">
                <h4>Reasons for delete a staff :</h4>
                <form action="" onSubmit={handleSubmit}>
                    <div className="radio-inputs">
                        <RadioInput label={'Rectification / Removal'} id='hard' name={'reason'} onChangeFun={handleChoose} value={'hard'} />
                        <RadioInput label={'Left the company'} id='soft' name={'reason'} onChangeFun={handleChoose} value={'soft'} />
                    </div>
                    {form.type === 'soft' && <NormalInput name='message' value={form?.message} onChangeFun={handleChange} label='Type Reason' />}

                    <SingleButton type={hide ? 'button' : 'submit'} classNames={hide ? "lg btn-gray" : "lg btn-danger"} loading={loading}
                        name={form.type === 'soft' ? 'Leave' : 'Delete'} style={{ width: '100%' }} />
                </form>
            </div>

        </div>
    )
}

export default DeleteStaff