import React, { useState } from 'react'
import * as XLSX from 'xlsx';
import { useLocation } from 'react-router-dom'
import './staff_work_table.scss'
import { RiFileExcel2Fill } from 'react-icons/ri';
import { SlArrowDown, SlArrowUp } from 'react-icons/sl';

function Staff_work_table() {
  const location = useLocation()
  const staff_works = location?.state
  const [collapse, setCollapse] = useState('')

  const handleCollapse = (id) => {
    if (collapse === id) {
      setCollapse("")
    } else {
      setCollapse(id)
    }
  }

  const downloadXl = () => {
    const workbook = exportToExcel(staff_works);
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
    }
  }

  const exportToExcel = (datas) => {
    console.log(datas,'datas')
    const workbook = XLSX.utils.book_new();
    datas.forEach((staff, index) => {
      const sheetName = staff.staff_name;
      const workSheetData = staff.dates.flatMap((date) => {
        const regular = date.regular_work.map((workObj) => ({
          date: date.date,
          type: 'regular_work  ',
          work: workObj.work,
          start: workObj.start,
          end: workObj.end,
          duration: workObj.duration
        }));
        const extra = date.extra_work.map((workObj) => ({
          date: date.date,
          type: 'extra_work  ',
          work: workObj.work,
          start: workObj.start,
          end: workObj.end,
          duration: workObj.duration
        }));
        return [...regular, ...extra]
      })

      const worksheet = XLSX.utils.json_to_sheet(workSheetData);
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    })
    return workbook;
  };

  return (
    <div className='staff-table'>
      <div className="container">
        <div className="boader">
          {staff_works[0] ?
            <>
              <div className="top">
                <button onClick={downloadXl}><RiFileExcel2Fill /> DOWNLOAD DATA TO EXCEL</button>
              </div>
              <div className="bottom">
                {staff_works.map((staff) => {
                  return <div className="collapse-div" key={staff._id}>
                    <div className={collapse === staff._id ? "collapse-header boader" : "collapse-header"}
                      onClick={() => handleCollapse(staff._id)}>
                      <div className="left">
                        <h5>{staff.staff_name}</h5>
                      </div>
                      <div className="right">
                        <h5>{staff.designation}</h5>
                        {collapse === staff._id ? <SlArrowUp /> : <SlArrowDown />}
                      </div>
                    </div>
                    {collapse === staff._id ?
                      <div className="collapse-body">
                        <div className="table-div">
                          <table>
                            <tbody>
                              {staff.dates.map((date) => {
                                return <>
                                  <tr className='tr-date'>
                                    <td>DATE :</td>
                                    <td>{date.date}</td>
                                  </tr>
                                  <tr className='tr-head'>
                                    <td>Type</td>
                                    <td>Regular works :</td>
                                    <td>Time start</td>
                                    <td>Time end</td>
                                    <td>Duration</td>
                                  </tr>
                                  {date.regular_work?.[0] ?
                                    <>
                                      {date.regular_work.map((regular, index) => {
                                        return <tr >
                                          <td>{index === 0 ? "Regular works :" : ""}</td>
                                          <td>{regular.work}</td>
                                          <td>{regular.start}</td>
                                          <td>{regular.end}</td>
                                          <td>{regular.duration}</td>
                                        </tr>
                                      })}
                                    </>
                                    : ""}
                                  {date.extra_work?.[0] ?
                                    <>
                                      {date.extra_work.map((extra, index) => {
                                        return <tr >
                                          <td>{index === 0 ? "Extra works :" : ""}</td>
                                          <td>{extra.work}</td>
                                          <td>{extra.start}</td>
                                          <td>{extra.end}</td>
                                          <td>{extra.duration}</td>
                                        </tr>
                                      })}
                                    </>
                                    : ""}
                                  <tr>
                                    <td></td>
                                  </tr>
                                </>
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                      :
                      ""}
                  </div>
                })}
              </div>
            </> : <div className='no-item'>
              <h3>No Results</h3>
            </div>}
        </div>
      </div>
    </div>
  )
}

export default Staff_work_table