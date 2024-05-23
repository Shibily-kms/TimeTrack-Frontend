import React from 'react'
import Logo from '../../../assets/images/alliance-logo.png'
import './page-loading.scss'

const PageLoading = () => {
    return (
        <div className="page-loading-page-div">
            <div className="border">
                <img src={Logo} alt="" />
                <div className="loader-line"></div>
            </div>
        </div>
    )
}

export default PageLoading