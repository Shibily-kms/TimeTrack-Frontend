import React from 'react'
import Header from '../../../components/user/header/Header'
import { useSelector } from 'react-redux'
import './not-found.scss'
import Gif404 from '../../../assets/images/404.gif'
import { useNavigate } from 'react-router-dom'

function NotFound() {
    const { user } = useSelector((state) => state.userAuth)
    const navigate = useNavigate()
    return (
        <div className='not-found'>
            <div className="header">
                <Header />
            </div>
            <div className="content-div">
                <div className="content">
                    <div className="image">
                        <img src={Gif404} alt="" />
                    </div>
                    <div className="text">
                        {user ?
                            <button onClick={() => navigate('/')}>Home Page</button>
                            :
                            <button onClick={() => navigate('/login')}>Login</button>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NotFound