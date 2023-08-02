import React, { useState } from 'react'
import './change-password.scss'
import { userAxios } from '../../../../config/axios'
import { toast } from 'react-hot-toast'
import { BiLoaderAlt } from 'react-icons/bi'
import { RxEyeClosed, RxEyeOpen } from 'react-icons/rx';


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
        if (form?.newPass.length < 6) {
            toast.error('Password must have 6 letters')
            return;
        }
        if (form.newPass !== form.confirm) {
            toast.error('Password not match !')
            return;
        }

        setLoading(true)
        userAxios.post('/change-password', form).then((response) => {
            toast.success(response.data.message)
            setLoading(false)
            setModal(null)
        }).catch((error) => {
            toast.error(error.response.data.message)
            setLoading(false)
        })

    }
    return (
        <div className="change-password-div">
            <div className="inputs">
                <form onSubmit={handleSubmit}>
                    <div className="input-div">
                        <label htmlFor="current">Current Password</label>
                        <input type={show ? 'text' : 'password'} name='current' id='current' required onChange={handleChange} />
                        <div className="icon" onClick={() => setShow(!show)}>
                            {show ? <RxEyeOpen /> : <RxEyeClosed />}
                        </div>
                    </div>
                    <div className="input-div">
                        <label htmlFor="newPass">New Password</label>
                        <input type={show ? 'text' : 'password'} name='newPass' id='newPass' required onChange={handleChange} />
                        <div className="icon" onClick={() => setShow(!show)}>
                            {show ? <RxEyeOpen /> : <RxEyeClosed />}
                        </div>
                    </div>
                    <div className="input-div">
                        <label htmlFor="confirm">Confirm Password</label>
                        <input type={show ? 'text' : 'password'} name='confirm' id='confirm' required onChange={handleChange} />
                        <div className="icon" onClick={() => setShow(!show)}>
                            {show ? <RxEyeOpen /> : <RxEyeClosed />}
                        </div>
                    </div>
                    <div className="button-div">
                        <button>  {loading ? <span className='loading-icon'><BiLoaderAlt /></span> : 'Update'}</button>
                    </div>
                </form>
            </div >
        </div >
    )
}

export default ChangePassword