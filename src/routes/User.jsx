import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Login from '../pages/user/login/Login'
import Home from '../pages/user/home/Home'
import WorkDetails from '../pages/user/work-details/Work_details'
import PunchWork from '../pages/user/punch-work/PunchWork'
import NotFound from '../pages/user/not-found/NotFound '
import MorePage from '../pages/user/more/MorePage'
import Settings from '../pages/user/settings/Settings'
import { userAxios } from '../config/axios'
import { resetOfflineData, doPunchOUt } from '../redux/features/user/workdataSlice'
import { setUser } from '../redux/features/user/authSlice'
import { toast } from 'react-hot-toast'


function User() {

  let isAuthenticated = false
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.userAuth)
  const { internet } = useSelector((state) => state.systemInfo)
  const { workDetails } = useSelector((state) => state.workData)

  if (user?.token) {
    isAuthenticated = true
  }

  useEffect(() => {
    if (internet) {
      if (workDetails?.offBreak?.[0] || workDetails?.regular_work?.[0] || workDetails?.extra_work?.[0] ||
        workDetails?.lunch_break?.save === false) {
        userAxios.post('/offline-recollect', workDetails).then((response) => {
          dispatch(resetOfflineData(response.data.data))
        }).catch((error) => {
          toast.error(error.response.data.message)
          if (error.response.data.statusCode !== 409) {
            dispatch(resetOfflineData(error.response.data.data))
          } else {
            dispatch(doPunchOUt(error.response.data.data.punch_out))
          }
        })
      }
    }
    // eslint-disable-next-line
  }, [internet, workDetails?.over_time?.in])

  useEffect(() => {
    // Change Title
    document.title = `Staff Works`;
    if (user) {
      userAxios.get(`/profile?staffId=${user?._id}`).then((response) => {
        dispatch(setUser({ ...user, ...response.data.data }))
      }).catch((error) => {
        toast.error(error.response.data.message)
      })
    }
    // eslint-disable-next-line
  }, [])



  return (
    <Routes>
      <Route path='/' element={<PrivateRoute element={<Home />} isAuthenticated={isAuthenticated} />} />
      <Route path='/punch-work' element={<PrivateRoute element={<PunchWork />} isAuthenticated={isAuthenticated} />} />
      <Route path='/enter-today' element={<PrivateRoute element={<WorkDetails />} isAuthenticated={isAuthenticated} />} />
      <Route path='/settings' element={<PrivateRoute element={<Settings />} isAuthenticated={isAuthenticated} />} />
      <Route path='/more' element={<PrivateRoute element={<MorePage />} isAuthenticated={isAuthenticated} />} />
      <Route path='/login' element={<Login />} />

      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
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