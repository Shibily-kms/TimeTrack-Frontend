import React, { useState } from 'react'
import './work-details.scss'
import { userAxios } from '../../../config/axios'
import Header from '../../../components/user/header/Header'
import Punching from '../../../components/user/punch/Punching'
import Work from '../../../components/user/work/Work'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setWorkData, clearWorkData } from '../../../redux/features/user/workdataSlice'
import { setRegularWork } from '../../../redux/features/user/dayWorksSlice'
import { toast } from 'react-toastify'

function Work_details() {
  const dispatch = useDispatch()
  const { workDetails } = useSelector((state) => state.workData)
  const { user } = useSelector((state) => state.userAuth)
  const [punchIn, setPunchIn] = useState(false)
  const [punchOut, setPunchOut] = useState(false)
  const [startBreak, setStartBreak] = useState(false)
  const [endBreak, setEndBreak] = useState(false)
  const [startLunchBreak, setStartLunchBreak] = useState(false)
  const [endLunchBreak, setEndLunchBreak] = useState(false)
  const [autoPunchOut, setAutoPunchOut] = useState(false)

  useEffect(() => {
    if (!workDetails || workDetails?.punch_out || new Date(workDetails?.punch_in).getDate() !== new Date().getDate()) {
      userAxios.get('/punch-details').then((response) => {
        userAxios.get('/works/' + user?.designation?.id).then((works) => {
          response.data.work_details.lunch_break = response.data.work_details?.lunch_break || {}
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
      setStartLunchBreak(false)
      setEndLunchBreak(true)
    } else {
      setPunchOut(true)
      setStartBreak(true)
      setEndBreak(true)
      setStartLunchBreak(true)
      setEndLunchBreak(true)
    }
    if (workDetails?.punch_out) {
      setPunchIn(true)
      setPunchOut(true)
      setStartBreak(true)
      setEndBreak(true)
      setStartLunchBreak(true)
      setEndLunchBreak(true)
    }
    if (workDetails?.break?.start && workDetails?.break?.end && !workDetails?.punch_out) {
      setStartBreak(false)
    } else if (workDetails?.break?.start && !workDetails?.break?.end) {
      setStartLunchBreak(true)
      setEndLunchBreak(true)
      setPunchOut(true)
      setStartBreak(true)
      setEndBreak(false)
    }

    if (workDetails?.lunch_break?.start && !workDetails?.lunch_break?.end) {
      setStartLunchBreak(true)
      setPunchOut(true)
      setStartBreak(true)
      setEndBreak(true)
      setEndLunchBreak(false)
    }
    if (workDetails?.lunch_break?.end) {
      setStartLunchBreak(true)
    }

     // Check If Auto PunchOut
     const checkIfAutoPunchOut = setInterval(() => {
      const [punchOutHour, punchOutMinute] = user?.designation?.auto_punch_out.split(':');
      const [nowHour, nowMinute] = new Date().toTimeString().split(':');
      if ((nowHour + nowMinute) >= (punchOutHour + punchOutMinute) && workDetails?.punch_out === null
        && workDetails?.punch_in) {
        userAxios.get('/punch-details').then((response) => {
          if (response.data?.work_details?.punch_out) {
            dispatch(clearWorkData())
            clearInterval(checkIfAutoPunchOut);
            setAutoPunchOut(true)
          }
        })
      }
    }, 10000)
    return () => {
      clearInterval(checkIfAutoPunchOut);
    };

  }, [workDetails])


  return (
    <div className='work-details-page'>
      <div className="header-div">
        <Header />
      </div>
      <div className="container content">
        <div className="left">
          <Punching punchIn={punchIn} punchOut={punchOut} startBreak={startBreak} endBreak={endBreak}
            startLunchBreak={startLunchBreak} endLunchBreak={endLunchBreak} />
        </div>
        <div className="right">
          <Work punchIn={punchIn} punchOut={punchOut} startBreak={startBreak} endBreak={endBreak}
            startLunchBreak={startLunchBreak} endLunchBreak={endLunchBreak} autoPunchOut={autoPunchOut} />
        </div>
      </div>
    </div>
  )
}

export default Work_details