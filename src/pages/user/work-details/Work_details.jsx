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
    const lastPunchData = workDetails?.punch_list?.[workDetails?.punch_list.length - 1] || {}
    if (lastPunchData?.in && !lastPunchData?.out) {
      setInWork(true)
    }

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