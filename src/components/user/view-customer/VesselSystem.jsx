import React from 'react'
import VesselServiceCard from '../service-cards/VesselServiceCard'
import InstallationCard from '../service-cards/InstallationCard'
import SpinWithMessage from '../../common/spinners/SpinWithMessage'
import { TbCreditCardOff } from 'react-icons/tb'

const VesselSystem = ({ product, cards, images, viewSection }) => {
  return (
    <div className="product-system-comp-div">
      {/* Product info */}
      {viewSection === 'product' && <div className="product-section">
        <div className="text-list">
          <div className="item">
            <div className="label"> <p>Model</p></div>
            <div className="value"><p>{product?.product_name}</p>
            </div>
          </div>
          <div className="item">
            <div className="label"> <p>Installation date</p></div>
            <div className="value"><p>{product?.installed_at ? new Date(product?.installed_at).toDateString() : '----'}</p>
            </div>
          </div>
          <div className="item">
            <div className="label"> <p>Vessel status</p></div>
            <div className="value"><p>{product?.wh_customer_status}</p>
            </div>
          </div>
          <div className="item">
            <div className="label"> <p>Package Start date</p></div>
            <div className="value"><p>{product?.package_started_date ? new Date(product?.package_started_date).toDateString() : '----'}</p>
            </div>
          </div>
          <div className="item">
            <div className="label"> <p>Package Expiry date</p></div>
            <div className="value"><p>{product?.package_expiry_date ? new Date(product?.package_expiry_date).toDateString() : '----'}</p>
            </div>
          </div>
          <div className="item">
            <div className="label"> <p>Next service date</p></div>
            <div className="value"><p>{product?.next_periodical_service_date ? new Date(product?.next_periodical_service_date).toDateString() : '----'}</p>
            </div>
          </div>
        </div>
      </div>}

      {/* Cards */}
      {viewSection === 'card' && <div className='card-section'>
        {(cards?.length > 0 || images?.length > 0) && <>
          {cards?.map((card, index) => {
            return card?.installation ? <InstallationCard key={index} data={card} />
              : card?.re_installation ? <InstallationCard key={index} data={card} rework={true} />
                : card?.service_card ? <VesselServiceCard key={index} data={card} />
                  : ''
          })}
        </>}
        {images?.length > 0 && <>
          {images?.map((card) => <img alt={card.image.key} src={card.image.url} />)}
        </>}
        {(cards?.length < 0 && images?.length < 1) &&
          <SpinWithMessage icon={<TbCreditCardOff />} message='No Cards' height={'400px'} />}
      </div>}
    </div>
  )
}

export default VesselSystem