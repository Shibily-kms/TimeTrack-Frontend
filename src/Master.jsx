import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import Admin from './routes/Admin'
import User from './routes/User'
import QrCodeView from './pages/admin/qr-code-view/QrCodeView'
import Scanner from './pages/user/scanner/Scanner'
import Cookies from 'js-cookie';
import { ttSv2Axios } from './config/axios'
import { setUser } from './redux/features/user/authSlice'
import { useDispatch, useSelector } from 'react-redux'
import { doSignOut } from './assets/javascript/auth-helper'
import RotateToken from './components/common/rotateToken/RotateToken'

const Master = () => {
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.userAuth)
    const acc_tkn = Cookies.get('_acc_tkn');
    const logged_in = Cookies.get('logged_in');
    const DVC_ID = Cookies.get('DVC_ID');

    useEffect(() => {

        // Check Authentication
        if (DVC_ID && acc_tkn) {
            ttSv2Axios.get('/worker/initial-info').then((response) => {
                dispatch(setUser({ ...(user || {}), ...response.data }))
            })
            if (!logged_in || logged_in === 'no') {
                Cookies.set('logged_in', 'yes', {
                    secure: false, // Set to `true` in production (for HTTPS)
                    // domain: '.domain.com', // Allows cookie sharing across subdomains
                    sameSite: 'lax', // Helps prevent CSRF attacks , use 'strict' on host,
                    path: '/',
                    expires: 40
                });
            }
        }


        // eslint-disable-next-line
    }, [])


    return (
        <>
            <RotateToken />
            <Routes>
                {/* Without Header and Footer */}
                <Route path='/qr-code' element={<QrCodeView />} />
                <Route path='/scanner' element={<Scanner />} />


                {/* Main Root */}
                <Route element={<Admin />} path='/admin/*' />
                <Route element={<User />} path='/*' />
            </Routes>
        </>
    )
}

export default Master