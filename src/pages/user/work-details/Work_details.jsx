import React, { useState } from 'react'
import './work-details.scss'
import { userAxios } from '../../../config/axios'
import Header from '../../../components/user/header/Header'
import Punching from '../../../components/user/punch/Punching'
import Work from '../../../components/user/work/Work'
import WorkDetails from '../../../components/user/semi-work-details/WorkDetails'
import SpinWithMessage from '../../../components/common/spinners/SpinWithMessage'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setWorkData, getPunchDetails } from '../../../redux/features/user/workdataSlice'
import { setRegularWork } from '../../../redux/features/user/dayWorksSlice'


function Work_details() {
  const dispatch = useDispatch()
  const { workDetails, isLoading } = useSelector((state) => state.workData)
  const { user } = useSelector((state) => state.userAuth)
  const { internet } = useSelector((state) => state.network)

  // Button Show & hide Status : false = hide , true : show
  const [punch, setPunch] = useState({ in: false, out: false })
  const [theBreak, setTheBreak] = useState({ start: false, end: false })
  const [lunchBreak, setLunchBreak] = useState({ start: false, end: false })
  const [overTime, setOverTime] = useState({ in: false, out: false })

  useEffect(() => {
    if (internet) {
      dispatch(getPunchDetails())
      userAxios.get('/works/' + user?.designation?.id).then((works) => {
        dispatch(setRegularWork(works.data.works))
      })
    }
    // eslint-disable-next-line
  }, [])

  useEffect(() => {

    if (workDetails?.punch_in && workDetails?.punch_out) {
      setPunch({ in: false, out: false })
      setTheBreak({ start: false, end: false })
      setLunchBreak({ start: false, end: false })
    } else if (!workDetails?.punch_in && !workDetails?.punch_out) {
      setPunch({ in: true, out: false })
      setTheBreak({ start: false, end: false })
      setLunchBreak({ start: false, end: false })
      setOverTime({ in: false, out: false })
    } else if (workDetails?.punch_in && !workDetails?.punch_out) {
      setPunch({ in: false, out: true })
      setTheBreak({ start: true, end: false })
      setLunchBreak({ start: true, end: false })

      // Lunch Break
      if (workDetails?.lunch_break?.start && workDetails?.lunch_break?.end) {
        setLunchBreak({ start: false, end: false })
      } else if (workDetails?.lunch_break?.start && !workDetails?.lunch_break?.end) {
        setLunchBreak({ start: false, end: true })
        setPunch({ in: false, out: false })
        setTheBreak({ start: false, end: false })
      }
      // Break
      if (workDetails?.break?.start && workDetails?.break?.end && !workDetails?.lunch_break?.start) {
        setTheBreak({ start: true, end: false })
      } else if (workDetails?.break?.start && !workDetails?.break?.end) {
        setPunch({ in: false, out: false })
        setTheBreak({ start: false, end: true })
        setLunchBreak({ start: false, end: false })
      }
    }

    if (workDetails?.over_time?.in && workDetails?.over_time?.out) {
      setOverTime({ in: false, out: false })
      setTheBreak({ start: false, end: false })
      setLunchBreak({ start: false, end: false })
    } else if (!workDetails?.over_time?.in && !workDetails?.over_time?.out && workDetails?.punch_out) {
      setOverTime({ in: true, out: false })
      setTheBreak({ start: false, end: false })
      setLunchBreak({ start: false, end: false })
    } else if (workDetails?.over_time?.in && !workDetails?.over_time?.out) {
      setOverTime({ in: false, out: true })
      setTheBreak({ start: true, end: false })
      setLunchBreak({ start: true, end: false })

      // Lunch Break
      if (workDetails?.lunch_break?.start && workDetails?.lunch_break?.end) {
        setLunchBreak({ start: false, end: false })
      } else if (workDetails?.lunch_break?.start && !workDetails?.lunch_break?.end) {
        setLunchBreak({ start: false, end: true })
        setOverTime({ in: false, out: false })
        setTheBreak({ start: false, end: false })
      }
      // Break
      if (workDetails?.break?.start && workDetails?.break?.end && !workDetails?.lunch_break?.start) {
        setTheBreak({ start: true, end: false })
      } else if (workDetails?.break?.start && !workDetails?.break?.end) {
        setOverTime({ in: false, out: false })
        setTheBreak({ start: false, end: true })
        setLunchBreak({ start: false, end: false })
      }
    }


    // Check If Auto PunchOut
    const checkIfAutoPunchOut = setInterval(() => {
      if (workDetails?.punch_in) {
        const [punchOutHour, punchOutMinute] = user?.designation?.auto_punch_out.split(':');
        const [nowHour, nowMinute] = new Date().toTimeString().split(':');
        if ((nowHour + nowMinute) >= (punchOutHour + punchOutMinute) && workDetails?.punch_out === null
          && workDetails?.punch_in) {
          userAxios.get('/punch-details').then((response) => {
            if (response.data?.work_details?.punch_out) {
              dispatch(setWorkData({
                ...workDetails,
                punch_out: response.data?.work_details?.punch_out,
                auto_punch_out: true,
                break: {
                  ...workDetails?.break,
                  end: response.data?.work_details?.break?.end,
                  duration: response.data?.work_details?.break?.duration,
                },
                lunch_break: {
                  ...workDetails.lunch_break,
                  end: response.data?.work_details?.lunch_break?.end,
                  duration: response.data?.work_details?.lunch_break?.duration,
                }
              }))
              clearInterval(checkIfAutoPunchOut);
            }
          })
        }
      }
    }, 10000)

    return () => {
      clearInterval(checkIfAutoPunchOut);
    };
    // eslint-disable-next-line
  }, [workDetails])


  return (
    <div className='work-details-page'>
      <div className="header-div">
        <Header />
      </div>
      <div className="container content">
        {isLoading ? <>
          <div className='no-data'>
            <SpinWithMessage message={'Loading...'} />
          </div>
        </>
          : <>
            <div className="section-one">
              <div className="left">
                <Punching punch={punch} theBreak={theBreak} lunchBreak={lunchBreak} overTime={overTime} />
              </div>
              <div className="right">
                <WorkDetails />
              </div>
            </div>
            <div className="section-two">
              <Work punch={punch} theBreak={theBreak} lunchBreak={lunchBreak} overTime={overTime} />
            </div>
          </>}
      </div>
    </div>
  )
}

export default Work_details