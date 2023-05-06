import React, { useState } from 'react'
import './work-details.scss'
import { userAxios } from '../../../config/axios'
import { useSelector } from 'react-redux'
import Header from '../../../components/user/header/Header'
import Punching from '../../../components/user/punch/Punching'
import Work from '../../../components/user/work/Work'
import { useEffect } from 'react'

function Work_details() {
  const [punchDetails, setPunchDetails] = useState([])
  const [punchIn, setPunchIn] = useState(false)
  const [punchOut, setPunchOut] = useState(false)
  const [startBreak, setStartBreak] = useState(false)
  const [endBreak, setEndBreak] = useState(false)

  useEffect(() => {
    userAxios.get('/punch-details').then((response) => {
      setPunchDetails(response.data.work_details)
    })
  }, [])


  useEffect(() => {
    if (punchDetails?.punch_in) {
      setPunchIn(true)
      setPunchOut(false)
      setStartBreak(false)
      setEndBreak(false)
    } else {
      setPunchOut(true)
      setStartBreak(true)
      setEndBreak(true)
    }
    if (punchDetails?.punch_out) {
      setPunchIn(true)
      setPunchOut(true)
      setStartBreak(true)
      setEndBreak(true)
    }
    if (!punchDetails?.break?.start) {
      setEndBreak(true)
    } else if (punchDetails?.break?.start && !punchDetails?.break?.end) {
      setPunchOut(true)
      setStartBreak(true)
    }
  }, [punchDetails])



  return (
    <div className='work-details-page'>
      <div className="header-div">
        <Header />
      </div>
      <div className="container content">
        <div className="left">
          <Punching punchDetails={punchDetails} setPunchDetails={setPunchDetails} punchIn={punchIn}
            punchOut={punchOut} startBreak={startBreak} endBreak={endBreak} />
        </div>
        <div className="right">
          <Work punchDetails={punchDetails} punchIn={punchIn}
            punchOut={punchOut} startBreak={startBreak} endBreak={endBreak} />
        </div>
      </div>

    </div>
  )
}

export default Work_details