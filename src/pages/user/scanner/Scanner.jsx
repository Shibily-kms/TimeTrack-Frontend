import React, { useEffect, useRef, useState } from 'react'
import './scanner.scss'
import Webcam from 'react-webcam';
import jsQR from 'jsqr';
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import SingleButton from '../../../components/common/buttons/SingleButton'
import { BiSolidCameraOff } from "react-icons/bi";
import { GiCheckMark } from "react-icons/gi";
import { MdClose } from "react-icons/md";
import { getUserProfileImagePath } from '../../../assets/javascript/find-helpers';
import { convertIsoToAmPm } from '../../../assets/javascript/date-helper';
import { userAxios } from '../../../config/axios';
import { getPunchDetails } from '../../../redux/features/user/workdataSlice';
import { BiSolidMessageAltError } from "react-icons/bi";
import SpinWithMessage from '../../../components/common/spinners/SpinWithMessage';
import { FaLink } from "react-icons/fa6";
import { TbClockQuestion } from "react-icons/tb";
import { HiArrowTopRightOnSquare } from "react-icons/hi2";

const Scanner = React.memo(() => {

    const { user } = useSelector((state) => state.userAuth)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const webcamRef = useRef(null);
    const [qrCodeText, setQrCodeText] = useState('');
    const [scanning, setScanning] = useState(false);
    const [time, setTime] = useState(new Date());
    const [res, setRes] = useState({ status: '', title: '', message: '' })
    const [loading, setLoading] = useState('')
    const [outLink, setOutLink] = useState(false)

    const userProfileImage = getUserProfileImagePath(user?.last_name);


    useEffect(() => {

        async function setupWebcamAndScanner() {

            try {
                if (!user?.acc_id) {
                    navigate('/auth/sign-in')
                    return;
                }

                // Check for camera permissions
                const permissionStatus = await navigator.permissions.query({ name: 'camera' });

                if (permissionStatus.state === 'denied') {
                    setRes({
                        status: 'error',
                        title: 'Camera access is denied',
                        message: 'Please enable camera access in your browser settings.',
                        icon: <BiSolidCameraOff />
                    })
                    return;
                }

                if (permissionStatus.state === 'prompt' || permissionStatus.state === 'denied') {
                    // Try to get access to the camera
                    await navigator.mediaDevices.getUserMedia({ video: true });
                }

                setScanning(true);

                const scanInterval = setInterval(() => {
                    const imageSrc = webcamRef.current?.getScreenshot();
                    if (imageSrc) {
                        const canvas = document.createElement("canvas");
                        const context = canvas.getContext("2d");
                        const image = new Image();
                        image.onload = () => {
                            canvas.width = image.width;
                            canvas.height = image.height;
                            context.drawImage(image, 0, 0, canvas.width, canvas.height);
                            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                            const code = jsQR(imageData.data, imageData.width, imageData.height, {
                                inversionAttempts: "dontInvert",
                            });
                            if (code) {
                                clearInterval(scanInterval);
                                setQrCodeText(code.data);
                                setScanning(false);
                                setLoading('fetch')
                            }
                        };
                        image.src = imageSrc;
                    }
                }, 10);

                return () => {
                    clearInterval(scanInterval);
                };

            } catch (err) {
                setRes({
                    status: 'error',
                    title: 'Camera access denied',
                    message: 'Please ensure your device settings allow camera access for this website.',
                    icon: <BiSolidCameraOff />
                })
            }

        }

        setupWebcamAndScanner()
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => {
            clearInterval(timer);
        };
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        // Check URL and Call API for Punch
        if (qrCodeText) {
            setLoading('fetch')
            const QR_KEYS = qrCodeText?.split('=')
            if (QR_KEYS && QR_KEYS?.length === 5 && QR_KEYS?.[0] === 'AWSQR' && QR_KEYS?.[2] === 'PUNCH') {
                const QR_ID = QR_KEYS?.[3]
                const GEN_TIME = new Date(QR_KEYS?.[4])
                const BEFORE59MIN_TIME = new Date(new Date().setMinutes(new Date().getMinutes() - 59))
                if (BEFORE59MIN_TIME < GEN_TIME) {
                    // QR Code is Ok
                    userAxios.post('/punch/by-qr', {
                        qrId: QR_ID, userId: user?.acc_id,
                        designation: user?.designation
                    })
                        .then((response) => {
                            dispatch(getPunchDetails())
                            setRes({
                                status: 'success',
                                title: 'Success!',
                                message: response.message,
                                icon: <GiCheckMark />
                            })
                            setLoading('')
                        }).catch((error) => {
                            setRes({
                                status: 'error',
                                title: error.message,
                                message: "Please try onces more Or use another QR Code",
                                icon: <BiSolidMessageAltError />
                            })
                            setQrCodeText('')
                            setLoading('')
                        })

                } else {
                    // Expired QR Code
                    setRes({
                        status: 'error',
                        title: 'This QR Code Expired',
                        message: "Please try onces more Or use another QR Code",
                        icon: <TbClockQuestion />
                    })
                    setQrCodeText('')
                    setLoading('')
                }
            } else {
                // Out QR Code
                setRes({
                    status: 'error',
                    title: 'This is Outside link',
                    message: "This link will take you to a site outside Alliance software",
                    icon: <FaLink />
                })
                setLoading('')
                setOutLink(true)
            }
        }
        // eslint-disable-next-line
    }, [qrCodeText])

    return (
        <div className='scanner-page-div'>
            {/* {scanning && */}
            {!res?.status && !qrCodeText &&
                <div className="camera-div">
                    <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        height='100%'
                        videoConstraints={{
                            facingMode: "environment"  // This might help on mobile to use the rear camera by default
                        }}
                    />
                </div>}
            <div className="content-div">
                {!res?.status && !qrCodeText &&
                    <div className="box-0-div">
                        {/* First Child Div */}
                        <div class="scan-box-div">
                            <div class="hole">
                                <div className="one"></div>
                                <div className="two"></div>
                                <div className="three"></div>
                                <div className="four"></div>
                            </div>
                        </div>

                        {/* Second Child Div */}
                        <div className="top-trans-layer-div">
                            <div className="section-one-div">
                                <div className="name-info-div">
                                    <div className="time-div">
                                        <div className="image-div">
                                            <img src={userProfileImage} alt='Profile' />
                                        </div>
                                        <p>{convertIsoToAmPm(time)}</p>
                                    </div>
                                    <MdClose onClick={() => navigate('/?page=home')} />
                                </div>
                            </div>
                            <div className="section-two-div">
                                <p>{scanning ? 'Scanning...' : 'Do Punch With Scanner'}</p>
                            </div>
                        </div>
                    </div>
                }

                {res?.status && <div className="popup-result-div">
                    <div className="box-div">
                        {res.icon}
                        <h3>{res?.title}</h3>
                        <p>{res?.message}</p>
                        {outLink && <SingleButton name={'Open link'} classNames={'btn-blue'} stIcon={<HiArrowTopRightOnSquare />}
                            onClick={() => window.open(qrCodeText, '_blank')} />}
                    </div>

                    <SingleButton name={'Close'} classNames={'lg'} style={{ width: "100%" }}
                        onClick={() => navigate(-1)} />
                </div>}
                {
                    loading === 'fetch' && <SpinWithMessage load height={'80vh'} />
                }
            </div>
        </div>
    )
})

export default Scanner