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
const SearchCustomer = lazy(() => import('../pages/user/search-customer/SearchCustomer'))


function User() {

  let isAuthenticated = false
  const dispatch = useDispatch()
  const { internet } = useSelector((state) => state.systemInfo)
  const [pageHead, setPageHead] = useState({ title: null, desc: null })
  const acc_tkn = Cookies.get('_acc_tkn');
  const rfs_tkn = Cookies.get('_rfs_tkn');
  const ACC_ID = Cookies.get('ACC_ID');
  const DVC_ID = Cookies.get('DVC_ID');

  if (acc_tkn && ACC_ID && DVC_ID && rfs_tkn) {
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
          {/* Leave App */}
          <Route path='/leave-app' element={<PrivateRoute element={<LeaveApp setPageHead={setPageHead} />} isAuthenticated={isAuthenticated} />} />
          {/* Customer Search */}
          <Route path='/search-customer' element={<PrivateRoute element={<SearchCustomer setPageHead={setPageHead} />} isAuthenticated={isAuthenticated} />} />


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

