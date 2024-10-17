import React, { useEffect, useState } from 'react'
import './qr-code-view.scss'
import QRCode from 'qrcode.react';
import { FaLocationArrow } from "react-icons/fa";
import AllianceLogo from '../../../assets/images/alliance-logo.png'
import { useSearchParams } from 'react-router-dom'
import { adminAxios } from '../../../config/axios';
import SpinWithMessage from '../../../components/common/spinners/SpinWithMessage'
import { TbQrcodeOff } from "react-icons/tb";
import { FaRotate } from 'react-icons/fa6';

const QrCodeView = () => {
    // eslint-disable-next-line
    const [searchParams, setSearchParams] = useSearchParams()
    const [loading, setLoading] = useState('fetch')
    const [qrTheme] = useState({ bgColor: '#f9f9fb', fgColor: '#161616' })
    const [data, setData] = useState({})
    const [lastGenerated, setLastGenerated] = useState(new Date())
    const [SRotate, setSRotate] = useState(false)


    useEffect(() => {
        document.title = `QR Code | Alliance`;
        adminAxios.get(`qr-code?qrId=${searchParams.get('qrId')}`).then((response) => {
            setLoading('')
            setData(response.data)
        }).catch((error) => {
            setLoading(error?.message)

        })

        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        const autoRegenerateTime = setInterval(() => {
            setLastGenerated(new Date())
        }, 1000 * 60 * 59)  // 59 Mints

        return () => clearInterval(autoRegenerateTime);

        // eslint-disable-next-line
    }, [])


    return (
        <div className="qr-code-view-page-div">
            <div className={SRotate ? "align-div rotate-align" : 'align-div'}>
                <div className="top-div"></div>
                {data?.qrId
                    ? <div className="center-div">
                        <div className="qr-box">
                            <div className="name-div">
                                <FaLocationArrow />
                                <p>{data?.name || 'QR Code'}</p>
                            </div>
                            <div className='qr-code'>
                                {/*
                                    QR_CODE RESPOND
                                    = BAR_TYPE = VERSION = QR_TYPE = QR_ID = GEN_TIME 
                                    = AWSQR=v1=PUNCH=QR_ID=TIME
                                */}
                                <QRCode
                                    value={`AWSQR=v1=PUNCH=${data?.qrId}=${lastGenerated}`}
                                    renderAs="svg"
                                    size={'300'}
                                    level='Q'
                                    bgColor={qrTheme?.bgColor}
                                    fgColor={qrTheme?.fgColor}
                                />
                                <img src={AllianceLogo} alt='alliance-logo' />
                            </div>
                            <p>Generated At<br></br> {lastGenerated.toDateString()}, {lastGenerated.toLocaleTimeString()}</p>
                        </div>
                        <p>Regenerate every 59 mints.</p>
                    </div>
                    : loading === 'fetch'
                        ? <SpinWithMessage load={true} />
                        : <SpinWithMessage icon={<TbQrcodeOff />} message={loading || 'Try agin!'} />}

                <div className="bottom-div">
                    <div className="image-div">
                        <FaRotate onClick={() => setSRotate(!SRotate)} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default QrCodeView