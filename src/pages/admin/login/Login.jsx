import React, { useEffect } from 'react'
import LoginComp from '../../../components/common/login/Login'
import { reset } from '../../../redux/features/admin/authSlice'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from '../../../redux/features/user/systemSlice'
import { useNavigate } from 'react-router-dom'

function Login() {
  const { admin, isError, message } = useSelector((state) => state.adminAuth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (isError) {
      dispatch(toast.push.error({ message }))
      dispatch(reset())
    }
    if (admin?.token && localStorage.getItem('_aws_temp_tkn_adn')) {
      navigate('/admin')
    }
  })
  return (
    <div>
      <LoginComp admin={true} />
    </div>
  )
}

export default Login