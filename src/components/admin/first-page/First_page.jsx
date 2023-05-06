import React, { useState } from 'react'
import './first-page.scss'
import { useSelector } from 'react-redux'
import { IoCloseCircleOutline } from 'react-icons/io5'
import Add_designation from '../models/Add_designation'
import Select_designation from '../models/Select_designation'
import Choose_dates from '../models/Choose_dates'

function First_page() {
  const { admin } = useSelector((state) => state.adminAuth)
  const [model, setModel] = useState(null)
  return (
    <div className='first-page'>
      <div className="container">
        <div className="top">
          <h5>User name : {admin?.USER_NAME}</h5>
        </div>
        <div className="bottom">
          <div className="boader">
            <div className="button-div">
              <button onClick={() => setModel('ADD NEW DESIGNATION')}>ADD NEW DESIGNATION</button>
            </div>
            <div className="button-div">
              <button onClick={() => setModel('SELECT DESIGNATION')}>
                ADD NEW WORK TO A DESIGNATION</button>
            </div>
            <div className="button-div" >
              <button onClick={() => setModel('SELECT DATES')} >VIEW STAFF WORK DETAILS
              </button>
            </div>
          </div>
        </div>
      </div>
      {model ?
        <>
          <div className="model" >
            <div className="boader">
              <div className="shadow" onClick={() => setModel(null)}></div>
              <div className="box">
                <div className="header">
                  <div className="title">
                    <h5>{model}</h5>
                  </div>
                  <div className="close-icon" onClick={() => setModel(null)}>
                    <IoCloseCircleOutline />
                  </div>
                </div>
                <div className="content">
                  {model === 'ADD NEW DESIGNATION' ? <Add_designation setModel={setModel} /> : ""}
                  {model === 'SELECT DESIGNATION' ? <Select_designation setModel={setModel} /> : ""}
                  {model === 'SELECT DATES' ? <Choose_dates setModel={setModel} /> : ""}
                </div>
              </div>
            </div>
          </div>
        </> : ''}
    </div>
  )
}

export default First_page