import React, { useEffect, useState } from 'react'
import './style.scss'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie';
import { RxEyeClosed, RxEyeOpen } from 'react-icons/rx';
import Image from '../../../assets/images/alliance-logo.png'
import NormalInput from '../../../components/common/inputs/NormalInput';
import SingleButton from '../../../components/common/buttons/SingleButton';
import MobileInput from '../../../components/common/inputs/MobileInput'
import { toast } from '../../../redux/features/user/systemSlice'
import { getDeviceAndBrowserInfo } from '../../../assets/javascript/device-helpers'
import { ttSv2Axios } from '../../../config/axios';
import { setUser } from '../../../redux/features/user/authSlice'

function Login() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [show, setShow] = useState(false)
    const [form, setForm] = useState({ user_name: null, primary_number: {}, password: null })
    const [loading, setLoading] = useState()
    const acc_tkn = Cookies.get('_acc_tkn');
    const DVC_ID = Cookies.get('DVC_ID');


    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const handleMobileNumber = (mobData) => {
        setForm({
            ...form,
            [mobData.name]: mobData?.number
                ? {
                    country_code: mobData?.country_code || null,
                    number: mobData?.number || null
                }
                : undefined
        })
    }

    const onSubmit = async (e) => {
        e.preventDefault();

        // Validation form
        if (!form?.primary_number?.number || form?.primary_number?.number?.length < 7) {
            dispatch(toast.push.error({ message: 'Enter valid country mobile number formate' }))
            return;
        }

        // Staff Login
        const loginCredentials = {
            country_code: form?.primary_number?.country_code || null,
            mobile_number: form?.primary_number?.number || null,
            password: form?.password || null,
        }

        setLoading(true)
        ttSv2Axios.post('/auth/account-sign-in', loginCredentials).then(async (signResponse) => {

            if (signResponse?.data?.redirect) {
                // Redirect to 2FA 
            }

            if (signResponse?.data?.authentication && !signResponse?.data?.redirect) {
                // Token Generate
                await loginTokenSetup(signResponse?.data?.acc_id, dispatch, navigate)
                setLoading(false)
            }

        }).catch((error) => {
            dispatch(toast.push.error({ message: error.message }))
            setLoading(false)
        })
    }

    useEffect(() => {
        if (DVC_ID && acc_tkn) {
            navigate('/?page=home')
        } else {
            Cookies.set('logged_in', 'no', {
                secure: false, // Set to `true` in production (for HTTPS)
                // domain: '.domain.com', // Allows cookie sharing across subdomains
                sameSite: 'lax', // Helps prevent CSRF attacks , use 'strict' on host,
                path: '/',
                expires: 40
            });
        }

        // eslint-disable-next-line
    }, [])

    return (
        <div className='auth-comp-main-div'>
            <div className="auth-comp">
                <div className="left-div">
                    <div className="image-div">
                        <img src={Image} alt='login-svg' />
                    </div>
                    <h3>Account Sign In</h3>
                    <p>Login your account using mobile number and password</p>

                </div>
                <div className="right-div">
                    <div className="section-div  input-section">
                        <form onSubmit={onSubmit}>
                            <MobileInput onChangeFun={handleMobileNumber} name='primary_number'
                                value={`${form?.primary_number?.country_code}${form?.primary_number?.number}`}
                                label='Primary number' onlyCountries={['in']} />
                            <NormalInput label={'Password'} name='password' id='password' rightIcon={show ? <RxEyeOpen /> : <RxEyeClosed />}
                                onChangeFun={handleChange} value={form?.password} type={show ? 'text' : 'password'} rightIconAction={() => setShow(!show)} />

                            <SingleButton type={'submit'} name={'Sign In'} classNames={'lg btn-tertiary txt-center'}
                                style={{ width: '100%' }} loading={loading} />

                            <div className="forgot-option">
                                <p onClick={() => navigate('/auth/forgot-password')}>Forgot Password ?</p>
                            </div>


                        </form>
                    </div>
                    <div className="description">
                        <p>The Staff Account Login system provides secure access through a mobile number
                            and password, streamlining authentication and ensuring quick, efficient access
                            to work-related information.</p>
                    </div>
                </div>

            </div>

        </div>
    )
}

export default Login


export const loginTokenSetup = async (acc_id, dispatch, navigate) => {
    const dvcId = Cookies?.get('DVC_ID');

    const tokenCredentials = {
        acc_id: acc_id,
        dvc_id: dvcId,
        new_device: await getDeviceAndBrowserInfo()
    }

    ttSv2Axios.post('/auth/take-token', tokenCredentials).then((tokenResponse) => {

        // Data store in cookie
        const cookieOptions = {
            secure: false, // Set to `true` in production (for HTTPS)
            // domain: '.domain.com', // Allows cookie sharing across subdomains
            sameSite: 'lax', // Helps prevent CSRF attacks , use 'strict' on host,
            path: '/',
            expires: 40
        };

        Cookies.set('_acc_tkn', tokenResponse?.data?.access_token, cookieOptions);
        Cookies.set('_rfs_tkn', tokenResponse?.data?.refresh_token, cookieOptions);
        Cookies.set('DVC_ID', tokenResponse?.data?.dvc_id, cookieOptions);
        Cookies.set('logged_in', 'yes', cookieOptions);

        // Store in redux
        dispatch(setUser({
            dvc_id: tokenResponse?.data?.dvc_id,
            acc_id: tokenResponse?.data?.acc_id,
            designation_id: tokenResponse?.data?.designation_id,
            refresh_token: tokenResponse?.data?.refresh_token
        }))

        //Navigate to home
        navigate('/?page=home')

    }).catch((error) => {
        dispatch(toast.push.error({ message: error.message }))
    })

    return
}