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
import RotateToken from './components/common/rotateToken/RotateToken'

const Master = () => {
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.userAuth)
    const logged_in = Cookies.get('logged_in');
    const DVC_ID = Cookies.get('DVC_ID');
    const acc_tkn = Cookies.get('_acc_tkn');

    const cookieOptions = {
        secure: true, // Ensure secure transmission (Use HTTPS)
        sameSite: 'none', // Allows cross-site cookies (important for subdomains)
        path: '/', // Makes the cookie accessible to all routes
        domain: '.alliancewatersolutions.com', // Allows sharing between subdomains
        httpOnly: true, // Prevents JavaScript access for security (optional)
        expires: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000) // Set expiration correctly
    };


    useEffect(() => {

        // Check Authentication
        if ((DVC_ID && DVC_ID.length === 32) && acc_tkn) {
            ttSv2Axios.get('/worker/initial-info').then((response) => {
                dispatch(setUser({ ...(user || {}), ...response.data }))
            }).catch(() => {
                Cookies.set('logged_in', 'no', cookieOptions);
            })

            if (!logged_in || logged_in === 'no') {
                Cookies.set('logged_in', 'yes', cookieOptions);
            }
        }

        // eslint-disable-next-line
    }, [DVC_ID, acc_tkn])


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