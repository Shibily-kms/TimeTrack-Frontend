import React, { useEffect } from 'react'
import './work-details.scss'
import { useDispatch, useSelector } from 'react-redux'
import { convertIsoToAmPm, getTimeFromSecond, YYYYMMDDFormat } from '../../../assets/javascript/date-helper'
import SpinnerWithMessage from '../../../components/common/spinners/SpinWithMessage'
import { IoFingerPrint } from "react-icons/io5";
import { BsQrCodeScan } from "react-icons/bs";
import PunchWork from '../../../pages/user/punch-work/PunchWork'
import { useNavigate } from 'react-router-dom'
import { getPunchDetails } from '../../../redux/features/user/workdataSlice'
import { TbLoader } from 'react-icons/tb'

function WorkDetails() {
    const { workDetails, isLoading } = useSelector((state) => state.workData)
    const { user } = useSelector((state) => state.userAuth)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getPunchDetails())
        // eslint-disable-next-line
    }, [])

    return (
        <div className="semi-work-details">
            <div className="border">
                {workDetails?.name && workDetails?.date === YYYYMMDDFormat(new Date())
                    // Table view
                    ? <div className="list-body">
                        <div className="list-head">
                            <span></span>
                            <span>In</span>
                            <span>Out</span>
                            <span>Duration</span>
                        </div>
                        {/* Table content */}
                        {workDetails?.punch_list?.map((item, index) => <div className="list-item">
                            <span>Punch {index + 1}</span>
                            <span>{convertIsoToAmPm(new Date(item.in))}</span>
                            <span>{item.out ? convertIsoToAmPm(new Date(item.out)) : '-'}</span>
                            {item?.out
                                ? <span>{getTimeFromSecond((new Date(item?.out) - new Date(item.in)) / 1000) || '0m'}</span>
                                : <span>-</span>}
                        </div>)}

                    </div>
                    : <div >
                        <SpinnerWithMessage height={'200px'} icon={user?.punch_type === 'software' ? <IoFingerPrint /> : <BsQrCodeScan />}
                            message={user?.punch_type === 'software' ? 'Click punch In button for start work!' : 'Scan QR Code for start work!'} />
                    </div>}

                {/* Punch Actions */}
                <div className="action-buttons">
                    {isLoading
                        ? <div className='punching' >
                            <div className="punching-border">
                                <button className={"sync"} >
                                    <span className='loading-icon'><TbLoader /></span>
                                    <span>Syncing...</span></button>
                            </div>
                        </div >
                        : <>
                            {(user?.punch_type === 'software' || (user?.punch_type === 'firstInScanner' && workDetails?.punch_list?.[0])) && <PunchWork />}
                            {(!user?.punch_type || user?.punch_type === 'scanner' || (user?.punch_type === 'firstInScanner' && !workDetails?.punch_list?.[0]))
                                && <div className='punching' >
                                    <div className="punching-border">
                                        <button className={"scanner"} onClick={() => navigate('/scanner')}>
                                            <span ><BsQrCodeScan /></span>
                                            <span>Scanner</span></button>
                                    </div>
                                </div >}
                        </>}
                </div>
            </div>
        </div>
    )
}

export default WorkDetails