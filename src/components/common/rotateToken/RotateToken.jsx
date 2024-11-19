import React, { useEffect } from 'react'
import Cookies from 'js-cookie';
import { ttSv2Axios } from '../../../config/axios';

const RotateToken = () => {

    useEffect(() => {
        const interval = setInterval(() => {

            const refreshToken = Cookies.get('_rfs_tkn'); // Retrieve the refresh token

            ttSv2Axios.post('/auth/rotate-token', { refresh_token: refreshToken }).then((response) => {

                const cookieOptions = {
                    secure: true, // Set to `true` in production (for HTTPS)
                    domain: '.alliancedev.in', // Allows cookie sharing across subdomains
                    sameSite: 'None', // Helps prevent CSRF attacks , use 'strict' on host,
                    path: '/',
                    expires: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000)
                };

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