import React, { useEffect } from 'react'
import LoginComp from '../../../components/login/Login'
import { reset } from '../../../redux/features/user/authSlice'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { useNavigate, useSearchParams } from 'react-router-dom'

function Login() {
    const { user, isError, message } = useSelector((state) => state.userAuth)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams();

    useEffect(() => {
        if (isError) {
            toast.error(message)
            dispatch(reset())
        }
        if (user?.token) {
            if (searchParams.get('to')) {
                window.location.href = searchParams.get('to')
            } else {
                navigate('/')
            }
        }
    })

    return (
        <div>
            <LoginComp />
        </div>
    )
}

export default Login