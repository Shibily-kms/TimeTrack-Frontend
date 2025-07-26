import React from 'react';
import './cards.scss';
import { GoDotFill } from 'react-icons/go';

const InstallationCard = ({ data, rework }) => {

    return (
        <div className={`card-boarder installation-card`}>
            <div className="card-top">
                <div className="top-left">
                    <p>{!rework ? 'INSTALLATION' : (data?.work_type).toUpperCase()}</p>
                </div>
                <div className="top-right">
                    <p>{new Date(data?.date).toDateString()}</p>
                </div>
            </div>
            <div className="card-center">
                <div className="center-section">
                    {Number(data?.received_amount) ? <div className="text-line fill-line"
                        style={{ backgroundColor: 'var(--background-secondary)', borderColor: 'var(--background-secondary)', color: 'var(--text-secondary)' }}>
                        <p>₹ {Number(data?.received_amount)}</p>
                    </div> : ""}
                </div>
                <div className="center-section">
                    {data?.product_name_1
                        ? <div className="text-line border-line"> <p>{data?.product_name_1}</p> </div>
                        : <div className="text-line border-line"> <p>{data?.product_name_0}</p> </div>}

                    {data?.site_category && <div className="text-line border-line">
                        <p>{data?.site_category}</p>
                    </div>}
                    {data?.description && <div className="text-line border-line">
                        <p>{data?.description}</p>
                    </div>}
                </div>

            </div>
            <div className="card-bottom">
                <div className="bottom-left">
                    <p>{data?.srl_number}</p>
                    {data?.re_filling_included && <GoDotFill />}
                    {data?.re_filling_included && <p>Refill Included</p>}
                </div>
                <div className="bottom-right">
                    <p>{data?.technician}</p>
                </div>
            </div>
        </div>
    )
}

export default InstallationCard