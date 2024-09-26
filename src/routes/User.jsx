import React, { useEffect, Suspense, lazy, useState } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Cookies from 'js-cookie';
import { userAxios } from '../config/axios'
import { clearWorkData, setWorkData } from '../redux/features/user/workdataSlice'
import { setUser, logOut } from '../redux/features/user/authSlice'
import { getPunchDetails } from '../redux/features/user/workdataSlice'
import PageLoading from '../components/common/spinners/PageLoading'
import SinglePage from '../components/common/page/SinglePage'
import NotFound from '../pages/user/not-found/NotFound '
import { toast } from '../redux/features/user/systemSlice'
import { clearRegularWork, clearSyncRegularWork } from '../redux/features/user/dayWorksSlice'
import { doSignOut } from '../assets/javascript/auth-helper'
import RotateToken from '../components/common/rotateToken/RotateToken';


const Home = lazy(() => import('../pages/user/home/Home'))
const WorkDetails = lazy(() => import('../pages/user/work-details/Work_details'))
const PunchWork = lazy(() => import('../pages/user/punch-work/PunchWork'))
const MorePage = lazy(() => import('../pages/user/more/MorePage'))
const Settings = lazy(() => import('../pages/user/settings/Settings'))
const MyAccount = lazy(() => import('../pages/user/my-account/MyAccount'))
const EditProfile = lazy(() => import('../components/user/my-account-sub/EditProfile'))
const PunchReport = lazy(() => import('../pages/user/punch-report/PunchReport'))
const LeaveApp = lazy(() => import('../pages/user/leave-app/LeaveApp'))
const Profile = lazy(() => import('../components/user/my-account/Profile'))
const Devices = lazy(() => import('../components/user/my-account/Devices'))
const SecurityPrivacy = lazy(() => import('../components/user/my-account/SecurityPrivacy'))


function User() {

  let isAuthenticated = false
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.userAuth)
  const { internet } = useSelector((state) => state.systemInfo)
  const { workDetails } = useSelector((state) => state.workData)
  const { regular } = useSelector((state) => state.dayWorks)
  const [pageHead, setPageHead] = useState({ title: null, desc: null })
  const acc_tkn = Cookies.get('_acc_tkn');
  const rfs_tkn = Cookies.get('_rfs_tkn');
  const ACC_ID = Cookies.get('ACC_ID');
  const DVC_ID = Cookies.get('DVC_ID');

  if (acc_tkn && ACC_ID && DVC_ID && rfs_tkn) {
    isAuthenticated = true
  }

  useEffect(() => {

    // Offline data Sync to Server
    if (internet) {
      // Check any data for sync
      const syncRegularWork = regular?.filter((item) => item?.want_sync)
      const syncExtraWork = workDetails?.extra_work?.filter((item) => item?.want_sync)

      if (syncRegularWork?.[0] || syncExtraWork?.[0]) {

        dispatch(toast.push.info({ id: 'OFF_SYNC', message: 'Sync offline data...', icon: 'MdCloudSync', autoClose: false, doClose: false }))

        userAxios.post('/offline-recollect', {
          punch_id: workDetails._id,
          regular_work: syncRegularWork,
          extra_work: syncExtraWork,
          updated_date: workDetails?.updated_date || null
        }).then((response) => {
          // Set all work data form new response
          dispatch(setWorkData(response.data))
          // Clear regular work sync id
          dispatch(clearSyncRegularWork())
          // clear alert
          dispatch(toast.pull.single('OFF_SYNC'))

        }).catch((error) => {
          dispatch(toast.pull.single('OFF_SYNC'))
          dispatch(toast.push.error({ message: error.message }))
        })
      }
    }
    // eslint-disable-next-line
  }, [internet])


  useEffect(() => {
    // Change Title
    document.title = `Time Track | Alliance`;

    if (internet) {
      dispatch(getPunchDetails())
    }

    // eslint-disable-next-line
  }, [])

  return (
    <SinglePage pageHead={pageHead}>
    
      <Suspense fallback={<PageLoading />}>
        <Routes>
          <Route path='/' element={<PrivateRoute element={<Home setPageHead={setPageHead} />} isAuthenticated={isAuthenticated} />} />
          <Route path='/punch-report' element={<PrivateRoute element={<PunchReport setPageHead={setPageHead} />} isAuthenticated={isAuthenticated} />} />
          <Route path='/settings' element={<PrivateRoute element={<Settings setPageHead={setPageHead} />} isAuthenticated={isAuthenticated} />} />
          <Route path='/more' element={<PrivateRoute element={<MorePage setPageHead={setPageHead} />} isAuthenticated={isAuthenticated} />} />

          {(user?.punch_type === 'software' || (user?.punch_type === 'firstInScanner' && workDetails?.punch_list?.[0])) &&
            <Route path='/punch-work' element={<PrivateRoute element={<PunchWork setPageHead={setPageHead} />} isAuthenticated={isAuthenticated} />} />}
          <Route path='/enter-today' element={<PrivateRoute element={<WorkDetails setPageHead={setPageHead} />} isAuthenticated={isAuthenticated} />} />

          <Route path='/my-account' element={<PrivateRoute element={<MyAccount setPageHead={setPageHead} />} isAuthenticated={isAuthenticated} />} >
            {/* Sub-routes of MyAccount */}
            <Route index element={<Profile />} />  {/* This will render when /my-account is accessed */}
            <Route path='profile' element={<Profile />} />
            <Route path='your-device' element={<Devices />} />
            <Route path='security-privacy' element={<SecurityPrivacy />} />
            <Route path='origin-access' element={<Profile />} />
          </Route>


          <Route path='/profile/edit' element={<PrivateRoute element={<EditProfile setPageHead={setPageHead} />} isAuthenticated={isAuthenticated} />} />

          <Route path='/leave-app' element={<PrivateRoute element={<LeaveApp setPageHead={setPageHead} />} isAuthenticated={isAuthenticated} />} />

          {/* 404 Route */}
          <Route path="/*" element={<NotFound setPageHead={setPageHead} />} />
        </Routes>
      </Suspense>
    </SinglePage>
  )
}

export default User



function PrivateRoute({ element, isAuthenticated, }) {
  return isAuthenticated ? element : <Navigate to="/auth/sign-in" />;
}

