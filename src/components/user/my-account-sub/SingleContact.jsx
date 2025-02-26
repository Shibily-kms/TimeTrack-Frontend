import React, { useEffect, useState } from 'react'
import './single-contact.scss'
import NormalInput from '../../common/inputs/NormalInput'
import MobileInput from '../../common/inputs/MobileInput'
import SingleButton from '../../common/buttons/SingleButton'
import { ttSv2Axios } from '../../../config/axios'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from '../../../redux/features/user/systemSlice'

const SingleContact = ({ type, label, contact, setModal, setUserData }) => {
    const OtpLength = 6;
    const { user } = useSelector((state) => state.userAuth)
    const [form, setForm] = useState({ type, contact })
    const [otpAction, setOtpAction] = useState(false)
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const [otp, setOtp] = useState(new Array(OtpLength).fill(""));
    const [counter, setCounter] = useState(90); // 90 seconds = 1 minutes and 30 seconds
    const [isResendVisible, setIsResendVisible] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...(form || {}),
            contact: {
                ...(form.contact || {}),
                [e.target.name]: e.target.value
            }
        })
    }

    const handleMobileNumber = (mobData) => {
        setForm({
            ...form,
            contact: mobData?.number
                ? {
                    country_code: mobData?.country_code || null,
                    number: mobData?.number || null
                }
                : undefined
        })
    }

    const updateContact = (verified) => {

        setLoading(true)
        ttSv2Axios.put(`/worker/account/${user?.acc_id}/contact`, {
            type: label,
            contact: { ...(form?.contact || {}), verified: verified || null }
        }).then(() => {
            setUserData((state) => ({
                ...state,
                [label]: { ...(form?.contact || {}), verified: verified || null }
            }))
            setLoading('')
            setModal({ status: false })
        }).catch((error) => {
            setLoading('')
            dispatch(toast.push.error({ message: error.message }))
        })
    }

    const sendOtp = () => {
        ttSv2Axios.post('/auth/otp-v/send', {
            acc_id: user?.acc_id,
            country_code: form?.contact?.country_code,
            mobile_number: form?.contact?.number,
            way_type: type === 'whatsapp' ? 'whatsapp' : 'sms',
            by_acc: true
        }).then(() => {
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

    const verifyOtp = (newOtp) => {
        const enteredOtp = (newOtp || otp).join('');
     
        setLoading(true)
        ttSv2Axios.post('/auth/otp-v/verify', {
            acc_id: user?.acc_id,
            way_type: type === 'whatsapp' ? 'whatsapp' : 'sms',
            otp: enteredOtp,
            by_acc: true
        }).then(() => {
            updateContact(new Date())
            setOtpAction(false)
        }).catch((error) => {
            dispatch(toast.push.error({ message: error.message }))
            setLoading(false)
        })
    }

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").trim();

        if (/^\d+$/.test(pastedData)) { // Check if the pasted value is only numbers
            const newOtp = pastedData.split("").slice(0, OtpLength);
            setOtp([...newOtp, ...new Array(OtpLength - newOtp.length).fill("")]);

            // Focus the last filled input
            const inputs = document.querySelectorAll(".otp-input");
            setTimeout(() => {
                inputs[Math.min(newOtp.length, OtpLength - 1)]?.focus();
            }, 0);
        }
    };

    const handleOtpChange = (element, index) => {

        const value = element.value;

        if (/[^0-9]/.test(value)) return; // Only allow numeric input
        if (element.value.length > 1) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Focus on next input if available
        if (value && element.nextSibling) {
            element.nextSibling.focus();
        }

        // Check if all inputs are filled, then submit
        if (newOtp.every((digit) => digit !== "")) {
            verifyOtp(newOtp)
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

    const handleSubmit = (e) => {
        e.preventDefault();

        if (type !== 'email' && (!form?.contact?.number || form?.contact?.number?.length < 7)) {
            dispatch(toast.push.error({ message: 'Enter valid country mobile number formate' }))
            return;
        }

        if (type === 'email' && !form?.contact?.mail) {
            dispatch(toast.push.error({ message: 'Enter valid email address' }))
            return;
        }

        if (type === 'mobile' || type === 'whatsapp') {
            setOtpAction(true)
            sendOtp()
        } else {
            updateContact()
        }
    }

    const handleDeleteNumber = (numberType) => {
        const ask = window.confirm('Are you remove this number ?')

        if (ask) {
            setLoading(true)
            ttSv2Axios.delete(`/worker/account/${user?.acc_id}/contact?type=${numberType}`).then(() => {
                setUserData((state) => ({
                    ...state,
                    [label]: {}
                }))
                setLoading('')
                setModal({ status: false })
            }).catch((error) => {
                setLoading('')
                dispatch(toast.push.error({ message: error.message }))
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


    return (
        <div className="single-contact-sub-div">
            {otpAction
                ? <div className="otp-section">
                    <p className='smallTD2' style={{ marginBottom: "15px" }}>Enter received OTP </p>
                    <form onSubmit={handleOtpSubmit}>
                        <div className="otp-input-group">
                            {otp.map((data, index) => (
                                <input
                                    autoFocus={index === 0}
                                    className="otp-field"
                                    type="number"
                                    name="otp"
                                    maxLength="1"
                                    key={index}
                                    value={otp[index]}
                                    onChange={(e) => handleOtpChange(e.target, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    onFocus={(e) => e.target.select()}
                                    onPaste={handlePaste}
                                />
                            ))}
                        </div>

                        <SingleButton type={'submit'} name={'Verify & Update'} classNames={'lg btn-tertiary txt-center'}
                            style={{ width: '100%' }} loading={loading} />

                        {isResendVisible
                            ? <p className='re-send' style={{ marginBottom: "15px", cursor: 'pointer' }} onClick={() => resendOtp()}>Resend OTP</p>
                            : <p style={{ marginBottom: "15px" }}>Resend OTP in {Math.floor(counter / 60)}:{String(counter % 60).padStart(2, '0')}</p>}
                    </form>
                    <div className="smallTD2">
                        <p>Please enter the One-Time Password (OTP) sent to your mobile number. This code
                            is valid for<b> 10 minutes </b>and is required to verify your mobile number. If you didn't
                            receive the OTP or the code has expired, you can request a new one by clicking
                            the <b>Resend OTP</b> button.</p>
                    </div>
                </div>
                : <div className="contact-form-section">
                    <div style={{ display: 'flex', alignContent: "center", justifyContent: 'space-between' }}>
                        <p className='smallTD2'>Enter your {label}</p>
                        {['secondary_number', 'official_number'].includes(label) && contact?.number &&
                            <SingleButton name={'Remove'} classNames={'sm btn-tertiary'} onClick={() => handleDeleteNumber(label)}
                                loading={loading} />}
                    </div>
                    <form action="" onSubmit={handleSubmit}>
                        {type === 'email' && <NormalInput label='Email' name='mail' value={form?.contact?.mail} onChangeFun={handleChange} />}
                        {type === 'mobile' && <MobileInput onChangeFun={handleMobileNumber} name='contact'
                            value={`${form?.contact?.country_code}${form?.contact?.number}`}
                            label={label} onlyCountries={['in']} />}
                        {type === 'whatsapp' && <MobileInput onChangeFun={handleMobileNumber} name='contact'
                            value={`${form?.contact?.country_code}${form?.contact?.number}`}
                            label={label} onlyCountries={['in']} />}
                        <SingleButton name={'Submit'} type={'submit'} classNames={'lg btn-tertiary'} style={{ width: '100%' }} />
                    </form>

                    {type === 'mobile' && <p className='smallTD2' style={{ marginTop: '15px' }}>
                        Once you submit your number, we will send a One-Time Password (OTP) via SMS for verification.
                    </p>}

                    {type === 'whatsapp' && <p className='smallTD2' style={{ marginTop: '15px' }}>
                        Once you submit your number, we will send a One-Time Password (OTP) via Whatsapp message for verification.
                    </p>}

                    {(type !== 'mobile' && type !== 'whatsapp') && <p className='smallTD2' style={{ marginTop: '15px' }}>
                        Verification option not enabled.
                    </p>}
                </div>}

        </div>
    )
}

export default SingleContact