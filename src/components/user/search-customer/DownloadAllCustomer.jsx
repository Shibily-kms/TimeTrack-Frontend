import React, { useEffect, useState } from 'react'
import './download.scss'
import * as XLSX from 'xlsx';
import { FiDownload } from 'react-icons/fi'
import { FaCheck } from 'react-icons/fa6'
import { cnPv2Axios } from '../../../config/axios'
import { useDispatch } from 'react-redux'
import { toast } from '../../../redux/features/user/systemSlice'
import { exportSomeCustomerToExcel, exportAllCustomerExcel } from '../../../assets/javascript/xl-helpers'

const DownloadAllCustomer = ({ data, setModal }) => {
    const dispatch = useDispatch()
    const [onDownload, setOnDownload] = useState(false)
    const [progress, setProgress] = useState(0)
    const [completed, setCompleted] = useState(false)

    const downloadFile = (workbook, filename) => {
        const excelBuffer = XLSX.write(workbook, {
            bookType: 'xlsx', bookSST: true, type: 'array', cellDates: true, cellNF: false
        });

        const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
        filename = filename + '.xlsx';

        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            // For IE browser
            window.navigator.msSaveOrOpenBlob(data, filename);
            setCompleted(true)
            setProgress('100')
        } else {
            // For other browsers
            const url = window.URL.createObjectURL(data);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            link.click();
            window.URL.revokeObjectURL(url);
            setProgress('100')
            setCompleted(true)
        }
    }

    const handleDownloadClick = () => {
        setOnDownload(true)
        if (data) {
            const workbook = exportSomeCustomerToExcel(data)
            downloadFile(workbook, `Search Result`)
        } else {
            cnPv2Axios.get('customer/list/full', {
                onDownloadProgress: (progressEvent) => {
                    const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setProgress(percentage);
                }
            }).then((response) => {
                setProgress(0)
                const dataSort = (response.data || []).sort((a, b) => parseInt(a.cid) - parseInt(b.cid));
                const workbook = exportAllCustomerExcel(dataSort || [])
                downloadFile(workbook, `Customer Details`)
            }).catch((error) => {
                dispatch(toast.push.error({ message: error?.message }))
                setModal({ status: false })
            })
        }
    }

    useEffect(() => {
        const timerId = setTimeout(() => {
            if (completed)
                setModal({ status: false })
        }, 2000);

        return () => clearTimeout(timerId);
    }, [completed]);

    const circumference = 2 * Math.PI * 40
    const strokeDashoffset = circumference - (progress / 100) * circumference

    return (
        <div className="download-customer-list">
            {!onDownload && <div className='download-button' onClick={handleDownloadClick}>
                <svg className="progress-ring" width="100" height="100">
                    <circle
                        className="progress-ring__background"
                        r="40"
                        cx="50"
                        cy="50"
                    />
                    <foreignObject x="0" y="0" width="100" height="100">
                        <div className="icon-container">
                            <FiDownload className="download-icon" />
                        </div>
                    </foreignObject>
                </svg>
            </div>}

            {onDownload && <div className={`download-button ${progress ? 'loading' : "waiting"}`} onClick={handleDownloadClick}>
                <svg className="progress-ring" width="100" height="100">
                    <circle
                        className="progress-ring__background"
                        r="40"
                        cx="50"
                        cy="50"
                    />
                    <circle
                        className="progress-ring__circle"
                        strokeWidth="6"
                        strokeDasharray={circumference}
                        strokeDashoffset={progress ? strokeDashoffset : "200"}
                        r="40"
                        cx="50"
                        cy="50"
                    />
                    <foreignObject x="0" y="0" width="100" height="100">
                        <div className="icon-container">
                            {completed
                                ? <FaCheck className="download-icon" />
                                : <FiDownload className="download-icon" />}
                        </div>
                    </foreignObject>
                </svg>
            </div>}

            <p>{completed ? "Download Completed"
                : onDownload
                    ? "Processing..."
                    : 'Download the Excel file using the button.'}</p>
        </div>
    )
}

export default DownloadAllCustomer