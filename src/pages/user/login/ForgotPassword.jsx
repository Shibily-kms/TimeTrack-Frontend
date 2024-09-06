import React, { useEffect, useState } from 'react'
import './style.scss'
import Image from '../../../assets/images/alliance-logo.png'
import SingleButton from '../../../components/common/buttons/SingleButton'
import { toast } from '../../../redux/features/user/systemSlice'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { userAxios } from '../../../config/axios'
import MobileInput from '../../../components/common/inputs/MobileInput'

const ForgotPassword = () => {
    const OtpLength = 6;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [mobileNumber, setMobileNumber] = useState({});
    const [otpActive, setOtpActive] = useState(false)
    const [otp, setOtp] = useState(new Array(OtpLength).fill(""));
    const [loading, setLoading] = useState(false)
    const [counter, setCounter] = useState(90); // 90 seconds = 1 minutes and 30 seconds
    const [isResendVisible, setIsResendVisible] = useState(false);

    //? Verify Otp
    const verifyOtp = () => {
        const enteredOtp = otp.join('');
        setLoading(true)
        userAxios.post('/v2/auth/otp-v/verify', {
            country_code: mobileNumber.country_code,
            mobile_number: mobileNumber.number,
            way_type: 'sms',
            otp: enteredOtp
        }).then(() => {
            setLoading(false)
            navigate('/auth/setup-new-password', {
                state: {
                    country_code: mobileNumber.country_code,
                    mobile_number: mobileNumber.number,
                    for: 'reset password'
                }
            })
        }).catch((error) => {
            dispatch(toast.push.error({ message: error.message }))
            setLoading(false)
        })
    }

    const handleOtpChange = (element, index) => {

        const value = element.value;

        if (/[^0-9]/.test(value)) return; // Only allow numeric input
        if (element.value.length > 1) return;

        setOtp([...otp.map((d, idx) => (idx === index ? value : d))]);

        // Focus on next input if available
        if (value && element.nextSibling) {
            element.nextSibling.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index !== 0) {
            e.target.previousSibling.focus();
        }
    };

    const handleOtpSubmit = (e) => {
        e.preventDefault();

        const filledInputs = otp.filter((value) => value)
        if (filledInputs?.length === 6) {
            verifyOtp()
        } else {
            dispatch(toast.push.error({ message: 'Enter 6 Digitals' }))
        }


    };

    const handleMobileNumber = (mobData) => {
        if (mobData?.number) {
            setMobileNumber({
                country_code: mobData?.country_code || null,
                number: mobData?.number || null
            })
        }
    }

    useEffect(() => {
        const timer = counter > 0 && setInterval(() => setCounter(counter - 1), 1000);

        if (counter === 0) {
            setIsResendVisible(true);
            clearInterval(timer);
        }

        return () => clearInterval(timer);
    }, [counter]);

    //? Forgot Password

    const sendOtp = () => {
        userAxios.post('/v2/auth/otp-v/send', {
            country_code: mobileNumber.country_code,
            mobile_number: mobileNumber.number,
            way_type: 'sms'
        }).then(() => {
            setOtpActive(true)
            setLoading(false)
        }).catch((error) => {
            dispatch(toast.push.error({ message: error.message }))
            setLoading(false)
        })
    }

    const resendOtp = () => {
        sendOtp()
        setIsResendVisible(false)
        setCounter(300)
    }


    const handleSubmit = (e) => {
        e.preventDefault();

        if (mobileNumber?.number < 7) {
            dispatch(toast.push.error({ message: 'Enter valid Primary number formate' }))
            return;
        }
        setLoading(true)
        sendOtp()
    }

    return (
        <div className="auth-comp-main-div">
            <div className="auth-comp">
                <div className="left-div">
                    <div className="image-div">
                        <img src={Image} alt='login-svg' />
                    </div>
                    {otpActive
                        ? <>
                            <h3>Verify OTP</h3>
                            <p>Enter you received OTP for verification.</p>
                        </>
                        : <>
                            <h3>Forgot Password</h3>
                            <p>Enter your mobile number for OTP verification.</p>
                        </>}
                </div>
                <div className="right-div">
                    {otpActive
                        ? <>
                            <div className="section-div  input-section">
                                <form onSubmit={handleOtpSubmit}>
                                    <div className="otp-input-group">
                                        {otp.map((data, index) => (
                                            <input
                                                className="otp-field"
                                                type="number"
                                                name="otp"
                                                maxLength="1"
                                                key={index}
                                                value={otp[index]}
                                                onChange={(e) => handleOtpChange(e.target, index)}
                                                onKeyDown={(e) => handleKeyDown(e, index)}
                                                onFocus={(e) => e.target.select()}
                                            />
                                        ))}
                                    </div>

                                    <SingleButton type={'submit'} name={'Verify'} classNames={'lg btn-tertiary txt-center'}
                                        style={{ width: '100%' }} loading={loading} />

                                    {isResendVisible
                                        ? <p className='re-send' onClick={() => resendOtp()}>Resend OTP</p>
                                        : <p>Resend OTP in {Math.floor(counter / 60)}:{String(counter % 60).padStart(2, '0')}</p>}
                                </form>
                                <div className="description">
                                    <p>Please enter the One-Time Password (OTP) sent to your mobile number. This code
                                        is valid for<b> 10 minutes </b>and is required to verify your identity. If you didn't
                                        receive the OTP or the code has expired, you can request a new one by clicking
                                        the <b>Resend OTP</b> button.</p>
                                </div>
                            </div>
                        </>
                        : <>
                            <div className="section-div  input-section">
                                <form onSubmit={handleSubmit}>
                                    <MobileInput onChangeFun={handleMobileNumber} name='primary_number'
                                        value={`${mobileNumber?.country_code}${mobileNumber?.number}`}
                                        label='Primary number' onlyCountries={['in']} />

                                    <SingleButton type={'submit'} name={'Submit & Send OTP'} classNames={'lg btn-tertiary txt-center'}
                                        style={{ width: '100%' }} loading={loading} />

                                </form>
                                <div className="description">
                                    <p>Please ensure that you enter the mobile number associated with your account. Once you submit your number,
                                        we will send a One-Time Password (OTP) via SMS for verification.</p>
                                </div>
                            </div>
                        </>}
                </div>

            </div>
        </div>
    )
}

export default ForgotPassword