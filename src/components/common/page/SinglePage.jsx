import React, { useEffect, useRef, useState } from 'react'
import './single-page.scss'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import AllianceLogo from '../../../assets/images/alliance-logo.png'
import { IoPersonCircleOutline, IoChevronBack } from "react-icons/io5";
import { TbCheckbox, TbReport } from "react-icons/tb";
import { RiMoreFill, RiHome6Line } from "react-icons/ri";
import { HiStatusOffline, HiStatusOnline } from "react-icons/hi";
import { toast } from '../../../redux/features/user/systemSlice'
import { ttSv2Axios } from '../../../config/axios'
import SingleContact from '../../user/my-account-sub/SingleContact'
import Modal from '../modal/Modal'


function SinglePage({ pageHead, children }) {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.userAuth)
    const { internet } = useSelector((state) => state.systemInfo)
    const [userData, setUserData] = useState({})
    const lastScrollTop = useRef(0);
    const navbarRef = useRef(null);
    const [searchParams, setSearchParams] = useSearchParams()
    const [verifyContacts, setVerifyContact] = useState({})
    const [modal, setModal] = useState({ status: false })
    // eslint-disable-next-line


    const handlePopupModalClose = (obj) => {
        if (!verifyContacts?.primary_number?.verified || !verifyContacts?.whatsapp_number?.verified) {
            dispatch(toast.push.error({ message: 'You need to be verified first to proceed.' }))
            return
        }
       
        setModal(obj)
    }

    const primaryNumberVerify = (primary_number) => {
        setModal({
            status: true, title: 'Verify Primary number', content: <SingleContact label={'primary_number'} type={'mobile'}
                contact={primary_number} setModal={setModal} setUserData={setUserData} />
        })
    }

    const whatsappNumberVerify = (whatsapp_number) => {
        setModal({
            status: true, title: 'Verify Whatsapp number', content: <SingleContact label={'whatsapp_number'} type={'whatsapp'}
                contact={whatsapp_number} setModal={setModal} setUserData={setUserData} />
        })
    }


    useEffect(() => {

        // handle Scroll
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

        // Handle Contacts
        let contacts = {}
        ttSv2Axios.get(`/worker/account/${user?.acc_id}?initial=Yes`).then((response) => {
            setUserData(response?.data)
            contacts.primary_number = response?.data?.primary_number
            contacts.whatsapp_number = response?.data?.whatsapp_number
            setVerifyContact(contacts)
        })

       
        return () => {
            window.removeEventListener("scroll", onScroll);
        }
    }, []);

    useEffect(() => {
        if (verifyContacts?.primary_number && !verifyContacts?.primary_number?.verified) {
            primaryNumberVerify(verifyContacts?.primary_number)
        } else if (verifyContacts?.whatsapp_number && !verifyContacts?.whatsapp_number?.verified) {
            whatsappNumberVerify(verifyContacts?.whatsapp_number)
        }
    }, [verifyContacts])



    return (

        <div className="single-page-body">
            <Modal modal={modal} setModal={handlePopupModalClose} />
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