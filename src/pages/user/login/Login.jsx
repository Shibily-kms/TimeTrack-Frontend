import React, { useEffect } from 'react'
import LoginComp from '../../../components/common/login/Login'
import { reset } from '../../../redux/features/user/authSlice'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from '../../../redux/features/user/systemSlice'

function Login() {
    const { user, isError, message } = useSelector((state) => state.userAuth)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        if (isError) {
            dispatch(toast.push.error({ message }))
            dispatch(reset())
        }

        if (user?.token && localStorage.getItem('_aws_temp_tkn')) {
            navigate('/?page=home')
        }
    }, [isError, message])

    return (
        <div>
            <LoginComp />
        </div>
    )
}

export default Login