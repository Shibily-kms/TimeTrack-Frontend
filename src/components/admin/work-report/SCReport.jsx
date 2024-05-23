import React, { useState } from 'react'
import * as XLSX from 'xlsx';
import './style.scss'
import { getTimeFromSecond } from '../../../assets/javascript/date-helper'
import SingleButton from '../../common/buttons/SingleButton';

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
        const sheetName1 = 'SC Report';
        let workSheetData = []
        datas.map((data, index) => {
            const obj = {
                SlNo: index + 1,
                Name: data.full_name,
                Days: data.worked_days,
                Hours: getTimeFromSecond(data.worked_time + data.used_CF) || "0m",   // Don't use for this month
                Attendance: data.allowed_salary,
                Allowance: data?.allowance?.reduce((acc, cur) => acc + cur?.amount, 0) || 0,
                Incentive: data?.incentive?.reduce((acc, cur) => acc + cur?.amount, 0) || 0,
                'For Round': data?.for_round_amount || 0,
                'Total Salary': 0,
            }
            obj['Total Salary'] = obj.Attendance + obj.Allowance + obj.Incentive + obj['For Round'];
          
            workSheetData.push(obj)
            return obj;
        })

        const worksheet = XLSX.utils.json_to_sheet(workSheetData);
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName1);
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
                <SingleButton name={'SC Report'} loading={loading} onClick={handleDownload} title='Salary Calculation Report' />
            }
        </div>
    )
}

export default SCReport