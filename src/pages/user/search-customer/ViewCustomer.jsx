import React, { useEffect, useState } from 'react'
import './view-customer.scss'
import { cnPv2Axios } from '../../../config/axios'
import { useNavigate, useParams } from 'react-router-dom'
import SpinWithMessage from '../../../components/common/spinners/SpinWithMessage'
import { TbInfoTriangleFilled } from 'react-icons/tb'
import { IoChevronForward, IoLocationOutline, IoShieldCheckmarkOutline } from 'react-icons/io5'
import { LuPackage } from 'react-icons/lu'

const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    if (Number.isNaN(date.getTime())) return dateStr
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

const ViewCustomer = ({ setPageHead }) => {
    const { cid } = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [customer, setCustomer] = useState(null)
    const [error, setError] = useState('')

    useEffect(() => {
        let isMounted = true
        setLoading(true)
        setError('')

        cnPv2Axios.get(`/customer/${cid}/profile`)
            .then((res) => {
                if (!isMounted) return
                setCustomer(res.data)
            })
            .catch((err) => {
                if (!isMounted) return
                setError(err?.message || 'Failed to load customer profile')
            })
            .finally(() => {
                if (!isMounted) return
                setLoading(false)
            })

        return () => {
            isMounted = false
        }
    }, [cid])

    useEffect(() => {
        if (customer) {
            setPageHead({
                title: customer?.customer_name || 'Customer Profile',
                desc: customer?.customer_id ? `CID ${customer.customer_id}` : 'Customer profile & products'
            })
        } else {
            setPageHead({
                title: 'Customer Profile',
                desc: 'Customer profile & products'
            })
        }
    }, [customer, setPageHead])

    const address = customer?.address || {}
    const addressLine1 = [address?.address, address?.place, address?.land_mark].filter(Boolean).join(', ')
    const addressLine2 = [
        address?.post ? `P.O ${address.post}` : '',
        address?.city_name,
        address?.state_name
    ].filter(Boolean).join(', ') + (address?.pin_code ? ` - ${address.pin_code}` : '')

    const products = Array.isArray(customer?.products) ? customer.products : []

    return (
        <div className="customer-view-page-div">
            {!loading && !error && customer && (
                <div className="mobile-content">
                    {/* Customer Profile Card */}
                    <div className="profile-card">
                        <div className="profile-top">
                            <h3 className="customer-name">{customer?.customer_name}</h3>
                            {customer?.customer_id && (
                                <span className="cid-badge">CID {customer.customer_id}</span>
                            )}
                        </div>

                        {(addressLine1 || addressLine2) && (
                            <div className="address-block">
                                <IoLocationOutline className="address-icon" />
                                <div className="address-lines">
                                    {addressLine1 && <p>{addressLine1}</p>}
                                    {addressLine2 && <p>{addressLine2}</p>}
                                </div>
                            </div>
                        )}

                        <div className="amount-row">
                            <span className="amount-item debit">Debit ₹ {customer?.debit_amount ?? 0}</span>
                            <span className="amount-item credit">Credit ₹ {customer?.credit_amount ?? 0}</span>
                        </div>
                    </div>

                    {/* Products List */}
                    <div className="products-section">
                        <div className="section-header">
                            <h4>Products</h4>
                            <span className="count-pill">{products.length}</span>
                        </div>

                        {products.length > 0 ? (
                            <div className="products-list">
                                {products.map((product) => {
                                    const pkg = product?.package
                                    const warranty = product?.warranty
                                    const hasWarranty = Boolean(warranty?.has_warranty)
                                    const isExpired = hasWarranty && warranty?.expire_date
                                        ? new Date(warranty.expire_date) < new Date()
                                        : false

                                    return (
                                        <div
                                            key={product?.product_id}
                                            className="product-card"
                                            onClick={() =>
                                                navigate(`/customer/${customer?.customer_id || cid}/product/${product?.product_id}/view`)
                                            }
                                        >
                                            <div className="product-card-top">
                                                <div className="product-title-group">
                                                    <h5 className="product-name">{product?.product_name}</h5>
                                                    {product?.product_type && (
                                                        <span className="product-type">{product.product_type}</span>
                                                    )}
                                                </div>
                                                <IoChevronForward className="nav-arrow" />
                                            </div>

                                            {(pkg?.package_name || warranty) && (
                                                <div className="product-meta">
                                                    {pkg?.package_name && (
                                                        <span
                                                            className="meta-pill package-pill"
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
                                                            <LuPackage />
                                                            <span>{pkg.package_name}</span>
                                                        </span>
                                                    )}

                                                    {hasWarranty ? (
                                                        <span className={`meta-pill warranty-pill ${isExpired ? 'expired' : 'active'}`}>
                                                            <IoShieldCheckmarkOutline />
                                                            <span>
                                                                {warranty?.expire_date
                                                                    ? `${isExpired ? 'Expired' : 'Valid till'} ${formatDate(warranty.expire_date)}`
                                                                    : warranty?.period
                                                                        ? `${warranty.period} ${warranty.period_type || ''}`.trim()
                                                                        : 'Warranty'}
                                                            </span>
                                                        </span>
                                                    ) : (
                                                        <span className="meta-pill warranty-pill none">
                                                            <IoShieldCheckmarkOutline />
                                                            <span>No Warranty</span>
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="empty-products">
                                <p>No products found for this customer.</p>
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

export default ViewCustomer
