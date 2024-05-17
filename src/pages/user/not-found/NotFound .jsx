import React, { useEffect } from 'react'
import Header from '../../../components/user/header/Header'
import { useSelector } from 'react-redux'
import './not-found.scss'
import Gif404 from '../../../assets/images/404.gif'
import { useNavigate } from 'react-router-dom'
import SingleButton from '../../../components/common/buttons/SingleButton'

function NotFound({ setPageHead }) {
    const { user } = useSelector((state) => state.userAuth)
    const navigate = useNavigate()

    useEffect(() => {
        setPageHead({ title: "" })
    })

    return (
        <div className='not-found'>

            <main class="main">
                <div class="image">
                    <img id="big_image" src="https://mjavadh.github.io/4X4-Collection/Fantasy/Black%20Box/assets/astronaut.png" alt="#" />
                </div>

                <div class="text-404">
                    <h1>4 0 4</h1>
                    <p>Page not found!</p>
                    <SingleButton name={'Go to Home'} classNames={'btn-secondary'} onClick={() => navigate(user ? '/' : '/admin')} />
                </div>
            </main>



        </div>
    )
}

export default NotFound