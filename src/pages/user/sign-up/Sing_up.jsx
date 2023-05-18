import React, { useEffect } from 'react'
import Sign_upComp from '../../../components/user/sign-up/Sign_up'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

function Sing_up() {
    const navigate = useNavigate()
    const { user } = useSelector((state) => state.userAuth)

    useEffect(() => {
        if (user?.token) {
            navigate('/')
        }
    }, [])
    return (
        <div>
            <Sign_upComp />
        </div>
    )
}

export default Sing_up