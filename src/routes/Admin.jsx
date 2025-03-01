import React, { useEffect, Suspense, lazy, useState } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import NotFound from '../pages/admin/not-found/NotFound '
import PageLoading from '../components/common/spinners/PageLoading'
import AdminPage from '../components/common/page/AdminPage'
import Cookies from 'js-cookie';
import { useSelector } from 'react-redux'


const Dashboard = lazy(() => import('../pages/admin/dashboard/Dashboard'));
const AllStaffs = lazy(() => import('../pages/admin/all-staffs/AllStaffs'))
const AddStaff = lazy(() => import('../pages/admin/add-staff/AddStaff'))
const StaffProfile = lazy(() => import('../pages/admin/staff-profile/StaffProfile'))
const StaffSettings = lazy(() => import('../pages/admin/staff-settings/StaffSettings'))
const Designations = lazy(() => import('../pages/admin/designations/Designations'))
const Settings = lazy(() => import('../pages/admin/settings/Settings'))
const MonthlyReports = lazy(() => import('../pages/admin/work-report/WorkReport'))
const WorkAnalyze = lazy(() => import('../pages/admin/staff-works/WorkAnalyze'))
const QrGenerator = lazy(() => import('../pages/admin/qr-generator/QrGenerator'))
const LeaveApp = lazy(() => import('../pages/admin/leave-app/LeaveApp'))


function Admin() {

  let isAuthenticated = false
  const { user } = useSelector((state) => state.userAuth)
  const navigate = useNavigate()
  const [pageHead, setPageHead] = useState({ title: null, desc: null, right: null })
  const DVC_ID = Cookies.get('DVC_ID');
  const rfs_tkn = Cookies.get('_rfs_tkn');

  if ((DVC_ID && DVC_ID.length === 32) && rfs_tkn) {
    isAuthenticated = true
  }

  useEffect(() => {
    // Change Title
    document.title = `Time Track | Controller`;

    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (user?.allowed_origins?.filter((access) => access?.slice(0, 4) === 'ttcr').length < 1) {
      navigate('/')
    }
    // eslint-disable-next-line
  }, [user])

  return (
    <AdminPage pageHead={pageHead}>
      <Suspense fallback={<PageLoading />}>
        <Routes>
          {/* Dashboard */}
          <Route path='/' element={<PrivateRoute element={<Dashboard setPageHead={setPageHead} />} isAuthenticated={isAuthenticated} />} />

          {/* Staff List */}
          {user?.allowed_origins?.some(access => ['ttcr_stfAcc_read', 'ttcr_stfAcc_write'].includes(access)) &&
            <Route path='/staff-list' element={<PrivateRoute element={<AllStaffs setPageHead={setPageHead} />} isAuthenticated={isAuthenticated} />} />}
          {user?.allowed_origins?.some(access => ['ttcr_stfAcc_read', 'ttcr_stfAcc_write'].includes(access)) &&
            <Route path='/staff-list/:staff_id/profile' element={<PrivateRoute element={<StaffProfile setPageHead={setPageHead} />} isAuthenticated={isAuthenticated} />} />}
          {user?.allowed_origins?.includes('ttcr_stfAcc_write') &&
            <Route path='/staff-list/:staff_id/settings' element={<PrivateRoute element={<StaffSettings setPageHead={setPageHead} />} isAuthenticated={isAuthenticated} />} />}
          {user?.allowed_origins?.includes('ttcr_stfAcc_write') &&
            <Route path='/staff-list/account/new' element={<PrivateRoute element={<AddStaff setPageHead={setPageHead} />} isAuthenticated={isAuthenticated} />} />}

          {/* Leave letter */}
          {user?.allowed_origins?.some(access => ['ttcr_l2_read', 'ttcr_l2_write'].includes(access)) &&
            <Route path='/leave-letters' element={<PrivateRoute element={<LeaveApp setPageHead={setPageHead} />} isAuthenticated={isAuthenticated} />} />}

          {/* Analyzes */}
          {user?.allowed_origins?.some(access => ['ttcr_anlz_read', 'ttcr_anlz_write'].includes(access)) &&
            <Route path='/analyze/work-analyze' element={<PrivateRoute element={<WorkAnalyze setPageHead={setPageHead} />} isAuthenticated={isAuthenticated} />} />}

          {/* Salary Report */}
          {user?.allowed_origins?.some(access => ['ttcr_rprt_read', 'ttcr_rprt_write'].includes(access)) &&
            <Route path='/analyze/salary-reports' element={<PrivateRoute element={<MonthlyReports setPageHead={setPageHead} />} isAuthenticated={isAuthenticated} />} />}

          {/* QR */}
          {user?.allowed_origins?.some(access => ['ttcr_qr_write'].includes(access)) &&
            <Route path='/qr-generator' element={<PrivateRoute element={<QrGenerator setPageHead={setPageHead} />} isAuthenticated={isAuthenticated} />} />}

          {/* Designation */}
          {user?.allowed_origins?.some(access => ['ttcr_pro_read', 'ttcr_pro_write'].includes(access)) &&
            <Route path='/designation-list' element={<PrivateRoute element={<Designations setPageHead={setPageHead} />} isAuthenticated={isAuthenticated} />} />}

          {/* Settings */}
          <Route path='/settings' element={<PrivateRoute element={<Settings setPageHead={setPageHead} />} isAuthenticated={isAuthenticated} />} />

          {/* 404 Route */}
          <Route path='/*' element={<PrivateRoute element={<NotFound setPageHead={setPageHead} />} isAuthenticated={isAuthenticated} />} />
        </Routes>
      </Suspense>
    </AdminPage>
  )
}


function PrivateRoute({ element, isAuthenticated }) {
  return isAuthenticated ? element : <Navigate to="/" />;
}

export default Admin