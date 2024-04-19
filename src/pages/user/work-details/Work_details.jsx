import React, { useState } from 'react'
import './work-details.scss'
import { userAxios } from '../../../config/axios'
import Work from '../../../components/user/work/Work'
import WorkDetails from '../../../components/user/semi-work-details/WorkDetails'
import SpinWithMessage from '../../../components/common/spinners/SpinWithMessage'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getPunchDetails } from '../../../redux/features/user/workdataSlice'
import { setRegularWork } from '../../../redux/features/user/dayWorksSlice'
import { toast } from '../../../redux/features/user/systemSlice'
import { YYYYMMDDFormat } from '../../../assets/javascript/date-helper'


function Work_details({ setPageHead }) {
  const dispatch = useDispatch()
  const { workDetails, isLoading } = useSelector((state) => state.workData)
  const { user } = useSelector((state) => state.userAuth)
  const { internet } = useSelector((state) => state.systemInfo)
  const [inWork, setInWork] = useState(false)

  useEffect(() => {
    if (internet) {
      if (workDetails?.date !== YYYYMMDDFormat(new Date())) {
        dispatch(getPunchDetails())
      }
      userAxios.get('/regular-work').then((works) => {
        dispatch(setRegularWork(works.data))
      }).catch((error) => {
        dispatch(toast.push.error({ message: error.message }))
      })
    }

    setPageHead({ title: 'Enter Today' })
    // eslint-disable-next-line
  }, [])

  useEffect(() => {

    // Check punchIn or OverIn
    if ((workDetails?.punch_in && !workDetails?.punch_out) || (workDetails?.over_time?.in && !workDetails?.over_time?.out)) {

      // Check On Break or Lunch break
      if ((workDetails?.break?.[workDetails?.break?.length - 1]?.end || !workDetails?.break?.[0]) &&
        (workDetails?.lunch_break?.end || !workDetails?.lunch_break)
      ) {
        setInWork(true)
      }
    }


    let checkIfAutoPunchOut = null

    if (!workDetails?.punch_out && workDetails?.punch_in) {
      // Check If Auto PunchOut
      checkIfAutoPunchOut = setInterval(() => {
        if (workDetails?.punch_in) {
          const [punchOutHour, punchOutMinute] = user?.designation?.auto_punch_out.split(':');
          const [nowHour, nowMinute] = new Date().toTimeString().split(':');
          if ((nowHour + nowMinute) >= (punchOutHour + punchOutMinute) && workDetails?.punch_out === null
            && workDetails?.punch_in) {
            dispatch(getPunchDetails())
            clearInterval(checkIfAutoPunchOut);
          }
        }
      }, 10000)
    }

    return () => {
      if (checkIfAutoPunchOut) clearInterval(checkIfAutoPunchOut);
    };
    // eslint-disable-next-line
  }, [workDetails])




  return (
    <div className='work-details-page-div'>
      <div className="section-one-div">
        <WorkDetails />
      </div>
      <div className="content">
        {isLoading
          ? <SpinWithMessage load={true} fullView={true} />
          : <div className="section-two">
            <Work inWork={inWork} />
          </div>
        }
      </div>
    </div>
  )
}

export default Work_details