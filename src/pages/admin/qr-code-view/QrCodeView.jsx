import React, { useEffect, useState } from 'react'
import './qr-code-view.scss'
import QRCode from 'qrcode.react';
import { FaLocationArrow } from "react-icons/fa";
import AllianceLogo from '../../../assets/images/alliance-logo.png'
import NpmIcon from '../../../assets/images/npm.png'
import { useSearchParams } from 'react-router-dom'
import { adminAxios } from '../../../config/axios';
import SpinWithMessage from '../../../components/common/spinners/SpinWithMessage'
import { TbQrcodeOff } from "react-icons/tb";
import { baseUrl } from '../../../config/axios'

const QrCodeView = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [loading, setLoading] = useState('fetch')
    const [qrTheme] = useState({ bgColor: '#f9f9fb', fgColor: '#161616' })
    const [data, setData] = useState({})
    const [lastGenerated, setLastGenerated] = useState(new Date())



    useEffect(() => {
        document.title = `QR Code | Alliance`;
        adminAxios.get(`qr-code?qrId=${searchParams.get('qrId')}`).then((response) => {
            setLoading('')
            setData(response.data)
        }).catch((error) => {
            setLoading(error?.message)

        })
    }, [])


    return (
        <div className="qr-code-view-page-div">
            <div className="align-div">
                <div className="top-div"></div>
                {data?.qrId
                    ? <div className="center-div">
                        <div className="qr-box">
                            <div className="name-div">
                                <FaLocationArrow />
                                <p>{data?.name || 'QR Code'}</p>
                            </div>
                            <div className='qr-code'>
                                <QRCode
                                    value={`${baseUrl}:3000/punch-scanner/qr?qrId=${data?.qrId}&gen-time=${lastGenerated}`}
                                    renderAs="svg"
                                    size={'225'}
                                    level='Q'
                                    bgColor={qrTheme?.bgColor}
                                    fgColor={qrTheme?.fgColor}
                                />
                                <img src={AllianceLogo} />
                            </div>
                            <p>Generated At<br></br> {lastGenerated.toDateString()}, {lastGenerated.toLocaleTimeString()}</p>
                        </div>
                        <p>Regenerate every 59 mints.</p>
                    </div>
                    : loading === 'fetch'
                        ? <SpinWithMessage load={true} />
                        : <SpinWithMessage icon={<TbQrcodeOff />} message={loading || 'Try agin!'} />}

                <div className="bottom-div">
                    <p>Co-operatives</p>
                    <div className="image-div">
                        <img src={AllianceLogo} />
                        <img src={NpmIcon} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default QrCodeView