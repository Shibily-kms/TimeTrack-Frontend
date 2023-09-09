import React, { useEffect, useState } from 'react'
import * as XLSX from 'xlsx';
import './top-bar.scss'
import Title from '../../common/title/Title'
import { getTimeFromSecond, stringToLocalTime } from '../../../assets/javascript/date-helper'
import { useLocation, useNavigate } from 'react-router-dom'
import { BiLoaderAlt } from 'react-icons/bi'
import { BsFillCalendarCheckFill, BsFillCalendarEventFill } from 'react-icons/bs'
import { adminAxios } from '../../../config/axios';
import { toast } from 'react-hot-toast';

function TopBar({ oneDay, staff }) {
    const location = useLocation()
    const [loading, setLoading] = useState('')
    const navigate = useNavigate()



    // Convert to Excel Start
    const handleOneDayDownload = () => {
        setLoading('one')
        adminAxios.get('/analyze/staff-work-data', {
            params: {
                from_date: `${oneDay.year}-${(oneDay.month + 1).toString().padStart(2, '0')}-${oneDay.date.toString().padStart(2, '0')}`,
                to_date: `${oneDay.year}-${(oneDay.month + 1).toString().padStart(2, '0')}-${oneDay.date.toString().padStart(2, '0')}`,
                type: 'staff-basie'
            }
        }).then((response) => {
            const workbook = exportToExcel(response.data.data);
            downloadFile(
                workbook,
                `staff_works ${oneDay.year}-${(oneDay.month + 1).toString().padStart(2, '0')}-${oneDay.date.toString().padStart(2, '0')}`
            )
        }).catch((error) => {
            toast.error(error.response.data.message)
        })
    }

    useEffect(() => {
        if (!location?.state?.from_date || !location?.state?.to_date) {
            navigate('/admin')
        }
        // eslint-disable-next-line
    }, [])

    const handleAllDayDownload = () => {
        setLoading('all')
        adminAxios.get('/analyze/staff-work-data', {
            params: {
                from_date: location?.state?.from_date,
                to_date: location?.state?.to_date,
                type: 'staff-basie',
                staff_id: location?.state?.staff || null
            }
        }).then((response) => {
            if (response.data.data?.[0]) {
                const workbook = exportToExcel(response.data.data);
                downloadFile(workbook, `${staff ? response.data.data?.[0]?.full_name + '-work' : 'staff_works'}`)
            } else {
                setLoading('')
                toast.error('No data!')
            }
        }).catch((error) => {
            toast.error(error.response.data.message)
        })
    }

    const exportToExcel = (datas) => {

        const workbook = XLSX.utils.book_new();
        datas.forEach((staff, index) => {
            const sheetName = staff.full_name;
            const workSheetData = staff.dates.flatMap((date) => {
                const punch = {
                    date: date.date,
                    type: 'Punch',
                    work: '',
                    start: stringToLocalTime(date.punch.in),
                    end: stringToLocalTime(date.punch.out),
                    duration: getTimeFromSecond(date.punch.duration) || '0m'
                }
                let overTime = {
                    date: date.date,
                    type: 'Over time',
                    work: '',
                    start: stringToLocalTime(date.over_time.in),
                    end: stringToLocalTime(date.over_time.out),
                    duration: getTimeFromSecond(date.over_time.duration) || '0m'
                }
                overTime = date?.over_time?.in ? [overTime] : []
                let lunchBreak = {
                    date: date.date,
                    type: 'Lunch break',
                    work: '',
                    start: stringToLocalTime(date.lunch_break.start),
                    end: stringToLocalTime(date.lunch_break.end),
                    duration: getTimeFromSecond(date.lunch_break.duration) || '0m'
                }
                lunchBreak = date?.lunch_break?.start ? [lunchBreak] : []
                const regular = date.regular_work.map((workObj) => ({
                    date: date.date,
                    type: 'Regular work',
                    work: workObj.work,
                    start: stringToLocalTime(workObj.start),
                    end: stringToLocalTime(workObj.end),
                    duration: null
                }));
                const extra = date.extra_work.map((workObj) => ({
                    date: date.date,
                    type: 'Extra work',
                    work: workObj.work,
                    start: stringToLocalTime(workObj.start),
                    end: stringToLocalTime(workObj.end),
                    duration: null
                }));
                const breaks = date.break.map((obj, idx) => ({
                    date: date.date,
                    type: `Break ${idx + 1}`,
                    work: '',
                    start: stringToLocalTime(obj.start),
                    end: stringToLocalTime(obj.end),
                    duration: getTimeFromSecond(obj.duration) || '0m'
                }));
                return [punch, ...regular, ...extra, ...breaks, ...overTime, ...lunchBreak, '']
            })

            const worksheet = XLSX.utils.json_to_sheet(workSheetData);
            XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
        })
        setLoading('')
        return workbook;
    };


    const downloadFile = (workbook, filename) => {
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

        const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        filename = filename + '.xlsx';

        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            // For IE browser
            window.navigator.msSaveOrOpenBlob(data, filename);
        } else {
            // For other browsers
            const url = window.URL.createObjectURL(data);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            link.click();
            window.URL.revokeObjectURL(url);
            setLoading('')
        }
    }

    // Convert to Excel End



    return (
        <div className='staff-work-top-bar'>
            <div className="container">
                <div>
                    <Title sub={'Work analyze table'} />
                </div>
                <div className="border">
                    <div className="top">
                        <div>
                            {location?.state?.from_date === location?.state?.to_date ?
                                <p>{`Date : ${location?.state?.from_date}`}</p>
                                : <>
                                    <p>{`From : ${location?.state?.from_date}`}</p>
                                    <p>{`To : ${location?.state?.to_date}`}</p>
                                </>
                            }
                        </div>
                        <div className="buttons-box">
                            <p>Download Excel file</p>
                            <div className="buttons">
                                {!staff && <>
                                    {oneDay?.count ? <button title='Download this day XL file' onClick={() => handleOneDayDownload()}><span
                                        className={loading === 'one' ? 'loading-icon' : ''}>{loading === 'one' ? <BiLoaderAlt /> : <BsFillCalendarEventFill />}
                                    </span> <span className='text'>This day</span>  </button> :
                                        <button style={{ opacity: '.5', cursor: 'not-allowed' }} ><span> <BsFillCalendarEventFill />
                                        </span> <span className='text'>This day</span>  </button>}
                                </>
                                }

                                <button title='Download all days XL file' onClick={() => handleAllDayDownload()}><span
                                    className={loading === 'all' ? 'loading-icon' : ''}>{loading === 'all' ? <BiLoaderAlt /> : <BsFillCalendarCheckFill />}
                                </span> <span className='text'>All days</span>  </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TopBar