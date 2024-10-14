import React from 'react'
import * as XLSX from 'xlsx';
import { getTimeFromSecond, stringToLocalTime } from '../../../assets/javascript/date-helper'
import SingleButton from '../../common/buttons/SingleButton';
import { SiMicrosoftexcel } from "react-icons/si";


function DownloadButton({ fullData, selectDay, staff }) {

    // Convert to Excel Start
    const handleOneDayDownload = () => {
        const data = fullData.filter((day) => new Date(day.date).getDate() === new Date(selectDay).getDate())?.[0]

        const workbook = XLSX.utils.book_new();
        const sheetName = new Date(data.date).toDateString()
        const sheetData = data?.staff_list?.map((staff) => {
            return {
                'FULL NAME': staff?.full_name,
                'LEAVE STATUS': staff?.leave_type,
                'FIRST PUNCH IN': staff?.punch_list?.[0] ? stringToLocalTime(staff?.punch_list?.[0]?.in) : '',
                'LAST PUNCH OUT': staff?.punch_list?.[0] ? stringToLocalTime(staff?.punch_list?.[staff?.punch_list?.length - 1]?.out) : '',
                'BREAK COUNT': staff?.punch_list?.length - 1 || 0,
                'T DURATION': getTimeFromSecond(staff?.total_working_time || 0)
            }
        })

        const worksheet = XLSX.utils.json_to_sheet(sheetData);
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
        downloadFile(workbook, `staff_works - ${new Date(data.date).toDateString()}`)
    }

    const handleAllDayDownload = () => {

        const workbook = XLSX.utils.book_new();

        fullData.forEach((day, index) => {
            const sheetName = new Date(day.date).toDateString()
            const sheetData = day?.staff_list?.map((staff) => {
                return {
                    'FULL NAME': staff?.full_name,
                    'LEAVE STATUS': staff?.leave_type,
                    'FIRST PUNCH IN': staff?.punch_list?.[0] ? stringToLocalTime(staff?.punch_list?.[0]?.in) : '',
                    'LAST PUNCH OUT': staff?.punch_list?.[0] ? stringToLocalTime(staff?.punch_list?.[staff?.punch_list?.length - 1]?.out) : '',
                    'BREAK COUNT': staff?.punch_list?.length - 1 || 0,
                    'T DURATION': getTimeFromSecond(staff?.total_working_time || 0)
                }
            })

            const worksheet = XLSX.utils.json_to_sheet(sheetData);
            XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
        })

        downloadFile(workbook, `staff_works`)
    }

    const handleAllStaffDayDownload = () => {

        const workbook = XLSX.utils.book_new();
        const sheetName = `Monthly works`
        const sheetData = fullData?.day_list?.map((day) => {
            return {
                'DATE': new Date(day?.date),
                'LEAVE STATUS': day?.leave_type,
                'FIRST PUNCH IN': day?.punch_list?.[0] ? stringToLocalTime(day?.punch_list?.[0]?.in) : '',
                'LAST PUNCH OUT': day?.punch_list?.[0] ? stringToLocalTime(day?.punch_list?.[day?.punch_list?.length - 1]?.out) : '',
                'BREAK COUNT': day?.punch_list?.length - 1 || 0,
                'T DURATION': getTimeFromSecond(day?.total_working_time || 0)
            }
        })

        const worksheet = XLSX.utils.json_to_sheet(sheetData);
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

        downloadFile(workbook, `${fullData?.full_name} work data`)
    }

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
        }
    }

    // Convert to Excel End


    return (
        <div style={{ display: 'flex', gap: '10px' }}>
            {staff
                ? <>
                    <SingleButton name={'All day'} stIcon={<SiMicrosoftexcel />}
                        title='Download all days XL file' onClick={() => handleAllStaffDayDownload()} />
                </>
                : <>
                    <SingleButton name={'This day'} stIcon={<SiMicrosoftexcel />}
                        title='Download this day XL file' onClick={() => handleOneDayDownload()} />
                    <SingleButton name={'All day'} stIcon={<SiMicrosoftexcel />}
                        title='Download all days XL file' onClick={() => handleAllDayDownload()} />
                </>}

        </div>
    )
}

export default DownloadButton