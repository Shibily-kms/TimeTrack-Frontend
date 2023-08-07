import React, { useState } from 'react'
import './login.scss'
import { RxEyeClosed, RxEyeOpen } from 'react-icons/rx';
import { loginAdmin } from '../../../redux/features/admin/authSlice';
import { loginUser } from '../../../redux/features/user/authSlice';
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function Login({ admin }) {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const [show, setShow] = useState(false)
  const [form, setForm] = useState({ user_name: null, password: null })

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const onSubmit = (e) => {
    e.preventDefault();
    if (admin) {
      dispatch(loginAdmin(form)).then(() => {
        navigate('/admin')
      })
    } else {
      dispatch(loginUser(form)).then(() => {
        navigate('/')
      })
    }
  }

  return (
    <div>
      <div className="login-comp">
        <div className="boader">
          <div className="box">
            <div className="header">
              <h4>{admin ? "Admin Login" : "Staff Login"}</h4>
            </div>
            <div className="inputs">
              <form onSubmit={onSubmit}>
                <div className="input-div">
                  <label htmlFor="user-name">User name {!admin && 'Or Mobile'}</label>
                  <input type="text" name='user_name' id='user-name' required onChange={handleChange} />
                </div>
                <div className="input-div">
                  <label htmlFor="password">Password</label>
                  <input type={show ? 'text' : 'password'} name='password' id='password' autocomplete="current-password" required onChange={handleChange} />
                  <div className="icon" onClick={() => setShow(!show)}>
                    {show ? <RxEyeOpen /> : <RxEyeClosed />}
                  </div>
                </div>
                <div className="button-div">
                  <button type='submit'>LogIn</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login