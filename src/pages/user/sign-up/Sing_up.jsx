import React, { useEffect } from 'react'
import Sign_upComp from '../../../components/user/sign-up/Sign_up'
import { useNavigate } from 'react-router-dom'

function Sing_up() {
    const navigate = useNavigate()

    let loacl = JSON.parse(localStorage.getItem('userData'))

    useEffect(() => {
        if (loacl?.token) {
            navigate('/')
        }
    },[])  
    return (
        <div>
            <Sign_upComp />
        </div>
    )
}

export default Sing_up