import React, { useState } from 'react'
import './first-page.scss'
import { useSelector } from 'react-redux'
import { IoCloseCircleOutline } from 'react-icons/io5'
import AddDesignation from '../models/Add_designation'
import SelectDesignation from '../models/Select_designation'
import ChooseDates from '../models/Choose_dates'
import { useNavigate } from 'react-router-dom'

function First_page() {
  const { admin } = useSelector((state) => state.adminAuth)
  const [model, setModel] = useState(null)
  const navigate = useNavigate()
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
            <div className="button-div" >
              <button onClick={() => navigate('/admin/allow-access-to-sales')} >ALLOW ACCESS TO SALES
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
                  {model === 'ADD NEW DESIGNATION' ? <AddDesignation setModel={setModel} /> : ""}
                  {model === 'SELECT DESIGNATION' ? <SelectDesignation setModel={setModel} /> : ""}
                  {model === 'SELECT DATES' ? <ChooseDates setModel={setModel} /> : ""}
                </div>
              </div>
            </div>
          </div>
        </> : ''}
    </div>
  )
}

export default First_page