import React, { useEffect, useState } from 'react'
import './view-customer.scss'
import { cnPv2Axios } from '../../../config/axios'
import { useParams } from 'react-router-dom'
import SpinWithMessage from '../../../components/common/spinners/SpinWithMessage';
import Badge from '../../../components/common/badge/Badge';
import Modal from '../../../components/common/modal/Modal';
import { TbInfoTriangleFilled } from "react-icons/tb";
import { FaStar, FaWhatsapp } from "react-icons/fa";
import { IoCall } from "react-icons/io5";
import StartRate from '../../../components/user/view-customer/StartRate';
import PurifierSystem from '../../../components/user/view-customer/PurifierSystem';
import VesselSystem from '../../../components/user/view-customer/VesselSystem';

const ViewCustomer = ({ setPageHead }) => {
    const { cid } = useParams();
    const [loading, setLoading] = useState('fetch_s1')
    const [personalData, setPersonalData] = useState({})
    const [prProduct, setPrProduct] = useState({})
    const [vlProduct, setVlProduct] = useState({})
    const [prCards, setPrCards] = useState([])
    const [vlCards, setVlCards] = useState([])
    const [cardImages, setCardImages] = useState([])
    const [error, setError] = useState('')
    const [viewProduct, setViewProduct] = useState('')
    const [modal, setModal] = useState({ status: false })
    const [viewSection, setViewSection] = useState('product')


    const initialFetch = async () => {
        const personal = await cnPv2Axios.get(`/customer/profile?cid=${cid}&detail=YES`).then(res => setPersonalData(res.data))
        const cardImg = await cnPv2Axios.get(`/customer/service/card/image?cid=${cid}`).then(res => setCardImages(res.data))

        // fetch section-one
        Promise.all([personal, cardImg])
            .then(() => {
                setLoading('');
            })
            .catch((error) => {
                setError(error?.message)
            })
    }

    const handleChangeProduct = (type) => {
        setViewProduct(type)
    }

    useEffect(() => {
        initialFetch();
    }, [])

    useEffect(() => {

        setPageHead({
            title: `${personalData?.first_name} ${personalData?.last_name}`,
            desc: "This customer personal and product details."
        })
        setViewProduct(personalData?.purifier_customer_status ? 'purifier' : personalData?.wh_customer_status ? 'vessel' : '');

    }, [personalData])

    useEffect(() => {

        let ready = false
        let productAPI = null, cardAPI = null

        if (viewProduct === 'purifier' && !prProduct?.purifier_customer_status) {
            // fetch purifier data
            ready = true
            productAPI = cnPv2Axios.get(`/customer/product/purifier?cid=${cid}`).then(res => setPrProduct(res.data))
            cardAPI = cnPv2Axios.get(`/customer/service/card/purifier?cid=${cid}`).then(res => setPrCards(res.data))
        } else if (viewProduct === 'vessel' && !vlProduct?.wh_customer_status) {
            ready = true
            productAPI = cnPv2Axios.get(`/customer/product/vessel?cid=${cid}`).then(res => setVlProduct(res.data))
            cardAPI = cnPv2Axios.get(`/customer/service/card/vessel?cid=${cid}`).then(res => setVlCards(res.data))
        }

        if (ready) {
            setLoading('fetch_s2')
            Promise.all([productAPI, cardAPI])
                .then(() => {
                    setLoading('');
                })
                .catch((error) => {
                    setError(error?.message)
                })
        }

    }, [viewProduct])

    return (
        <div className="customer-view-page-div">
            {/* modal */}
            <Modal modal={modal} setModal={setModal} />
            {/* content */}
            {!error && <div className='content'>
                <div className="section section-one">
                    <div className="title">
                        <div className="text">
                            <p>Customer Info</p>
                        </div>
                        <div className="sub-menus">
                        </div>
                    </div>
                    <div className="text-list">
                        <div className="item">
                            <div className="label"> <p>Customer ID</p></div>
                            <div className="value"><p>{personalData?.cid}</p>
                            </div>
                        </div>
                        <div className="item">
                            <div className="label"> <p>Full name</p></div>
                            <div className="value"><p>{personalData?.full_name}</p>
                                {personalData?.star_rate > 0 && <div className="box">
                                    <Badge text={personalData?.star_rate} icon={<FaStar />} className={'success-fill'} styles={{ cursor: 'pointer' }}
                                        onClick={() => setModal({
                                            status: true, title: 'Start rate', content: <StartRate starNumber={personalData?.star_rate}
                                                starList={personalData?.star_details} />
                                        })} />
                                </div>}
                            </div>
                        </div>
                        <div className="item">
                            <div className="label"> <p>Address, Place</p></div>
                            <div className="value"><p>{personalData?.address?.address}, {personalData?.address?.place}</p></div>
                        </div>
                        <div className="item">
                            <div className="label"> <p>City, Pin code</p></div>
                            <div className="value"><p>{personalData?.address?.city_name} - {personalData?.address?.pin_code}</p></div>
                        </div>
                        <div className="item">
                            <div className="label"> <p>Lank mark</p></div>
                            <div className="value"><p>{personalData?.address?.land_mark}</p></div>
                        </div>
                        {personalData?.contact1 && <div className="item">
                            <div className="label"> <p>Primary number</p></div>
                            <div className="value"><p>{personalData?.contact1}</p>
                                <div className="box"><IoCall style={{ cursor: 'pointer' }} onClick={() => window.location.href = `tel:${personalData?.contact1}`} /></div>
                            </div>
                        </div>}
                        {personalData?.contact2 && <div className="item">
                            <div className="label"> <p>Secondary number</p></div>
                            <div className="value"><p>{personalData?.contact2}</p>
                                <div className="box"><IoCall style={{ cursor: 'pointer' }} onClick={() => window.location.href = `tel:${personalData?.contact2}`} /></div>
                            </div>
                        </div>}
                        {personalData?.whatsapp1 && <div className="item">
                            <div className="label"> <p>Whatsapp number</p></div>
                            <div className="value"><p>{personalData?.whatsapp1}</p>
                                <div className="box"><FaWhatsapp style={{ cursor: 'pointer' }} onClick={() => window.location.href = `https://wa.me/${personalData?.whatsapp1}`} /></div>
                            </div>
                        </div>}
                        <div className="amount-card">
                            <div className="card debit">
                                <p>₹ {personalData?.debit_amount}</p>
                                <p>Debit amount</p>
                            </div>
                            <div className="card credit">
                                <p>₹ {personalData?.credit_amount}</p>
                                <p>Credit amount</p>
                            </div>
                        </div>
                    </div>
                </div>
                {viewProduct && <div className="section section-two">
                    <div className="title">
                        <div className="text">
                            <p>{viewProduct === 'purifier' ? 'Purifier Details' : 'Vessels Details'}</p>
                        </div>
                        <div className="sub-menus">
                            <div className="section-sub-title">
                                <div className={viewSection === 'product' && 'active'} onClick={() => setViewSection('product')}>Product</div>
                                <div className={viewSection === 'card' && 'active'} onClick={() => setViewSection('card')}>Cards</div>
                            </div>
                        </div>
                    </div>
                    {viewProduct === 'purifier' && <PurifierSystem product={prProduct} cards={prCards} images={cardImages} viewSection={viewSection} />}
                    {viewProduct === 'vessel' && <VesselSystem product={vlProduct} cards={vlCards} images={cardImages} viewSection={viewSection} />}
                </div>}
            </div>}
            {/* Load & error */}
            {(error || loading) &&
                <SpinWithMessage load={loading} height={'400px'} icon={<TbInfoTriangleFilled />} message={error} />}
            {/* Menu */}
            {(personalData?.purifier_customer_status && personalData?.wh_customer_status && !error) && <div className="product-menu">
                <div className={viewProduct === 'purifier' ? "item active" : "item"} onClick={() => handleChangeProduct('purifier')}>
                    <p>Purifier</p>
                </div>
                <div className={viewProduct === 'vessel' ? "item active" : "item"} onClick={() => handleChangeProduct('vessel')}>
                    <p>Vessel</p>
                </div>
            </div>}
        </div>
    )
}

export default ViewCustomer