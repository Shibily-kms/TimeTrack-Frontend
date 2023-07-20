import React, { useEffect } from 'react'
import SingUp from '../pages/user/sign-up/Sing_up'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Login from '../pages/user/login/Login'
import Home from '../pages/user/home/Home'
import WorkDetails from '../pages/user/work-details/Work_details'
import { userAxios } from '../config/axios'
import { resetOfflineData } from '../redux/features/user/workdataSlice'
import { setUser } from '../redux/features/user/authSlice'


function User() {

  let isAuthenticated = false
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.userAuth)
  const { internet } = useSelector((state) => state.network)
  const { workDetails } = useSelector((state) => state.workData)

  if (user?.token) {
    isAuthenticated = true
  }

  useEffect(() => {
    if (internet) {
      if (workDetails?.offBreak?.[0] || workDetails?.regular_work?.[0] || workDetails?.extra_work?.[0] ||
        workDetails?.lunch_break?.save === false) {
        userAxios.post('/offline-recollect', workDetails).then((response) => {
          dispatch(resetOfflineData(response.data.lastBreak))
        }).catch((error) => {
          dispatch(resetOfflineData(error.response.data.lastBreak))
        })
      }
    }
    // eslint-disable-next-line
  }, [internet])

  useEffect(() => {
    // Change Title
    document.title = `Staff Works`;

    userAxios.get(`/designations?id=${user?.designation?.id}`).then((response) => {
      let [hour, minute] = new Date().toTimeString().split(':');
      let nowTime = `${hour}:${minute}`
      if (user) {
        dispatch(setUser({
          ...user,
          designation: {
            ...user.designation,
            allow_sales: response.data.designation?.allow_sales || false,
            auto_punch_out: nowTime > '21:00' ? user?.designation?.auto_punch_out || response.data.designation?.auto_punch_out :
              response.data.designation?.auto_punch_out || '17:30',
          }
        }))
      }
    })
    // eslint-disable-next-line
  }, [])



  return (
    <Routes>
      <Route path='/' element={<PrivateRoute element={<Home />} isAuthenticated={isAuthenticated} />} />
      <Route path='/enter-work-details' element={<PrivateRoute element={<WorkDetails />} isAuthenticated={isAuthenticated} />} />
      <Route path='/sign-up' element={<SingUp />} />
      <Route path='/login' element={<Login />} />
    </Routes>
  )
}

function PrivateRoute({ element, isAuthenticated }) {
  return isAuthenticated ? (
    <Routes>
      <Route path='/' element={element} />
    </Routes>
  ) : (
    <Navigate to="/login" />
  )
}

export default User