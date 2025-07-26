import React, { useEffect, useState } from 'react';
import './cards.scss';
import { GoDotFill } from 'react-icons/go';

const PurifierServiceCard = ({ data }) => {
  const [colorCode, setColorCode] = useState('')

  useEffect(() => {
    setColorCode(data?.purifier_customer_status === 'AMC' ? 'amc-card'
      : data?.purifier_customer_status === 'SSP' ? 'ssp-card'
        : data?.purifier_customer_status === 'I/W' ? 'iw-card'
          : data?.purifier_customer_status === 'O/W' ? 'ow-card'
            : data?.purifier_customer_status === 'O/C' ? 'oc-card' : ''
    )
  }, [])

  return (
    <div className={`card-boarder service-card ${colorCode}`}>
      <div className="card-top">
        <div className="top-left">
          <p>{data?.purifier_customer_status}</p>
          <GoDotFill />
          <p>{data?.work_method?.toUpperCase()}</p>
        </div>
        <div className="top-right">
          <p>{new Date(data?.date).toDateString()}</p>
        </div>
      </div>
      <div className="card-center">
        <div className="center-section">
          {Number(data?.grand_total_receivable) > 0 &&
            <div className="text-line fill-line" style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--background-secondary)' }}>
              <p>₹ {data?.grand_total_receivable}</p>
            </div>}
          {data?.repeat_work && <div className="text-line fill-line">
            <p>Repeat</p>
          </div>}
          {data?.cabin_change && <div className="text-line fill-line">
            <p>Cabin replace</p>
          </div>}
          {(!data?.primary_spares?.length && !data?.secondary_spares?.length && !data?.special_spares?.length) &&
            <div className="text-line fill-line">
              <p>No spare change</p>
            </div>}
        </div>
        <div className="center-section">
          {data?.primary_spares?.map((spare, index) => {
            return <div key={index} className="text-line border-line primary-line">
              <p>{spare?.spare_name}</p>
              <p>{spare?.quantity}</p>
            </div>
          })}
          {data?.secondary_spares?.map((spare, index) => {
            return <div key={index} className="text-line border-line secondary-line">
              <p>{spare?.spare_name}</p>
              <p>{spare?.quantity}</p>
            </div>
          })}
          {data?.special_spares?.map((spare, index) => {
            return <div key={index} className="text-line border-line special-line">
              <p>{spare?.spare_name}</p>
              <p>{spare?.quantity}</p>
            </div>
          })}
        </div>

      </div>
      <div className="card-bottom">
        <div className="bottom-left">
          <p>{data?.service_srl_number}</p>
          <GoDotFill />
          <p>{data?.work}</p>
        </div>
        <div className="bottom-right">
          <p>{data?.technician}</p>
        </div>
      </div>
    </div >
  )
}

export default PurifierServiceCard