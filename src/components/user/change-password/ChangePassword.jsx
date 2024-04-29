import React, { useState } from 'react'
import './change-password.scss'
import { userAxios } from '../../../config/axios'
import { toast } from 'react-hot-toast'
import { BiLoaderAlt } from 'react-icons/bi'
import { RxEyeClosed, RxEyeOpen } from 'react-icons/rx';
import NormalInput from '../../../components/common/inputs/NormalInput'
import SingleButton from '../../../components/common/buttons/SingleButton'


function ChangePassword({ setModal }) {
    const [form, setForm] = useState({ current: null, newPass: null, confirm: null })
    const [loading, setLoading] = useState(false)
    const [show, setShow] = useState(false)


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

        if (form?.newPass.length < 6) {
            toast.error('Password must have 6 letters')
            return;
        }
        if (form.newPass !== form.confirm) {
            toast.error('Password not match !')
            return;
        }

        if (!isValidPassword(form.newPass)) {
            toast.error("Clear Space in password");
            return;
        }

        setLoading(true)
        userAxios.post('/change-password', form).then((response) => {
            toast.success(response.data.message)
            setLoading(false)
            setModal({ status: false })
        }).catch((error) => {
            toast.error(error.response.data.message)
            setLoading(false)
        })

    }
    return (
        <div className="change-password-div">
            <div className="inputs">
                <form onSubmit={handleSubmit}>
                    <NormalInput label={'Current Password'} name='current' id={'current'} type={show ? 'text' : 'password'}
                        onChangeFun={handleChange} value={form?.current} rightIcon={show ? <RxEyeOpen /> : <RxEyeClosed />}
                        rightIconAction={() => setShow(!show)} />

                    <NormalInput label={'New Password'} name='newPass' id={'newPass'} type={show ? 'text' : 'password'}
                        onChangeFun={handleChange} value={form?.newPass} rightIcon={show ? <RxEyeOpen /> : <RxEyeClosed />}
                        rightIconAction={() => setShow(!show)} />

                    <NormalInput label={'Confirm Password'} name='confirm' id={'confirm'} type={show ? 'text' : 'password'}
                        onChangeFun={handleChange} value={form?.confirm} rightIcon={show ? <RxEyeOpen /> : <RxEyeClosed />}
                        rightIconAction={() => setShow(!show)} />

                    <SingleButton name={'Update'} loading={loading} type={'button'} classNames={'lg btn-tertiary'} style={{ width: '100%' }} />

                </form>
            </div >
        </div >
    )
}

export default ChangePassword