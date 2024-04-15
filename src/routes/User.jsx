import React, { useEffect, Suspense, lazy, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { userAxios } from '../config/axios'
import { resetOfflineData, doPunchOUt } from '../redux/features/user/workdataSlice'
import { setUser } from '../redux/features/user/authSlice'
import { toast } from 'react-hot-toast'
import PageLoading from '../components/common/spinners/PageLoading'
import SinglePage from '../components/common/page/SinglePage'

const Home = lazy(() => import('../pages/user/home/Home'))
const WorkDetails = lazy(() => import('../pages/user/work-details/Work_details'))
const PunchWork = lazy(() => import('../pages/user/punch-work/PunchWork'))
const NotFound = lazy(() => import('../pages/user/not-found/NotFound '))
const MorePage = lazy(() => import('../pages/user/more/MorePage'))
const Settings = lazy(() => import('../pages/user/settings/Settings'))


function User() {

  let isAuthenticated = false
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.userAuth)
  const { internet } = useSelector((state) => state.systemInfo)
  const { workDetails } = useSelector((state) => state.workData)
  const [pageHead, setPageHead] = useState({ title: null, desc: null })

  if (user?.token && localStorage.getItem('_aws_temp_tkn')) {
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
    <SinglePage pageHead={pageHead}>
      <Suspense fallback={<PageLoading />}>
        <Routes>
          <Route path='/' element={<PrivateRoute element={<Home setPageHead={setPageHead} />} isAuthenticated={isAuthenticated} />} />
          <Route path='/punch-work' element={<PrivateRoute element={<PunchWork setPageHead={setPageHead} />} isAuthenticated={isAuthenticated} />} />
          <Route path='/enter-today' element={<PrivateRoute element={<WorkDetails setPageHead={setPageHead} />} isAuthenticated={isAuthenticated} />} />
          <Route path='/settings' element={<PrivateRoute element={<Settings setPageHead={setPageHead} />} isAuthenticated={isAuthenticated} />} />
          <Route path='/more' element={<PrivateRoute element={<MorePage setPageHead={setPageHead} />} isAuthenticated={isAuthenticated} />} />


          {/* 404 Route */}
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </SinglePage>
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