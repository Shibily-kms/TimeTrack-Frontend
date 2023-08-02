import React, { useState } from 'react'
import './first-page.scss'
import { useSelector } from 'react-redux'
import { IoCloseCircleOutline } from 'react-icons/io5'
import ChooseDates from '../models/Choose_dates'
import Title from '../../common/title/Title'
import { useNavigate } from 'react-router-dom'

function First_page() {
  const { admin } = useSelector((state) => state.adminAuth)
  const [model, setModel] = useState(null)
  const navigate = useNavigate()
  return (
    <div className='first-page'>
      <div className="container">
        <div className="top">
          <Title userName={`User name: ${admin?.user_name}`} />
        </div>
        <div className="bottom">
          <div className="boader">
            <div className="button-div" >
              <button onClick={() => navigate('/admin/designations')} >DESIGNATIONS
              </button>
            </div>
            <div className="button-div" >
              <button onClick={() => setModel('SELECT DATES')} >STAFF WORK DETAILS
              </button>
            </div>
            <div className="button-div" >
              <button onClick={() => navigate('/admin/all-staffs')} >ALL STAFFS
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