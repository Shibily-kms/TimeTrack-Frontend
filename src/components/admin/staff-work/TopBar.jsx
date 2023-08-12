import React, { useState } from 'react'
import * as XLSX from 'xlsx';
import './top-bar.scss'
import Title from '../../common/title/Title'
import { useLocation } from 'react-router-dom'
import { BiLoaderAlt } from 'react-icons/bi'
import { RiFileExcel2Fill } from 'react-icons/ri'
import { adminAxios } from '../../../config/axios';

function TopBar() {
    const location = useLocation()
    const [loading, setLoading] = useState('')

    // Convert to Excel Start
    const downloadXl = () => {
        setLoading(true)

        adminAxios.get(`/analyze/staff-work-data?from_date=${location?.state?.from_date}&to_date=${location?.state?.to_date}&type=${'staff-basie'}`).then((response) => {
            const workbook = exportToExcel(response.data.data);
            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

            const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const filename = 'staff_works.xlsx';

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
                setLoading(false)
            }
        })
    }

    const exportToExcel = (datas) => {

        const workbook = XLSX.utils.book_new();
        datas.forEach((staff, index) => {
            const sheetName = staff.full_name;
            const workSheetData = staff.dates.flatMap((date) => {
                const punch = {
                    date: date.date,
                    type: 'punch',
                    work: '',
                    start: date.punch.in,
                    end: date.punch.out,
                    duration: `${parseInt(date.punch.duration / 60) || '< 1'} min`
                }
                let overTime = {
                    date: date.date,
                    type: 'over time',
                    work: '',
                    start: date.over_time.in,
                    end: date.over_time.out,
                    duration: `${parseInt(date.over_time.duration / 60) || '< 1'} min`
                }
                overTime = date?.over_time?.in ? [overTime] : []
                let lunchBreak = {
                    date: date.date,
                    type: 'lunch break',
                    work: '',
                    start: date.lunch_break.start,
                    end: date.lunch_break.end,
                    duration: `${parseInt(date.lunch_break.duration / 60) || '< 1'} min`
                }
                lunchBreak = date?.lunch_break?.start ? [lunchBreak] : []
                const regular = date.regular_work.map((workObj) => ({
                    date: date.date,
                    type: 'regular work',
                    work: workObj.work,
                    start: workObj.start,
                    end: workObj.end,
                    duration: workObj.duration
                }));
                const extra = date.extra_work.map((workObj) => ({
                    date: date.date,
                    type: 'extra work',
                    work: workObj.work,
                    start: workObj.start,
                    end: workObj.end,
                    duration: workObj.duration
                }));
                const breaks = date.break.map((obj) => ({
                    date: date.date,
                    type: 'break',
                    work: '',
                    start: obj.start,
                    end: obj.end,
                    duration: `${parseInt(obj.duration / 60) || '< 1'} min`
                }));
                return [punch, ...regular, ...extra, ...breaks, ...overTime, ...lunchBreak, '']
            })

            const worksheet = XLSX.utils.json_to_sheet(workSheetData);
            XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
        })
        setLoading(false)
        return workbook;
    };

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
                        <button title='Download xl file' onClick={downloadXl}><span
                            className={loading && 'loading-icon'}>{loading ? <BiLoaderAlt /> : <RiFileExcel2Fill />}
                        </span> <span className='text'>Download Excel</span>  </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TopBar