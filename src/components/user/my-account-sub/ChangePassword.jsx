import React, { useState } from 'react'
import { userAxios } from '../../../config/axios'
import { toast } from '../../../redux/features/user/systemSlice'
import { RxEyeClosed, RxEyeOpen } from 'react-icons/rx';
import NormalInput from '../../common/inputs/NormalInput'
import SingleButton from '../../common/buttons/SingleButton'
import { useDispatch } from 'react-redux'


function ChangePassword({ setModal, setUserData }) {
    const [form, setForm] = useState({ current_password: null, new_password: null, confirm: null })
    const [loading, setLoading] = useState(false)
    const [show, setShow] = useState(false)
    const dispatch = useDispatch()

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        function isValidPassword(password) {
            const pattern = /^\S+$/;
            return pattern.test(password);
        }

        if (form?.new_password.length < 6) {
            dispatch(toast.push.error({ message: 'Password must have 6 letters' }))
            return;
        }
        if (form.new_password !== form.confirm) {
            dispatch(toast.push.error({ message: 'Password not match !' }))
            return;
        }

        if (!isValidPassword(form.new_password)) {
            dispatch(toast.push.error({ message: "Clear Space in password" }));
            return;
        }

        setLoading(true)
        userAxios.post('/v2/auth/change-text-password', form).then(() => {
            setLoading(false)
            setModal({ status: false })
            setUserData((state) => ({
                ...state,
                last_tp_changed: new Date()
            }))
        }).catch((error) => {
            dispatch(toast.push.error({ message: error.message }))
            setLoading(false)
        })

    }


    return (
        <div className="change-password-div">
            <div className="inputs">
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <NormalInput label={'Current Password'} name='current_password' id={'current'} type={show ? 'text' : 'password'}
                        onChangeFun={handleChange} value={form?.current_password} rightIcon={show ? <RxEyeOpen /> : <RxEyeClosed />}
                        rightIconAction={() => setShow(!show)} />

                    <NormalInput label={'New Password'} name='new_password' id={'newPass'} type={show ? 'text' : 'password'}
                        onChangeFun={handleChange} value={form?.new_password} rightIcon={show ? <RxEyeOpen /> : <RxEyeClosed />}
                        rightIconAction={() => setShow(!show)} />

                    <NormalInput label={'Confirm Password'} name='confirm' id={'confirm'} type={show ? 'text' : 'password'}
                        onChangeFun={handleChange} value={form?.confirm} rightIcon={show ? <RxEyeOpen /> : <RxEyeClosed />}
                        rightIconAction={() => setShow(!show)} />

                    <SingleButton name={'Update Password'} loading={loading} classNames={'lg btn-tertiary'} style={{ width: '100%' }} />
                </form>
            </div >
        </div >
    )
}

export default ChangePassword