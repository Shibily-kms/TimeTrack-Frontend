import React, { useEffect, useState } from 'react'
import './system-style.scss'
import { FaRegCircleCheck, FaRegCircleXmark } from 'react-icons/fa6'
import { FaRegCircle } from 'react-icons/fa'
import PurifierServiceCard from '../service-cards/PurifierServiceCard'
import { GoDotFill } from 'react-icons/go'
import InstallationCard from '../service-cards/InstallationCard'
import SpinWithMessage from '../../common/spinners/SpinWithMessage'
import { TbCreditCardOff } from 'react-icons/tb'

const PurifierSystem = ({ product, cards, images, viewSection }) => {
  const [serviceList, setServiceList] = useState([])
  const [complaintList, setComplaintList] = useState([])

  useEffect(() => {
    // service
    const maxServices = 4;
    let service = product?.service_count?.map((sr) => ({
      status: sr?.status ? 'Done' : 'Cancel',
      srl_number: sr?.srl_number,
      repeat: sr?.repeat
    }))

    if (['AMC', 'SSP', 'I/W']?.includes(product?.purifier_customer_status))
      while (service?.length < maxServices) {
        service.push({
          status: 'Pending',
          srl_number: null,
          repeat: false
        });
      }

    // complaint
    let complaint = product?.complaint_count?.map((sr) => ({
      status: sr?.status ? 'Done' : 'Cancel',
      srl_number: sr?.srl_number,
      repeat: sr?.repeat
    }))

    setServiceList(service)
    setComplaintList(complaint)

  }, [product])

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
            <div className="label"> <p>Model category</p></div>
            <div className="value"><p>{product?.product_category}</p>
            </div>
          </div>
          <div className="item">
            <div className="label"> <p>Site category</p></div>
            <div className="value"><p>{product?.product_usage}</p>
            </div>
          </div>
          <div className="item">
            <div className="label"> <p>Installation date</p></div>
            <div className="value"><p>{product?.installed_at ? new Date(product?.installed_at).toDateString() : '----'}</p>
            </div>
          </div>
          <div className="item">
            <div className="label"> <p>Purifier status</p></div>
            <div className="value"><p>{product?.purifier_customer_status}</p>
            </div>
          </div>
          <div className="item">
            <div className="label"> <p>Package Id</p></div>
            <div className="value"><p>{product?.package_id || '----'}</p>
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
            <div className="label"> <p>Carbon Start date</p></div>
            <div className="value"><p>{product?.carbon_filter_start_date ? new Date(product?.carbon_filter_start_date).toDateString() : '----'}</p>
            </div>
          </div>
          <div className="item">
            <div className="label"> <p>Carbon Expiry date</p></div>
            <div className="value"><p>{product?.carbon_filter_expiry_date ? new Date(product?.carbon_filter_expiry_date).toDateString() : '----'}</p>
            </div>
          </div>
          <div className="item">
            <div className="label"> <p>Next service date</p></div>
            <div className="value"><p>{product?.next_periodical_service_date ? new Date(product?.next_periodical_service_date).toDateString() : '----'}</p>
            </div>
          </div>
          {product?.purifier_customer_status === 'SSP' && <div className="item">
            <div className="label"> <p>Token Card No</p></div>
            <div className="value"><p>{product?.ssp_card_number || '----'}</p>
            </div>
          </div>}
          {product?.purifier_customer_status === 'SSP' && <div className="item">
            <div className="label"> <p>Pending Tokens</p></div>
            <div className="value"><p>{product?.pending_ssp_token || '----'}</p>
            </div>
          </div>}
          <div className="item">
            <div className="label"> <p>Services</p></div>
            <div className="value">
              <div className="box service-icons">
                {serviceList?.map((s) => {
                  return s?.status === 'Done' ? <FaRegCircleCheck className='done' title={s?.srl_number} />
                    : s?.status === 'Cancel' ? <FaRegCircleXmark className='cancel' title={s?.srl_number} />
                      : s?.status === 'Pending' ? <FaRegCircle className='pending' title={s?.srl_number} /> : ''
                })}
              </div>
            </div>
          </div>
          <div className="item">
            <div className="label"> <p>Complaints</p></div>
            <div className="value">
              <div className="box service-icons">
                {complaintList?.map((s) => {
                  return s?.status === 'Done' ? <FaRegCircleCheck className='done' title={s?.srl_number} />
                    : s?.status === 'Cancel' ? <FaRegCircleXmark className='cancel' title={s?.srl_number} />
                      : s?.status === 'Pending' ? <FaRegCircle className='pending' title={s?.srl_number} /> : ''
                })}
              </div>
            </div>
          </div>
        </div>
      </div>}

      {/* Cards */}
      {viewSection === 'card' && <div className='card-section'>
        <div className="line-mark">
          <div>
            <GoDotFill />
            <p>Primary</p>
          </div>
          <div>
            <GoDotFill />
            <p>Secondary</p>
          </div>
          <div>
            <GoDotFill />
            <p>Special</p>
          </div>
        </div>
        {(cards?.length > 0 || images?.length > 0) && <>
          {cards?.map((card, index) => {
            return card?.installation ? <InstallationCard key={index} data={card} />
              : card?.re_installation ? <InstallationCard key={index} data={card} rework={true} />
                : card?.service_card ? <PurifierServiceCard key={index} data={card} />
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


export default PurifierSystem