import React, { useEffect, useState } from 'react';
import './cards.scss';
import { GoDotFill } from 'react-icons/go';

const VesselServiceCard = ({ data }) => {
    const [colorCode, setColorCode] = useState('')

    useEffect(() => {
        setColorCode(data?.wh_customer_status === 'AMC' ? 'amc-card'
            : data?.wh_customer_status === 'SSP' ? 'ssp-card'
                : data?.wh_customer_status === 'I/W' ? 'iw-card'
                    : data?.wh_customer_status === 'O/W' ? 'ow-card'
                        : data?.wh_customer_status === 'O/C' ? 'oc-card' : ''
        )
    }, [])
    return (
        <div className={`card-boarder service-card ${colorCode}`}>
            <div className="card-top">
                <div className="top-left">
                    <p>{data?.wh_customer_status}</p>
                    <GoDotFill />
                    <p>{data?.work_type?.toUpperCase()}</p>
                </div>
                <div className="top-right">
                    <p>{new Date(data?.date).toDateString()}</p>
                </div>
            </div>
            <div className="card-center">
                <div className="center-section">
                    {data?.work_description
                        ? <div className="text-line border-line primary-line">
                            <p style={{ maxWidth: '500px' }}>{data?.work_description}</p>
                        </div>
                        : <div className="text-line border-line primary-line">
                            <p>No Description</p>
                        </div>}
                </div>

            </div>
            <div className="card-bottom">
                <div className="bottom-left">
                    <p>{data?.service_srl_number}</p>
                    <GoDotFill />
                    <p>{data?.work_type}</p>
                </div>
                <div className="bottom-right">
                    <p>{data?.technician}</p>
                </div>
            </div>
        </div >
    )
}

export default VesselServiceCard