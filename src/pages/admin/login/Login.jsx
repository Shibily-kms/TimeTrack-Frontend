import React, { useEffect } from 'react'
import LoginComp from '../../../components/login/Login'
import { reset } from '../../../redux/features/admin/authSlice'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

function Login() {
  const { isError, message } = useSelector((state) => state.adminAuth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  let loacl = JSON.parse(localStorage.getItem('adminData'))

  useEffect(() => {
    if (isError) {
      toast.error(message)
      dispatch(reset())
    }
    if(loacl?.token){
      navigate('/admin')
    }
  })
  return (
    <div>
      <LoginComp url={'/admin/login'} admin={true} />
    </div>
  )
}

export default Login