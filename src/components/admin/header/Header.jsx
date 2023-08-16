import React from 'react'
import './header.scss'
import { RiLogoutCircleLine } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { logOut } from '../../../redux/features/admin/authSlice'
import { useNavigate } from 'react-router-dom';

function Header() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { admin } = useSelector((state) => state.adminAuth)

    const handleLogOut = () => {
        dispatch(logOut())
        navigate('/admin/login')
    }

    return (
        <div className='header'>
            <div className="boader">
                <div className="left">
                    <h3 style={{ cursor: 'pointer' }} onClick={() => navigate('/admin')}>Admin panel</h3>
                </div>
                <div className="right">
                    {admin ? <button onClick={handleLogOut}><RiLogoutCircleLine /> LogOut</button>
                        : <button onClick={() => navigate('/admin/login')}><RiLogoutCircleLine /> Log In</button>}
                </div>
            </div>
        </div>
    )
}

export default Header