import React, { useEffect, useState } from 'react'
import './delete-staff.scss'
import { toast } from '../../../redux/features/user/systemSlice'
import { ttCv2Axios, workerAxios } from '../../../config/axios'
import NormalInput from '../../common/inputs/NormalInput'
import SingleButton from '../../common/buttons/SingleButton'
import { useDispatch } from 'react-redux'

function DeleteStaff({ setModal, setData, deleteId }) {
    const dispatch = useDispatch()
    const [form, setForm] = useState({ resign_date: null, reason: null })
    const [loading, setLoading] = useState(null)
    const [hide, setHide] = useState(true)

    useEffect(() => {
        if (form?.reason?.length > 4 && form?.resign_date) {
            setHide(false)
        } else {
            setHide(true)
        }
    }, [form])

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const ask = window.confirm('Are you delete this account ?')
        if (ask) {
            setLoading(true)
            ttCv2Axios.delete(`/worker/account/${deleteId}?resign_date=${form.resign_date}&reason=${form.reason}`).then(() => {
                setData((state) => ({
                    ...state,
                    delete: true,
                    deleteReason: {
                        date: new Date(),
                        reason: form?.reason || 'Hard Deleted'
                    },
                    resign_date: form?.resign_date
                }))
                setModal('')
                setLoading(false)
            }).catch((error) => {
                dispatch(toast.push.error({ message: error.message }))
                setModal('')
                setLoading(false)
            })
        }
    }


    return (
        <div className='delete-staff'>
            <div className="boarder">
                <form action="" onSubmit={handleSubmit}>
                    <NormalInput name='resign_date' type='date' value={form?.resign_date} onChangeFun={handleChange} label='Resign date' />
                    <NormalInput name='reason' value={form?.reason} onChangeFun={handleChange} label='Reason' />

                    <SingleButton type={hide ? 'button' : 'submit'} classNames={hide ? "lg btn-gray" : "lg btn-danger"} loading={loading}
                        name={form.type === 'soft' ? 'Leave' : 'Delete'} style={{ width: '100%' }} />

                    <p className='smallTD1' >
                        Staff accounts can be deleted in two ways: soft deletion, which deactivates the account, and hard deletion,
                        which permanently removes it. Both are managed by the system software.
                    </p>
                </form>
            </div>

        </div>
    )
}

export default DeleteStaff