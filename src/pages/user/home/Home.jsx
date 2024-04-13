import React, { useEffect, useState } from 'react'
import './home.scss'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { TimeBasedGreeting } from '../../../assets/javascript/date-helper'
import { useDispatch, useSelector } from 'react-redux';
import { BsQrCodeScan } from "react-icons/bs";
import { IoFingerPrint, IoLogoAppleAr } from "react-icons/io5";
import { MdOutlineMiscellaneousServices } from "react-icons/md";
import { LuListPlus } from "react-icons/lu";
import { HiUserGroup } from "react-icons/hi2";
import { BiMath } from "react-icons/bi";
import { getPunchDetails } from '../../../redux/features/user/workdataSlice'
import { userAxios } from '../../../config/axios'
import { setRegularWork } from '../../../redux/features/user/dayWorksSlice'
import { toast } from 'react-hot-toast'



function Home({ setPageHead }) {
  const dispatch = useDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const { user } = useSelector((state) => state.userAuth)
  const { internet } = useSelector((state) => state.systemInfo)
  const navigate = useNavigate()
  const { workDetails, isLoading } = useSelector((state) => state.workData)

  const [punch, setPunch] = useState({ in: false, out: false })
  const [theBreak, setTheBreak] = useState({ start: false, end: false })
  const [lunchBreak, setLunchBreak] = useState({ start: false, end: false })
  const [overTime, setOverTime] = useState({ in: false, out: false })




  useEffect(() => {
    if (!searchParams.get('page')) {
      setSearchParams(`page=home`)
    }

    if (internet) {
      dispatch(getPunchDetails())
      userAxios.get('/regular-work').then((works) => {
        dispatch(setRegularWork(works.data.data))
      }).catch((error) => {
        toast.error(error.response.data.message)
      })
    }

    setPageHead(() => ({ title: `Hi ${user?.first_name} ${user?.last_name},`, desc: `${TimeBasedGreeting()} !` }))
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
    <div className='home-page'>
      <div className="section-one-div">
        <div className="section-content">
          <div className="big-button">
            <BsQrCodeScan />
            <p>Scanner</p>
          </div>
          <div className="big-button" onClick={() => navigate('/punch-work?page=more')}>
            <IoFingerPrint />
            <p>Punch to Work</p>
          </div>
          <div className="big-button" onClick={() => navigate('/enter-today?page=more')}>
            <LuListPlus />
            <p>Enter today</p>
          </div>
        </div>
      </div>

      <div className="section-two-div">
        <div className="sub-title-div">
          <h4>App access</h4>
        </div>
        <div className="section-content">
          {(user?.designation?.allow_origins?.includes('Sales') || user?.designation?.allow_origins?.includes('SalesPro')
            || user?.designation?.allow_origins?.includes('Installation')) && <div className="app-item">
              <div className="icon-div" style={{ backgroundColor: "#0c1663" }}
                onClick={() => window.location.href = `http://localhost:3001?id=${user?._id}`}>
                <IoLogoAppleAr />
              </div>
              <p>Sales App</p>
            </div>}

          {(user?.designation?.allow_origins?.includes('Accountant')) && <div className="app-item">
            <div className="icon-div" style={{ backgroundColor: "#521f08" }}
              onClick={() => window.location.href = `http://localhost:3001?id=${user?._id}`}>
              <BiMath />
            </div>
            <p>Accounting <br></br> App</p>
          </div>}

          {(user?.designation?.allow_origins?.includes('PR_Service')) && <div className="app-item">
            <div className="icon-div" style={{ backgroundColor: "#52082f" }}
              onClick={() => window.location.href = `http://localhost:3001?id=${user?._id}`}>
              <MdOutlineMiscellaneousServices />
            </div>
            <p>Purifier Service</p>
          </div>}

          {(user?.designation?.allow_origins?.includes('PR_Admin')) && <div className="app-item">
            <div className="icon-div" style={{ backgroundColor: "#085212" }}
              onClick={() => window.location.href = `http://localhost:3001?id=${user?._id}`}>
              <IoLogoAppleAr />
            </div>
            <p>Purifier Admin</p>
          </div>}

          {(user?.designation?.allow_origins?.includes('ControlNex') || user?.designation?.allow_origins?.includes('Customer_Info')) &&
            <div className="app-item">
              <div className="icon-div" style={{ backgroundColor: "#046b5f" }}
                onClick={() => window.location.href = `http://localhost:3001?id=${user?._id}`}>
                <HiUserGroup />
              </div>
              <p>ControlNex <br></br> App</p>
            </div>}

          {(user?.designation?.allow_origins?.includes('WH_Service')) && <div className="app-item">
            <div className="icon-div" style={{ backgroundColor: "#4c046b" }}
              onClick={() => window.location.href = `http://localhost:3001?id=${user?._id}`}>
              <MdOutlineMiscellaneousServices />
            </div>
            <p>Whole house <br></br> Service</p>
          </div>}

          {(user?.designation?.allow_origins?.includes('WH_Admin')) && <div className="app-item">
            <div className="icon-div" style={{ backgroundColor: "#336b04" }}
              onClick={() => window.location.href = `http://localhost:3001?id=${user?._id}`}>
              <IoLogoAppleAr />
            </div>
            <p>Whole house <br></br> Admin</p>
          </div>
          }
        </div>
      </div>
    </div>
  )
}

export default Home