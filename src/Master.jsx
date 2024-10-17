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
    const rfs_tkn = Cookies.get('_rfs_tkn');
    const ACC_ID = Cookies.get('ACC_ID');
    const DVC_ID = Cookies.get('DVC_ID');

    useEffect(() => {

        // Check Authentication
        if (ACC_ID && DVC_ID && acc_tkn && rfs_tkn) {
            ttSv2Axios.get('/worker/initial-info').then((response) => {
                dispatch(setUser({ ...(user || {}), ...response.data, refresh_token: Cookies.get('_rfs_tkn') }))
            })
        } else {
            doSignOut()
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