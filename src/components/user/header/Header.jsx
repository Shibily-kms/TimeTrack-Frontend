import React from 'react'
import '../../admin/header/header.scss'
import { RiLogoutCircleLine } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { logOut } from '../../../redux/features/user/authSlice'
import { useNavigate } from 'react-router-dom';
import { clearWorkData } from '../../../redux/features/user/workdataSlice';
import { clearRegularWork } from '../../../redux/features/user/dayWorksSlice';

function Header() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { user } = useSelector((state) => state.userAuth)

    const handleLogOut = () => {
        dispatch(clearWorkData())
        dispatch(clearRegularWork())
        dispatch(logOut())
        navigate('/login')
    }

    return (
        <div className='header'>
            <div className="boader">
                <div className="left">
                    <h3 style={{ cursor: 'pointer' }} onClick={() => navigate('/')} >Staff Works</h3>
                </div>
                <div className="right">
                    {user ? <button onClick={handleLogOut}><RiLogoutCircleLine /> LogOut</button>
                        : <button onClick={() => navigate('/login')}><RiLogoutCircleLine /> Log In</button>}
                </div>
            </div>
        </div>
    )
}

export default Header