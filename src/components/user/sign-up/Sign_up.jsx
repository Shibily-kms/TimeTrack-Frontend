import React, { useEffect, useState } from 'react'
import './sign-up.scss'
import { RxEyeClosed, RxEyeOpen } from 'react-icons/rx';
import { userAxios } from '../../../config/axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'

function Sign_up() {
    const navigate = useNavigate();
    const [show, setShow] = useState(false)
    const [designation, setDesignation] = useState([])
    const [form, setForm] = useState({
        user_name: null, email_id: null, contact: null, designation: null, dob: null,
        password: null, re_password: null
    })
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    }
    const onSubmit = (e) => {
        e.preventDefault();
        if (form.password === form.re_password) {
            userAxios.post('/sign-up', form).then((response) => {
                navigate('/login')
            }).catch((error) => {
                toast.error(error.response.data.message)
            })
        } else {
            toast.error('password not match')
        }
    }

    useEffect(() => {
        userAxios.get('/designations').then((response) => {
            setDesignation(response.data.designations)
        })
    }, [])
    return (
        <div>
            <div className="signup-comp">
                <div className="boader">
                    <div className="box">
                        <div className="header">
                            <h4>Sign Up</h4>
                        </div>
                        <div className="inputs">
                            <form onSubmit={onSubmit}>
                                <div className="input-div">
                                    <label htmlFor="user-name">User name</label>
                                    <input type="text" name='user_name' id='user-name' required onChange={handleChange} />
                                </div>
                                <div className="input-div">
                                    <label htmlFor="email">Email Id</label>
                                    <input type="email" name='email_id' id='email' required onChange={handleChange} />
                                </div>
                                <div className="input-div">
                                    <label htmlFor="contact">Contact</label>
                                    <input type="number" name='contact' id='contact' required onChange={handleChange} />
                                </div>
                                <div className="input-div">
                                    <label htmlFor="designation">Designation</label>
                                    <select name='designation' id='designation' onChange={handleChange} >
                                    <option>Select...</option>
                                        {designation.map((value, index) => {
                                            return <option key={index} value={value._id}>{value.designation}</option>
                                        })}

                                    </select>
                                </div>
                                <div className="input-div">
                                    <label htmlFor="dob">DOB</label>
                                    <input type="date" name='dob' id='dob' required onChange={handleChange} />
                                </div>
                                <div className="input-div">
                                    <label htmlFor="password">Password</label>
                                    <input type={show ? 'text' : 'password'} name='password' id='password' required onChange={handleChange} />
                                    <div className="icon" onClick={() => setShow(!show)}>
                                        {show ? <RxEyeOpen /> : <RxEyeClosed />}
                                    </div>
                                </div>
                                <div className="input-div">
                                    <label htmlFor="re_password">Re Enter Password</label>
                                    <input type={show ? 'text' : 'password'} name='re_password' id='re_password' required onChange={handleChange} />
                                    <div className="icon" onClick={() => setShow(!show)}>
                                        {show ? <RxEyeOpen /> : <RxEyeClosed />}
                                    </div>
                                </div>
                                <div className="button-div">
                                    <button type='submit'>Sign Up</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Sign_up