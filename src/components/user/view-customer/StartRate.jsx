import React from 'react'
import './star-rate.scss'
import { Rating } from 'react-simple-star-rating'
import { FaStar } from 'react-icons/fa'

const StartRate = ({ starNumber, starList }) => {
    return (
        <div className="start-rate-comp-div">
            <div className="main-start" >
                <Rating allowFraction size={40} initialValue={starNumber || 0} readonly={true} SVGstyle={{ borderRadius: "5px" }}
                    fillIcon={<FaStar style={{ color: 'var(--text-tertiary)', fontSize: '40px' }} />}
                    emptyIcon={<FaStar style={{ color: 'var(--text-c3)', fontSize: '40px' }} />}
                />
                <h3 style={{ fontSize: '23px' }}>{parseFloat(starNumber || 0).toFixed(1)}</h3>
            </div>
            <div className="star-list">
                <div className="single">
                    <p>Premium</p>
                    <Rating allowFraction size={20} initialValue={parseFloat((starList?.premium || 0) * 5).toFixed(1)} readonly={true} SVGstyle={{ borderRadius: "5px" }}
                        fillIcon={<FaStar style={{ color: 'var(--text-tertiary)', fontSize: '20px' }} />}
                        emptyIcon={<FaStar style={{ color: 'var(--text-c3)', fontSize: '20px' }} />}
                    />
                </div>
                <div className="single">
                    <p>Behavior</p>
                    <Rating allowFraction size={20} initialValue={parseFloat((starList?.behavior || 0) * 5).toFixed(1)} readonly={true} SVGstyle={{ borderRadius: "5px" }}
                        fillIcon={<FaStar style={{ color: 'var(--text-tertiary)', fontSize: '20px' }} />}
                        emptyIcon={<FaStar style={{ color: 'var(--text-c3)', fontSize: '20px' }} />}
                    />
                </div>
                <div className="single">
                    <p>Service</p>
                    <Rating allowFraction size={20} initialValue={parseFloat((starList?.service || 0) * 5).toFixed(1)} readonly={true} SVGstyle={{ borderRadius: "5px" }}
                        fillIcon={<FaStar style={{ color: 'var(--text-tertiary)', fontSize: '20px' }} />}
                        emptyIcon={<FaStar style={{ color: 'var(--text-c3)', fontSize: '20px' }} />}
                    />
                </div>
                <div className="single">
                    <p>Continuity</p>
                    <Rating allowFraction size={20} initialValue={parseFloat((starList?.continuity || 0) * 5).toFixed(1)} readonly={true} SVGstyle={{ borderRadius: "5px" }}
                        fillIcon={<FaStar style={{ color: 'var(--text-tertiary)', fontSize: '20px' }} />}
                        emptyIcon={<FaStar style={{ color: 'var(--text-c3)', fontSize: '20px' }} />}
                    />
                </div>
                <div className="single">
                    <p>Payment</p>
                    <Rating allowFraction size={20} initialValue={parseFloat((starList?.payment || 0) * 5).toFixed(1)} readonly={true} SVGstyle={{ borderRadius: "5px" }}
                        fillIcon={<FaStar style={{ color: 'var(--text-tertiary)', fontSize: '20px' }} />}
                        emptyIcon={<FaStar style={{ color: 'var(--text-c3)', fontSize: '20px' }} />}
                    />
                </div>
            </div>
        </div>
    )
}

export default StartRate