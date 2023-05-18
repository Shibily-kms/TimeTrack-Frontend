import React from 'react'
import '../../admin/header/header.scss'
import { RiLogoutCircleLine } from 'react-icons/ri';
import { useDispatch } from 'react-redux';
import { logOut } from '../../../redux/features/user/authSlice'
import { useNavigate } from 'react-router-dom';
import { clearWorkData } from '../../../redux/features/user/workdataSlice';

function Header() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleLogOut = () => {
        dispatch(clearWorkData())
        dispatch(logOut())
        navigate('/login')
    }

    return (
        <div className='header'>
            <div className="boader">
                <div className="left">
                    <h3>Company</h3>
                </div>
                <div className="right">
                    <button onClick={handleLogOut}><RiLogoutCircleLine /> LogOut</button>
                </div>
            </div>
        </div>
    )
}

export default Header