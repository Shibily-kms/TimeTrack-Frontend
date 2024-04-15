import React, { useState } from 'react'
import './login.scss'
import { RxEyeClosed, RxEyeOpen } from 'react-icons/rx';
import { loginAdmin } from '../../../redux/features/admin/authSlice';
import { loginUser } from '../../../redux/features/user/authSlice';
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import LoginImage from '../../../assets/images/login-image.png'
import NormalInput from '../inputs/NormalInput';
import SingleButton from '../buttons/SingleButton';

function Login({ admin }) {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const [show, setShow] = useState(false)
  const [form, setForm] = useState({ user_name: null, password: null })
  const { isLoading } = useSelector((state) => state.userAuth)

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const onSubmit = (e) => {
    e.preventDefault();
    if (admin) {
      dispatch(loginAdmin(form)).then((res) => {
        if (!res?.error) {
          navigate('/admin')
        }
      })
    } else {
      dispatch(loginUser(form)).then((res) => {
        if (!res?.error) {
          navigate('/')
        }
      })
    }
  }

  return (
    <div>
      <div className="login-comp">
        <div className="left-div">
          <img src={LoginImage} />
        </div>
        <div className="right-div">

          <div className="section-div top-section">
            <h1>{admin ? "Admin" : 'Staff'} Login</h1>
            {admin
              ? <p>Login account using user name and password</p>
              : <p>Login your account using mobile number and password</p>}

          </div>
          <div className="section-div  input-section">
            <form onSubmit={onSubmit}>
              <NormalInput label={admin ? 'User name' : 'Mobile number'} name='user_name' id='user-name'
                onChangeFun={handleChange} value={form?.user_name} type={admin ? 'text' : 'number'} />

              <NormalInput label={'Password'} name='password' id='password' rightIcon={show ? <RxEyeOpen /> : <RxEyeClosed />}
                onChangeFun={handleChange} value={form?.password} type={show ? 'text' : 'password'} rightIconAction={() => setShow(!show)} />

              <SingleButton type={'submit'} name={'Log In'} classNames={'lg btn-tertiary txt-center'}
                style={{ marginTop: '10px', width: '100%' }} loading={isLoading} />
            </form>
          </div>
        </div>

      </div>

    </div>
  )
}

export default Login