import React, { useEffect, useRef } from 'react'
import './single-page.scss'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import AllianceLogo from '../../../assets/images/alliance-logo.png'
import { IoPersonCircleOutline, IoChevronBack } from "react-icons/io5";
import { TbCheckbox, TbReport } from "react-icons/tb";
import { RiMoreFill, RiHome6Line } from "react-icons/ri";
import { HiStatusOffline, HiStatusOnline } from "react-icons/hi";
import { toast } from '../../../redux/features/user/systemSlice'


function SinglePage({ pageHead, children }) {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { internet } = useSelector((state) => state.systemInfo)
    const lastScrollTop = useRef(0);
    const navbarRef = useRef(null);
    // eslint-disable-next-line
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
                        <div className="round-icon-button" title='Profile' onClick={() => navigate('/my-account/profile?page=more')}>
                            <IoPersonCircleOutline />
                        </div>
                        <div className="round-icon-button" style={{ cursor: "auto", color: !internet && 'red' }}
                            title={internet ? 'Online' : 'Offline'} onClick={() => dispatch(toast.push.info({
                                message: internet ? 'You are in Online' : 'You are in Offline',
                                icon: internet ? 'HiStatusOnline' : 'HiStatusOffline'
                            }))}>
                            {internet ? <HiStatusOnline /> : <HiStatusOffline />}
                        </div>
                    </div>
                </div>
            </div>

            <div className="single-page-body-div">
                <div className="page-container">
                    <div className="page-title-div">
                        <h3>{pageHead?.title}</h3>
                        <p>{pageHead?.desc}</p>
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
                    <div className={searchParams.get('page') === 'my-todo' ? "item-div active-item" : "item-div"} onClick={() => navigate('/my-todo/?page=my-todo')}>
                        <TbCheckbox />
                        <p>My ToDo</p>
                    </div>
                    <div className={searchParams.get('page') === 'report' ? "item-div active-item" : "item-div"} onClick={() => navigate('/monthly-report/?page=report')}>
                        <TbReport />
                        <p>Report</p>
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