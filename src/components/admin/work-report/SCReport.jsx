import React, { useState } from 'react'
import * as XLSX from 'xlsx';
import './style.scss'
import { BiLoaderAlt } from 'react-icons/bi'
import { getTimeFromSecond } from '../../../assets/javascript/date-helper'

function SCReport({ report, thisMonth, date }) {
    const [loading, setLoading] = useState(false)

    const downloadFile = (workbook, filename) => {
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

        const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        filename = filename + '.xlsx';

        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            // For IE browser
            window.navigator.msSaveOrOpenBlob(data, filename);
            setLoading(false)
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
    }

    const exportToExcel = (datas) => {

        const workbook = XLSX.utils.book_new();
        const sheetName = 'SC Report';
        let workSheetData = []
        datas.map((data, index) => {
            const obj = {
                SlNo: index + 1,
                Name: data.full_name,
                Days: data.worked_days,
                Hours: getTimeFromSecond(data.worked_time + data.used_CF) || "0m",   // Don't use for this month
                "Total Salary": data.allowed_salary
            }
            workSheetData.push(obj)
            return obj;
        })

        const worksheet = XLSX.utils.json_to_sheet(workSheetData);
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
        return workbook;
    };

    const handleDownload = () => {
        setLoading(true)
        const workbook = exportToExcel(report);
        downloadFile(workbook, `SC Report - ${date}`)
    }

    return (
        <div className='SCReport'>
            {!thisMonth && report[0] &&
                <button onClick={handleDownload}>
                    {loading ? <span className='loading-icon'><BiLoaderAlt /></span> : <span>SC</span>}
                    <span className='text' title='Salary Calculation Report'>Report</span>
                </button>
            }
        </div>
    )
}

export default SCReport