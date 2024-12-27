import React, { useEffect } from 'react'
import Cookies from 'js-cookie';
import { ttSv2Axios } from '../../../config/axios';
import { useSelector } from 'react-redux';

const RotateToken = () => {
    const { user } = useSelector((state) => state.userAuth)
    const DVC_ID = Cookies.get('DVC_ID')
    const rfs_tkn = Cookies.get('_rfs_tkn')

    useEffect(() => {
        const cookieOptions = {
            secure: true,
            sameSite: 'None',
            domain: '.alliancewatersolutions.com',
            path: '/',
            expires: 40
        };

        // set initial cookies
        Cookies.set('DVC_ID', DVC_ID, { ...cookieOptions, expires: new Date(new Date().setMonth(new Date().getMonth() + 6)) })
        Cookies.set('_rfs_tkn', rfs_tkn, { ...cookieOptions, expires: new Date(new Date().setMonth(new Date().getMonth() + 6)) })
    }, [])

    useEffect(() => {
        const cookieOptions = {
            secure: true,
            sameSite: 'None',
            domain: '.alliancewatersolutions.com',
            path: '/',
            expires: new Date(Date.now() + 60 * 60 * 1000)
        };

        const interval = setInterval(() => {

            ttSv2Axios.post('/auth/rotate-token', { refresh_token: user?.refresh_token }).then((response) => {


                Cookies.set('_acc_tkn', response?.data?.access_token, cookieOptions);

            })
        }, 1000 * 60 * 30); // 1 second interval

        return () => clearInterval(interval); // Cleanup interval on unmount
    }, [])

    return (
        <div className='rotate_token'></div>
    )
}

export default RotateToken