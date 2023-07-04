import React, { useEffect } from 'react'
import SingUp from '../pages/user/sign-up/Sing_up'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Login from '../pages/user/login/Login'
import Home from '../pages/user/home/Home'
import WorkDetails from '../pages/user/work-details/Work_details'
import { userAxios } from '../config/axios'
import { resetOfflineData } from '../redux/features/user/workdataSlice'
import { toast } from 'react-toastify'


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
      if (workDetails?.offBreak?.[0] || workDetails?.regular_work?.[0] || workDetails?.extra_work?.[0]) {
        userAxios.post('/offline-recollect', workDetails).then((response) => {
          dispatch(resetOfflineData(response.data.lastBreak))
        }).catch((error) => {
          dispatch(resetOfflineData(error.response.data.lastBreak))
          toast.error(error.response.data.message)
        })
      }
    }
  }, [internet])



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