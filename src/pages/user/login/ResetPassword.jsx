import React, { useEffect, useState } from 'react'
import './style.scss'
import Image from '../../../assets/images/alliance-logo.png'
import NormalInput from '../../../components/common/inputs/NormalInput'
import SingleButton from '../../../components/common/buttons/SingleButton'
import { toast } from '../../../redux/features/user/systemSlice'
import { useDispatch } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { ttSv2Axios } from '../../../config/axios'
import { RxEyeClosed, RxEyeOpen } from 'react-icons/rx';

const ResetPassword = () => {
    const [form, setForm] = useState({ new_password: null, confirm: null })
    const [loading, setLoading] = useState(false)
    const [show, setShow] = useState(false)
    const dispatch = useDispatch()
    const location = useLocation()
    const navigate = useNavigate()

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
        ttSv2Axios.post('/auth/reset-text-password', {
            ...form,
            country_code: location.state.country_code,
            mobile_number: location.state.mobile_number
        }).then(() => {
            dispatch(toast.push.success({ message: 'Your Password is changed. Login now!' }))
            setLoading(false)
            navigate('/auth/sign-in')
        }).catch((error) => {
            dispatch(toast.push.error({ message: error.message }))
            setLoading(false)
        })
    }

    useEffect(() => {
        if (!location?.state || !location?.state?.mobile_number) {
            navigate('/auth/sign-in')
        }
    }, [location?.state])

    return (
        <div className="auth-comp-main-div">
            <div className="auth-comp">
                <div className="left-div">
                    <div className="image-div">
                        <img src={Image} alt='login-svg' />
                    </div>
                    <h3>Reset Password</h3>
                    <p>Enter new password for reset.</p>

                </div>
                <div className="right-div">
                    <div className="section-div  input-section">
                        <form onSubmit={handleSubmit}>
                            <NormalInput label={'New Password'} name='new_password' id={'new_password'} type={show ? 'text' : 'password'}
                                onChangeFun={handleChange} value={form?.new_password} rightIcon={show ? <RxEyeOpen /> : <RxEyeClosed />}
                                rightIconAction={() => setShow(!show)} />

                            <NormalInput label={'Confirm Password'} name='confirm' id={'confirm'} type={show ? 'text' : 'password'}
                                onChangeFun={handleChange} value={form?.confirm} rightIcon={show ? <RxEyeOpen /> : <RxEyeClosed />}
                                rightIconAction={() => setShow(!show)} />

                            <SingleButton type={'submit'} name={'Submit'} classNames={'lg btn-tertiary txt-center'}
                                style={{ width: '100%' }} loading={loading} />

                        </form>
                        <div className="description">
                            <p>Please create a new password for your account. Your new password should be strong and unique,
                                containing at least 6 characters. After entering your new password, confirm it by typing it
                                again in the confirmation field. Once submitted, you'll be able to log in with your new password.</p>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    )
}

export default ResetPassword