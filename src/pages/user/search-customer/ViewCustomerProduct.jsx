import React, { useCallback, useEffect, useState } from 'react'
import './view-customer-product.scss'
import { cnPv2Axios, vfPv1Axios } from '../../../config/axios'
import { useParams } from 'react-router-dom'
import SpinWithMessage from '../../../components/common/spinners/SpinWithMessage'
import SingleButton from '../../../components/common/buttons/SingleButton'
import ServiceCard from '../../../components/user/service-cards/ServiceCard'
import InstallationCard from '../../../components/user/service-cards/InstallationCard'
import CancellationCard from '../../../components/user/service-cards/CancellationCard'
import { TbInfoTriangleFilled } from 'react-icons/tb'
import {
    IoCalendarOutline,
    IoConstructOutline,
    IoDocumentTextOutline,
    IoLayersOutline,
    IoShieldCheckmarkOutline
} from 'react-icons/io5'
import { LuPackage } from 'react-icons/lu'

const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    if (Number.isNaN(date.getTime())) return dateStr
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

const formatLabel = (value) => {
    if (!value) return ''
    return String(value)
        .toLowerCase()
        .split('_')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')
}

const CARDS_PAGE_LIMIT = 10

const ViewCustomerProduct = ({ setPageHead }) => {
    const { customer_id, product_id } = useParams()
    const [loading, setLoading] = useState(true)
    const [product, setProduct] = useState(null)
    const [error, setError] = useState('')

    const [serviceCards, setServiceCards] = useState([])
    const [cardsPage, setCardsPage] = useState(0)
    const [hasMoreCards, setHasMoreCards] = useState(false)
    const [cardsLoading, setCardsLoading] = useState('')
    const [cardsError, setCardsError] = useState('')

    const fetchServiceCards = useCallback((pageNo = 0) => {
        setCardsLoading(pageNo === 0 ? 'fetch' : 'more')
        if (pageNo === 0) setCardsError('')
        console.log('Fetching service cards for product:', product_id, 'page:', pageNo)
        vfPv1Axios.get(`/customer/product/${product_id}/service-cards`, {
            params: {
                page: pageNo,
                limit: CARDS_PAGE_LIMIT
            }
        })
            .then((res) => {
                const payload = res?.data?.data ?? []

                const list = Array.isArray(payload)
                    ? payload
                    : Array.isArray(payload?.cards)
                        ? payload.cards
                        : []

                setServiceCards((prev) => (pageNo === 0 ? list : [...prev, ...list]))
                setCardsPage(pageNo)
                setHasMoreCards(list.length === CARDS_PAGE_LIMIT)
            })
            .catch((err) => {
                setCardsError(err?.message || 'Failed to load service cards')
            })
            .finally(() => {
                setCardsLoading('')
            })
    }, [product_id])

    useEffect(() => {
        let isMounted = true
        setLoading(true)
        setError('')
        setServiceCards([])
        setCardsPage(0)
        setHasMoreCards(false)

        cnPv2Axios.get(`/customer/${customer_id}/product/${product_id}/info`)
            .then((res) => {
                if (!isMounted) return
                setProduct(res.data?.data ?? res.data)
            })
            .catch((err) => {
                if (!isMounted) return
                setError(err?.message || 'Failed to load product details')
            })
            .finally(() => {
                if (!isMounted) return
                setLoading(false)
            })

        fetchServiceCards(0)

        return () => {
            isMounted = false
        }
    }, [customer_id, product_id, fetchServiceCards])

    useEffect(() => {
        if (product) {
            const parts = [product?.product_id, product?.customer_id ? `CID ${product.customer_id}` : ''].filter(Boolean)
            setPageHead({
                title: product?.product_name || 'Product Details',
                desc: parts.join(' · ') || 'Customer product details'
            })
        } else {
            setPageHead({
                title: 'Product Details',
                desc: 'Customer product details'
            })
        }
    }, [product, setPageHead])

    const warranty = product?.warranty
    const hasWarranty = Boolean(warranty?.has_warranty)
    const isWarrantyExpired = hasWarranty && warranty?.expire_date
        ? new Date(warranty.expire_date) < new Date()
        : false

    const pkg = product?.package
    const isPackageExpired = pkg?.expire_date
        ? new Date(pkg.expire_date) < new Date()
        : false

    return (
        <div className="customer-product-view-page-div">
            {!loading && !error && product && (
                <div className="mobile-content">
                    {/* Product Overview Card */}
                    <div className="overview-card">
                        <div className="card-top">
                            <div className="title-wrap">
                                <h3 className="product-name">{product?.product_name}</h3>
                                {(product?.product_type || product?.variant_code) && (
                                    <p className="product-sub">
                                        {[formatLabel(product?.product_type), product?.variant_code].filter(Boolean).join(' · ')}
                                    </p>
                                )}
                            </div>
                            {product?.product_id && (
                                <span className="id-badge">{product.product_id}</span>
                            )}
                        </div>

                        {(product?.origin_category || product?.installation_mode?.title) && (
                            <div className="chips-row">
                                {product?.origin_category && (
                                    <span className="info-chip">
                                        <IoLayersOutline />
                                        <span>{formatLabel(product.origin_category)}</span>
                                    </span>
                                )}
                                {product?.installation_mode?.title && (
                                    <span className="info-chip">
                                        <IoConstructOutline />
                                        <span>{product.installation_mode.title}</span>
                                    </span>
                                )}
                            </div>
                        )}

                        {product?.next_service_date && (
                            <div className="service-date-row">
                                <IoCalendarOutline />
                                <span>Next service on {formatDate(product.next_service_date)}</span>
                            </div>
                        )}

                        {product?.note && (
                            <div className="note-box">
                                <IoDocumentTextOutline className="note-icon" />
                                <p>{product.note}</p>
                            </div>
                        )}
                    </div>

                    {/* Package Card */}
                    {pkg && (
                        <div className="info-card">
                            <div className="info-card-head">
                                <div className="head-title">
                                    <LuPackage />
                                    <h4>Package</h4>
                                </div>
                                {pkg?.package_name && (
                                    <span
                                        className="status-pill"
                                        style={
                                            pkg?.color_code
                                                ? {
                                                    backgroundColor: `${pkg.color_code}20`,
                                                    borderColor: `${pkg.color_code}55`,
                                                    color: pkg.color_code
                                                }
                                                : undefined
                                        }
                                    >
                                        {pkg.package_name}
                                    </span>
                                )}
                            </div>

                            <div className="detail-grid">
                                {pkg?.duration_months !== undefined && pkg?.duration_months !== null && (
                                    <div className="detail-item">
                                        <span className="detail-label">Duration</span>
                                        <span className="detail-value">{pkg.duration_months} months</span>
                                    </div>
                                )}
                                {pkg?.start_date && (
                                    <div className="detail-item">
                                        <span className="detail-label">Start Date</span>
                                        <span className="detail-value">{formatDate(pkg.start_date)}</span>
                                    </div>
                                )}
                                {pkg?.expire_date && (
                                    <div className="detail-item">
                                        <span className="detail-label">Expire Date</span>
                                        <span className={`detail-value ${isPackageExpired ? 'expired-text' : ''}`}>
                                            {formatDate(pkg.expire_date)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Warranty Card */}
                    {warranty && (
                        <div className="info-card">
                            <div className="info-card-head">
                                <div className="head-title">
                                    <IoShieldCheckmarkOutline />
                                    <h4>Warranty</h4>
                                </div>
                                <span
                                    className={`status-pill ${hasWarranty
                                        ? isWarrantyExpired
                                            ? 'expired'
                                            : 'active'
                                        : 'none'
                                        }`}
                                >
                                    {hasWarranty
                                        ? isWarrantyExpired
                                            ? 'Expired'
                                            : 'Active'
                                        : 'No Warranty'}
                                </span>
                            </div>

                            {hasWarranty && (
                                <div className="detail-grid">
                                    {warranty?.period !== undefined && warranty?.period !== null && (
                                        <div className="detail-item">
                                            <span className="detail-label">Period</span>
                                            <span className="detail-value">
                                                {`${warranty.period} ${warranty?.period_type || ''}`.trim()}
                                            </span>
                                        </div>
                                    )}
                                    {warranty?.start_date && (
                                        <div className="detail-item">
                                            <span className="detail-label">Start Date</span>
                                            <span className="detail-value">{formatDate(warranty.start_date)}</span>
                                        </div>
                                    )}
                                    {warranty?.expire_date && (
                                        <div className="detail-item">
                                            <span className="detail-label">Expire Date</span>
                                            <span className={`detail-value ${isWarrantyExpired ? 'expired-text' : ''}`}>
                                                {formatDate(warranty.expire_date)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Service Cards Section */}
                    <div className="service-cards-section">
                        <div className="section-header">
                            <h4>Service Cards</h4>
                            <span className="count-pill">{serviceCards.length}</span>
                        </div>

                        {cardsLoading === 'fetch' ? (
                            <SpinWithMessage load={true} height="160px" />
                        ) : cardsError && serviceCards.length === 0 ? (
                            <SpinWithMessage
                                load={false}
                                height="160px"
                                icon={<TbInfoTriangleFilled />}
                                message={cardsError}
                            />
                        ) : serviceCards.length > 0 ? (
                            <>
                                <div className="service-cards-list">
                                    {serviceCards.map((card, index) => {
                                        const key = card?.service_srl_no || card?.installation_srl_no || card?._id || card?.id || index
                                        switch (card?.card_type) {
                                            case 'INSTALLATION_CARD':
                                                return <InstallationCard key={key} data={card} />
                                            case 'SERVICE_CANCEL_CARD':
                                                return <CancellationCard key={key} data={card} />
                                            case 'SERVICE_CARD':
                                            default:
                                                return <ServiceCard key={key} data={card} />
                                        }
                                    })}
                                </div>

                                {hasMoreCards && (
                                    <div className="see-more-wrap">
                                        <SingleButton
                                            name="See more"
                                            classNames="btn-tertiary"
                                            onClick={() => fetchServiceCards(cardsPage + 1)}
                                            loading={cardsLoading === 'more'}
                                        />
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="empty-cards">
                                <p>No service cards found.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {(error || loading) && (
                <SpinWithMessage
                    load={loading}
                    height="400px"
                    icon={<TbInfoTriangleFilled />}
                    message={error}
                />
            )}
        </div>
    )
}

export default ViewCustomerProduct
