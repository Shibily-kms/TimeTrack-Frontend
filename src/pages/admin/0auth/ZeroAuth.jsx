import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import './zero-auth.scss'
import Logo from '../../../assets/images/alliance-logo.png'
import ProfileCard from '../../../components/admin/dashboard/ProfileCard'
import SingleButton from '../../../components/common/buttons/SingleButton'
import SpinWithMessage from '../../../components/common/spinners/SpinWithMessage'
import { MdVerifiedUser } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux'
import { adminAxios } from '../../../config/axios'
import { toast } from '../../../redux/features/user/systemSlice'
import { originAdminLogIn } from '../../../redux/features/admin/authSlice'

const ZeroAuth = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { admin } = useSelector((state) => state.adminAuth)

    useEffect(() => {
        if (searchParams.get('location') === 'Staff_Admin') {
            if (searchParams?.get('temp_id') === admin?.temp_id) {
                navigate('/admin')
            } else if(!admin?.admin_key) {
                staffAdminLogin()
            }
        } else {
            navigate('/')
        }
    }, [searchParams])

    const staffAdminLogin = () => {
        setLoading(true)
        adminAxios.post(`/auth/origin-login?staff_id=${searchParams.get('temp_id')}`).then((response) => {
            dispatch(originAdminLogIn(response.data))
            navigate('/admin')
            setLoading(false)
        }).catch((error) => {
            dispatch(toast.push.error({ message: error.message }))
            navigate('/')
            setLoading(false)
        })
    }


    return (
        <div className="zero-auth-page-div">
            <div className="border-div">
                <div className="header-div">
                    <div className="image-div">
                        <img src={Logo} />
                    </div>
                    <div className="text-div">
                        <h2>{searchParams.get('location')} 0Auth</h2>
                        <p>Streamlined secure user access<br></br>with efficient 0Auth protocol.</p>
                    </div>
                </div>
                <div className="content-div">
                    {admin?.admin_key && searchParams?.get('temp_id') !== admin?.temp_id && <div className="account-list-div">
                        <ProfileCard full_name={admin?.user_name} description={admin?.designation || 'Pro Admin'} />
                        <div className="button-div">
                            <SingleButton name={'Use Current'} classNames={'btn-primary'} style={{ width: '100%' }} onClick={() => navigate('/admin')} />
                            <SingleButton name={'Continue'} classNames={'btn-blue'} style={{ width: '100%' }} onClick={staffAdminLogin} />
                        </div>
                    </div>}
                    {loading && <SpinWithMessage load height={'150px'} />}
                </div>
                <div className="footer-div">
                    <MdVerifiedUser />
                    <p>Access Guaranteed</p>
                </div>
            </div>
        </div>
    )
}

export default ZeroAuth