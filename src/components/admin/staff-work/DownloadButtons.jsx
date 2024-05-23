import React, { useState } from 'react'
import * as XLSX from 'xlsx';
import { getTimeFromSecond, stringToLocalTime } from '../../../assets/javascript/date-helper'
import { useSearchParams } from 'react-router-dom'
import { adminAxios } from '../../../config/axios';
import { toast } from '../../../redux/features/user/systemSlice';
import SingleButton from '../../common/buttons/SingleButton';
import { SiMicrosoftexcel } from "react-icons/si";
import { useDispatch } from 'react-redux';

function DownloadButton({ oneDay, staff }) {
    const [loading, setLoading] = useState('')
    const dispatch = useDispatch()
    // eslint-disable-next-line
    const [searchParams, setSearchParams] = useSearchParams()


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
            const workbook = exportToExcel(response.data);
            downloadFile(
                workbook,
                `staff_works ${oneDay.year}-${(oneDay.month + 1).toString().padStart(2, '0')}-${oneDay.date.toString().padStart(2, '0')}`
            )
        }).catch((error) => {
            dispatch(toast.push.error({ message: error.message }))
        })
    }

    const handleAllDayDownload = () => {
        setLoading('all')
        adminAxios.get('/analyze/staff-work-data', {
            params: {
                from_date: searchParams.get('month') + '-01',
                to_date: searchParams.get('month') + '31',
                type: 'staff-basie',
                staff_id: searchParams.get('staff') === 'all' ? null : searchParams.get('staff')
            }
        }).then((response) => {
            if (response.data?.[0]) {
                const workbook = exportToExcel(response.data);
                downloadFile(workbook, `${staff ? response.data?.[0]?.full_name + '-work' : 'staff_works'}`)
            } else {
                setLoading('')
                dispatch(toast.push.error({ message: 'No data!' }))
            }
        }).catch((error) => {
            toast.error(error.message)
        })
    }

    const exportToExcel = (datas) => {

        const workbook = XLSX.utils.book_new();
        datas.forEach((staff, index) => {
            const sheetName = staff.full_name;
            const workSheetData = staff.dates.flatMap((date) => {
                const punch = date?.punch_list?.map((obj, indx) => ({
                    date: date.date,
                    type: `Punch ${indx + 1}`,
                    work: '',
                    start: stringToLocalTime(obj?.in),
                    end: stringToLocalTime(obj?.out),
                    duration: getTimeFromSecond(obj?.duration) || '0m'
                }))

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

                return [...punch, ...regular, ...extra, '']
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
        <div style={{ display: 'flex', gap: '10px' }}>

            {oneDay?.count && !staff ? <SingleButton name={'This day'} stIcon={<SiMicrosoftexcel />}
                title='Download this day XL file' onClick={() => handleOneDayDownload()} loading={loading === 'one'} /> : null}

            <SingleButton name={'All day'} stIcon={<SiMicrosoftexcel />}
                title='Download all days XL file' onClick={() => handleAllDayDownload()} loading={loading === 'all'} />

        </div>
    )
}

export default DownloadButton