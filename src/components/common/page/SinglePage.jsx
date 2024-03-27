import React, { useEffect, useRef } from 'react'
import './single-page.scss'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import AllianceLogo from '../../../assets/images/alliance-logo.png'
import { IoPersonCircleOutline, IoChevronBack } from "react-icons/io5";
import { MdOutlineHistoryToggleOff } from "react-icons/md";
import { RiSettingsLine, RiMoreFill, RiHome6Line } from "react-icons/ri";
import { HiStatusOffline, HiStatusOnline } from "react-icons/hi";



function SinglePage({ title, description, children }) {
    const navigate = useNavigate()
    const { internet } = useSelector((state) => state.network)
    const lastScrollTop = useRef(0);
    const navbarRef = useRef(null);
    const [searchParams, setSearchParams] = useSearchParams()



    useEffect(() => {
        const onScroll = () => {
            let currentScrollPos = window.pageYOffset || document.documentElement.scrollTop;

            if (currentScrollPos > lastScrollTop.current) {
                // Scroll Down, hide the navbar
                navbarRef.current.style.top = "-80px";
            } else {
                // Scroll Up, show the navbar
                navbarRef.current.style.top = "0";
            }

            lastScrollTop.current = currentScrollPos;
        };

        window.addEventListener("scroll", onScroll);

        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (

        <div className="single-page-body">
            <div className="single-page-header-div" ref={navbarRef}>
                <div className="border">
                    <div className="left" onClick={() => (!searchParams.get('page') || searchParams.get('page') !== 'home') && navigate(-1)}>
                        {(!searchParams.get('page') || searchParams.get('page') !== 'home') && <IoChevronBack />}
                        <img src={AllianceLogo} alt='logo' />
                        <h3>Alliance</h3>
                    </div>
                    <div className="right">
                        <div className="round-icon-button" title='Profile'>
                            <IoPersonCircleOutline />
                        </div>
                        <div className="round-icon-button" style={{ cursor: "auto", color: !internet && 'red' }}
                            title={internet ? 'Online' : 'Offline'}>
                            {internet ? <HiStatusOnline /> : <HiStatusOffline />}
                        </div>
                    </div>
                </div>
            </div>

            <div className="single-page-body-div">
                <div className="page-container">
                    <div className="page-title-div">
                        <h3>{title}</h3>
                        <p>{description}</p>
                    </div>
                    <div className="page-content-div">
                        {children}
                    </div>
                </div>
            </div>

            <div className="single-page-menu-div">
                <div className="menu-div">
                    <div className={searchParams.get('page') === 'home' ? "item-div active-item" : "item-div"} onClick={() => navigate('/?page=home')}>
                        <RiHome6Line />
                        <p>Home</p>
                    </div>
                    <div className={searchParams.get('page') === 'history' ? "item-div active-item" : "item-div"} onClick={() => navigate('/')}>
                        <MdOutlineHistoryToggleOff />
                        <p>History</p>
                    </div>
                    <div className={searchParams.get('page') === 'settings' ? "item-div active-item" : "item-div"} onClick={() => navigate('/')}>
                        <RiSettingsLine />
                        <p>Settings</p>
                    </div>
                    <div className={searchParams.get('page') === 'more' ? "item-div active-item" : "item-div"} onClick={() => navigate('/more/?page=more')}>
                        <RiMoreFill />
                        <p>More</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SinglePage