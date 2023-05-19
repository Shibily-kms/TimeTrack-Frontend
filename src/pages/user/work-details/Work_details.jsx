import React, { useState } from 'react'
import './work-details.scss'
import { userAxios } from '../../../config/axios'
import Header from '../../../components/user/header/Header'
import Punching from '../../../components/user/punch/Punching'
import Work from '../../../components/user/work/Work'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setWorkData } from '../../../redux/features/user/workdataSlice'
import { setRegularWork } from '../../../redux/features/user/dayWorksSlice'

function Work_details() {
  const dispatch = useDispatch()
  const { workDetails } = useSelector((state) => state.workData)
  const { user } = useSelector((state) => state.userAuth)
  const [punchIn, setPunchIn] = useState(false)
  const [punchOut, setPunchOut] = useState(false)
  const [startBreak, setStartBreak] = useState(false)
  const [endBreak, setEndBreak] = useState(false)

  useEffect(() => {
    if (!workDetails) {
      userAxios.get('/punch-details').then((response) => {
        userAxios.get('/works/' + user?.designation?.id).then((works) => {
          dispatch(setRegularWork(works.data.works))
          dispatch(setWorkData({ ...response.data.work_details, offBreak: [] }))
        })
      })
    }
  }, [])


  useEffect(() => {
    if (workDetails?.punch_in) {
      setPunchIn(true)
      setPunchOut(false)
      setStartBreak(false)
      setEndBreak(true)
    } else {
      setPunchOut(true)
      setStartBreak(true)
      setEndBreak(true)
    }
    if (workDetails?.punch_out) {
      setPunchIn(true)
      setPunchOut(true)
      setStartBreak(true)
      setEndBreak(true)
    }
    if (workDetails?.break?.start && workDetails?.break?.end && !workDetails?.punch_out) {
      setStartBreak(false)
    } else if (workDetails?.break?.start && !workDetails?.break?.end) {
      setPunchOut(true)
      setStartBreak(true)
      setEndBreak(false)
    }
  }, [workDetails])



  return (
    <div className='work-details-page'>
      <div className="header-div">
        <Header />
      </div>
      <div className="container content">
        <div className="left">
          <Punching punchIn={punchIn}
            punchOut={punchOut} startBreak={startBreak} endBreak={endBreak} />
        </div>
        <div className="right">
          <Work punchIn={punchIn}
            punchOut={punchOut} startBreak={startBreak} endBreak={endBreak} />
        </div>
      </div>

    </div>
  )
}

export default Work_details