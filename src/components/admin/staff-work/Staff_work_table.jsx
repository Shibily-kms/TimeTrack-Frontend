import React, { useState } from 'react'

import { useLocation } from 'react-router-dom'
import './staff_work_table.scss'
import Title from '../../common/title/Title'
import { RiFileExcel2Fill } from 'react-icons/ri';
import { SlArrowDown, SlArrowUp } from 'react-icons/sl';
import { stringToLocalTime } from '../../../assets/javascript/date-helper'
import { BiLoaderAlt } from 'react-icons/bi'

function Staff_work_table() {
  const location = useLocation()
  const staff_works = location?.state?.data
  const [collapse, setCollapse] = useState('')
  const [loading, setLoading] = useState(false)


  const handleCollapse = (id) => {
    if (collapse === id) {
      setCollapse("")
    } else {
      setCollapse(id)
    }
  }



  return (
    <div className='staff-table'>
      <div className="container">
        <div>
          <Title sub={'Staff work details'} />
        </div>
        <div className="boader">
          {staff_works?.[0] ?
            <>
              <div className="top">
                <div>
                  {location?.state?.dates?.from_date === location?.state?.dates?.to_date ?
                    <p>{`Date : ${location?.state?.dates?.from_date}`}</p>
                    : <>
                      <p>{`From : ${location?.state?.dates?.from_date}`}</p>
                      <p>{`To : ${location?.state?.dates?.to_date}`}</p>
                    </>
                  }
                </div>
                <button title='Download xl file' ><span
                  className={loading && 'loading-icon'}>{loading ? <BiLoaderAlt /> : <RiFileExcel2Fill />}
                </span> <span className='text'>Download Excel</span>  </button>
              </div>
              <div className="bottom">
                {staff_works.map((staff) => {
                  return <div className="collapse-div" key={staff.name}>
                    <div className={collapse === staff.name ? "collapse-header boader" : "collapse-header"}
                      onClick={() => handleCollapse(staff.name)}>
                      <div className="left">
                        <h5>{staff.full_name || staff.staff_name}</h5>
                      </div>
                      <div className="right">
                        <h5>{staff.designation}</h5>
                        {collapse === staff.name ? <SlArrowUp /> : <SlArrowDown />}
                      </div>
                    </div>
                    {collapse === staff.name ?
                      <div className="collapse-body">
                        <div className="table-div">
                          <table>
                            <tbody>
                              {staff.dates.map((date) => {
                                return <>
                                  <tr className='tr-date'>
                                    <td>DATE :</td>
                                    <td>{date.date}</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                  </tr>
                                  <tr className='tr-head'>
                                    <td>Type</td>
                                    <td>Items</td>
                                    <td>Time start</td>
                                    <td>Time end</td>
                                    <td>Duration (min)</td>
                                  </tr>

                                  <tr style={{ color: 'gray' }}>
                                    <td>Punch</td>
                                    <td>{date.auto_punch_out ? <h5>Auto out</h5> : ''}</td>
                                    <td>{stringToLocalTime(date.punch_in, true)}</td>
                                    <td>{date.punch_out ? stringToLocalTime(date.punch_out, true) : '-'}</td>
                                    <td>{date.duration ? parseInt(date.duration / 60) || '<1' : '-'}</td>
                                  </tr>
                                  {date.over_time.in ?
                                    <tr style={{ color: 'gray' }}>
                                      <td>Over Time</td>
                                      <td>{date.over_time?.auto ? <h5>Auto out</h5> : ''}</td>
                                      <td>{stringToLocalTime(date.over_time.in, true)}</td>
                                      <td>{date.over_time.out ? stringToLocalTime(date.over_time.out, true) : '-'}</td>
                                      <td>{date.over_time.duration ? parseInt(date.over_time.duration / 60) || '<1' : '-'}</td>
                                    </tr>
                                    : ""}

                                  {date.regular_work?.[0] ?
                                    <>
                                      {date.regular_work.map((regular, index) => {
                                        return <tr >
                                          <td>{index === 0 ? "Regular works :" : ""}</td>
                                          <td>{regular.work}</td>
                                          <td>{stringToLocalTime(regular.start, true)}</td>
                                          <td>{stringToLocalTime(regular.end, true)}</td>
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
                                          <td>{stringToLocalTime(extra.start, true)}</td>
                                          <td>{stringToLocalTime(extra.end, true)}</td>
                                          <td>{extra.duration}</td>
                                        </tr>
                                      })}
                                    </>
                                    : ""}
                                  {date.break?.[0] ?
                                    <>
                                      {date.break.map((breaks, index) => {
                                        return <tr >
                                          <td>{index === 0 ? "Breaks :" : ""}</td>
                                          <td></td>
                                          <td>{stringToLocalTime(breaks.start, true)}</td>
                                          <td>{stringToLocalTime(breaks.end, true)}</td>
                                          <td>{parseInt(breaks.duration / 60) || '<1'}</td>
                                        </tr>
                                      })}
                                    </>
                                    : ""}
                                  {date.lunch_break.start ?
                                    <tr >
                                      <td>Lunch Break :</td>
                                      <td></td>
                                      <td>{stringToLocalTime(date.lunch_break.start, true)}</td>
                                      <td>{stringToLocalTime(date.lunch_break.end, true)}</td>
                                      <td>{parseInt(date.lunch_break.duration / 60) || '<1'}</td>
                                    </tr>
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