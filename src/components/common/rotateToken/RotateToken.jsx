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
            expires: new Date(new Date().setMonth(new Date().getMonth() + 6))
        };


        // set initial cookies
        if ((DVC_ID && DVC_ID.length === 32) && (rfs_tkn && rfs_tkn?.length > 30)) {
            const expirationDate = new Date();
            expirationDate.setMonth(expirationDate.getMonth() + 6);

            Cookies.set('DVC_ID', DVC_ID, { ...cookieOptions, expires: expirationDate })
            Cookies.set('_rfs_tkn', rfs_tkn, { ...cookieOptions, expires: expirationDate })
        }
    }, [])

    useEffect(() => {
        const cookieOptions = {
            secure: true,
            sameSite: 'None',
            domain: '.alliancewatersolutions.com',
            path: '/',
            expires: new Date(new Date().setMonth(new Date().getMonth() + 6))
        };

        const interval = setInterval(() => {

            ttSv2Axios.post('/auth/rotate-token', { refresh_token: user?.refresh_token }).then((response) => {
                if (response?.data?.access_token && response?.data?.access_token?.length > 30) {
                    Cookies.set('_acc_tkn', response?.data?.access_token, cookieOptions);
                }
            })
        }, 1000 * 60 * 30); // 1 second interval

        return () => clearInterval(interval); // Cleanup interval on unmount
    }, [])

    return (
        <div className='rotate_token'></div>
    )
}

export default RotateToken