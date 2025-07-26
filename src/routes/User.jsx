import React, { useEffect, Suspense, lazy, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Cookies from 'js-cookie';
import { getPunchDetails } from '../redux/features/user/workdataSlice'
import PageLoading from '../components/common/spinners/PageLoading'
import SinglePage from '../components/common/page/SinglePage'
import NotFound from '../pages/user/not-found/NotFound '


const Home = lazy(() => import('../pages/user/home/Home'))
const MyTodo = lazy(() => import('../pages/user/my-todo/MyTodo'))
const MorePage = lazy(() => import('../pages/user/more/MorePage'))
const Settings = lazy(() => import('../pages/user/settings/Settings'))
const MyAccount = lazy(() => import('../pages/user/my-account/MyAccount'))
const PunchReport = lazy(() => import('../pages/user/punch-report/PunchReport'))
const LeaveApp = lazy(() => import('../pages/user/leave-app/LeaveApp'))
const Profile = lazy(() => import('../components/user/my-account/Profile'))
const Devices = lazy(() => import('../components/user/my-account/Devices'))
const SecurityPrivacy = lazy(() => import('../components/user/my-account/SecurityPrivacy'))
const MyProspects = lazy(() => import('../pages/user/my-prospects/MyProspects'))
const ProspectCU = lazy(() => import('../pages/user/my-prospects/ProspectCU'))
const ProfileComplete = lazy(() => import('../pages/user/profile-complete/ProfileComplete'))
const SearchCustomer = lazy(() => import('../pages/user/search-customer/SearchCustomer'))
const ViewCustomer = lazy(() => import('../pages/user/search-customer/ViewCustomer'))


function User({ }) {

  let isAuthenticated = false
  const dispatch = useDispatch()
  const { internet } = useSelector((state) => state.systemInfo)
  const { user } = useSelector((state) => state.userAuth)
  const [pageHead, setPageHead] = useState({ title: null, desc: null })
  const DVC_ID = Cookies.get('DVC_ID');
  const rfs_tkn = Cookies.get('_rfs_tkn');

  if ((DVC_ID && DVC_ID.length === 32) && rfs_tkn) {
    isAuthenticated = true
  }


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
          {/* Home */}
          <Route path='/' element={<PrivateRoute element={<Home setPageHead={setPageHead} />} isAuthenticated={isAuthenticated} />} />

          {/* Todo */}
          <Route path='/my-todo' element={<PrivateRoute element={<MyTodo setPageHead={setPageHead} />} isAuthenticated={isAuthenticated} />} />

          <Route path='/monthly-report' element={<PrivateRoute element={<PunchReport setPageHead={setPageHead} />} isAuthenticated={isAuthenticated} />} />
          <Route path='/settings' element={<PrivateRoute element={<Settings setPageHead={setPageHead} />} isAuthenticated={isAuthenticated} />} />
          <Route path='/more' element={<PrivateRoute element={<MorePage setPageHead={setPageHead} />} isAuthenticated={isAuthenticated} />} />

          <Route path='/my-account' element={<PrivateRoute element={<MyAccount setPageHead={setPageHead} />} isAuthenticated={isAuthenticated} />} >
            {/* Sub-routes of MyAccount */}
            <Route index element={<Profile />} />  {/* This will render when /my-account is accessed */}
            <Route path='profile' element={<Profile />} />
            <Route path='your-device' element={<Devices />} />
            <Route path='security-privacy' element={<SecurityPrivacy />} />
            <Route path='origin-access' element={<Profile />} />
          </Route>

          {/* profile status complete */}
          <Route path='/my-account/profile/complete-info' element={<PrivateRoute element={<ProfileComplete setPageHead={setPageHead} />} isAuthenticated={isAuthenticated} />} />

          {/* Leave App */}
          <Route path='/leave-app' element={<PrivateRoute element={<LeaveApp setPageHead={setPageHead} />} isAuthenticated={isAuthenticated} />} />

          {/* My prospects */}
          <Route path='/my-prospects' element={<PrivateRoute element={<MyProspects setPageHead={setPageHead} />} isAuthenticated={isAuthenticated} />} />
          <Route path='/my-prospects/register' element={<PrivateRoute element={<ProspectCU setPageHead={setPageHead} />} isAuthenticated={isAuthenticated} />} />

          {/* Search customer */}
          {user?.allowed_origins?.some(access => ['ttur_customer_read', 'ttur_customer_download'].includes(access)) && <>
            <Route path='/customer/search' element={<PrivateRoute element={<SearchCustomer setPageHead={setPageHead} />} isAuthenticated={isAuthenticated} />} />
            <Route path='/customer/:cid/view' element={<PrivateRoute element={<ViewCustomer setPageHead={setPageHead} />} isAuthenticated={isAuthenticated} />} />
          </>}


          {/* 404 Route */}
          <Route path='/*' element={<PrivateRoute element={<NotFound setPageHead={setPageHead} />} isAuthenticated={isAuthenticated} />} />
        </Routes>
      </Suspense>
    </SinglePage>
  )
}

export default User



function PrivateRoute({ element, isAuthenticated, }) {
  return isAuthenticated ? element : <Navigate to="/auth/sign-in" />;
}

