import React from 'react'
import './header.scss'
import { RiLogoutCircleLine } from 'react-icons/ri';
import { useDispatch } from 'react-redux';
import { logOut } from '../../../redux/features/admin/authSlice'
import { useNavigate } from 'react-router-dom';

function Header() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleLogOut = () => {
        dispatch(logOut())
        navigate('/admin/login')
    }

    return (
        <div className='header'>
            <div className="boader">
                <div className="left">
                    <h3>Admin panel</h3>
                </div>
                <div className="right">
                    <button onClick={handleLogOut}><RiLogoutCircleLine /> LogOut</button>
                </div>
            </div>
        </div>
    )
}

export default Header