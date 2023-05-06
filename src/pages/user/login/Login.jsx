import React, { useEffect } from 'react'
import LoginComp from '../../../components/login/Login'
import { reset } from '../../../redux/features/user/authSlice'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

function Login() {
    const { isError, message } = useSelector((state) => state.userAuth)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    let loacl = JSON.parse(localStorage.getItem('userData'))

    useEffect(() => {
        if (isError) {
            toast.error(message)
            dispatch(reset())
        }
        if (loacl?.token) {
            navigate('/')
        }
    }, [])
    
    return (
        <div>
            <LoginComp />
        </div>
    )
}

export default Login